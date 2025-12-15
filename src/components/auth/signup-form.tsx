
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { useFirebase } from "@/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { GoogleIcon } from "../icons/google";
import { Separator } from "../ui/separator";

const formSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm() {
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleUserDocument = async (user: FirebaseUser, displayName?: string | null) => {
    const userRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || user.email?.split("@")[0],
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      
      await updateProfile(userCredential.user, { displayName: values.username });
      await sendEmailVerification(userCredential.user);
      
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox to verify your email address, then you can log in.",
      });
      router.push("/login");

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await handleUserDocument(result.user);
        router.push("/chat");
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Google Sign-In Failed",
            description: error.message,
        });
    } finally {
        setGoogleLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Join VarshanAI to start your AI-powered journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      icon={<User className="h-4 w-4 text-muted-foreground" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
              {(loading || googleLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
        <div className="relative my-6">
          <Separator />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-card text-sm text-muted-foreground">OR</div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 h-5 w-5" />
          )}
          Sign up with Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/login">Sign in</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
