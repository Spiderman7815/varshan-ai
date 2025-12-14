
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
import { deleteUser, updateProfile } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
    if (!user || !auth.currentUser) return;
    setDeleting(true);
    
    try {
      // 1. Delete all user data from Firestore
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

      // 2. Delete user from Firebase Auth
      await deleteUser(auth.currentUser);

      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });
      
      router.replace("/signup");

    } catch (error: any) {
      console.error("Error deleting account: ", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.code === 'auth/requires-recent-login'
          ? "This is a sensitive operation. Please log out and log back in before deleting your account."
          : error.message || "An error occurred while deleting your account.",
      });
    } finally {
      setDeleting(false);
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

      <Card className="max-w-2xl mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription>
                Permanently delete your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={deleting}>
                        {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete My Account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account,
                            your profile, and all of your chat history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete my account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardContent>
      </Card>
    </div>
  );
}
