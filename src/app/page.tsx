
import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Code2, Cpu, MessageSquare, Server, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Blazing Fast Responses",
      description: "Experience near-instantaneous answers to your queries with our powerful, optimized AI infrastructure.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Context-Aware Conversations",
      description: "VarshanAI remembers your previous messages, allowing for a seamless and natural chat experience.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Secure Authentication",
      description: "Secure your account with our robust email and Google authentication system, built on Firebase.",
    },
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: "Advanced AI Models",
      description: "Leveraging Genkit and Google's Gemini, we provide state-of-the-art AI capabilities.",
    },
    {
      icon: <Code2 className="h-8 w-8 text-primary" />,
      title: "Code Formatting",
      description: "Share and receive code snippets with full syntax highlighting, copy, and download functionality.",
    },
    {
      icon: <Server className="h-8 w-8 text-primary" />,
      title: "Reliable Infrastructure",
      description: "Built on Next.js and deployed with Vercel, ensuring a fast, scalable, and reliable platform.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    The Future of Conversation is Here.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Welcome to <span className="font-semibold text-primary">VarshanAI</span>, your intelligent partner for everything from quick questions to complex problem-solving.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                    <Link href="/signup">Get Started For Free</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="https://picsum.photos/seed/ai-abstract/800/600"
                  alt="AI concept illustration"
                  width={800}
                  height={600}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                  data-ai-hint="ai abstract"
                />
                 <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                 <div className="absolute -top-8 -left-8 w-48 h-48 bg-secondary rounded-full blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-background py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                Why VarshanAI?
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Engineered for Excellence</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Discover the powerful features that make VarshanAI the ultimate chat assistant for your needs.
              </p>
            </div>
            <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-start gap-4">
                    {feature.icon}
                    <div className="flex-1">
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-20 md:py-32 border-t">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Start?</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed mt-4">
              Create an account today and unlock the full potential of AI-driven conversations. It's free to get started.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                <Link href="/signup">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4 md:px-6 gap-4">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} VarshanAI. All rights reserved.</p>
            <div className="flex gap-4">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                    Terms of Service
                </Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
