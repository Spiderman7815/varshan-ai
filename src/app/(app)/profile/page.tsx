
"use client";

import { useUser, useFirebase, useDoc, updateDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { deleteUser, updateProfile, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { ChevronRight, FileText, Info, Loader2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters").max(50, "Display name must be less than 50 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
    },
  });

  const userProfileRef = useMemoFirebase(() => {
    if (user) {
      return doc(firestore, "users", user.uid);
    }
    return null;
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    if (userProfile) {
      form.reset({
        displayName: userProfile.displayName || "",
      });
    } else if (user) {
       form.reset({
        displayName: user.displayName || user.email?.split('@')[0] || "",
      });
    }
  }, [userProfile, user, form]);

  async function onSubmit(values: ProfileFormValues) {
    if (!user || !auth.currentUser || !userProfileRef) return;
    setLoading(true);

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: values.displayName,
      });

      // Update Firestore user document
      updateDocumentNonBlocking(userProfileRef, {
        displayName: values.displayName,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "There was an error updating your profile.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user || !auth.currentUser || !user.email) return;
    setDeleting(true);

    try {
        // 1. Re-authenticate the user
        const credential = EmailAuthProvider.credential(user.email, deletePassword);
        await reauthenticateWithCredential(auth.currentUser, credential);

        // 2. Delete all user data from Firestore
        const batch = writeBatch(firestore);
        const chatsCollectionRef = collection(firestore, "users", user.uid, "chats");
        const chatsSnapshot = await getDocs(chatsCollectionRef);

        for (const chatDoc of chatsSnapshot.docs) {
            // Delete messages subcollection
            const messagesCollectionRef = collection(chatDoc.ref, "messages");
            const messagesSnapshot = await getDocs(messagesCollectionRef);
            messagesSnapshot.forEach((messageDoc) => {
            batch.delete(messageDoc.ref);
            });
            // Delete chat doc
            batch.delete(chatDoc.ref);
        }
        
        // Delete user profile doc
        if (userProfileRef) {
            batch.delete(userProfileRef);
        }

        await batch.commit();

        // 3. Delete user from Firebase Auth
        await deleteUser(auth.currentUser);

        toast({
            title: "Account Deleted",
            description: "Your account and all associated data have been permanently deleted.",
        });
        
        setIsDeleteAlertOpen(false);
        router.replace("/signup");

    } catch (error: any) {
        console.error("Error deleting account: ", error);
        toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: error.code === 'auth/wrong-password' 
                ? "Incorrect password. Please try again."
                : error.message || "An error occurred while deleting your account.",
        });
    } finally {
        setDeleting(false);
        setDeletePassword("");
    }
  }

  if (isUserLoading || isProfileLoading) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your account settings and profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={user?.email || ""} disabled />
                </FormControl>
              </FormItem>
              <Button type="submit" disabled={loading || deleting}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>About & Legal</CardTitle>
          <CardDescription>
            Information about the application and legal documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
            <Link href="/about" className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-t-lg">
                <div className="flex items-center gap-4">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <span>About VarshanAI</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link href="/terms" className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Terms of Service</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link href="/privacy" className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-b-lg">
                <div className="flex items-center gap-4">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span>Privacy Policy</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription>
                Permanently delete your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={deleting}>
                        Delete My Account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account,
                            your profile, and all of your chat history. To confirm, please enter your password.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="delete-password">Password</Label>
                        <Input
                            id="delete-password"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletePassword("")}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleting || deletePassword.length < 6}
                        >
                            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete My Account
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardContent>
      </Card>
    </div>
  );
}
