
import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Code2, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Blazing Fast Responses",
      description: "Get instant answers to your queries with our powerful AI.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Context-Aware Conversations",
      description: "VarshanAI remembers your previous messages for a seamless chat experience.",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Email Verification",
      description: "Secure your account with our robust email verification system.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Welcome to <span className="text-primary">VarshanAI</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your intelligent chat companion. Experience the next generation of AI-powered conversations.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Already have an account?</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/ai-chat/600/400"
                alt="AI Chatbot"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                data-ai-hint="ai chat"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-muted py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose VarshanAI?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the powerful features that make VarshanAI the ultimate chat assistant for your needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Start?</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed mt-4">
              Create an account today and unlock the full potential of AI-driven conversations.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href="/signup">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-center h-16 border-t bg-muted">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} VarshanAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
