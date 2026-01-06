
import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Code2, Cpu, MessageSquare, Server, ShieldCheck, Zap, ArrowRight, BrainCircuit, MessageCircle, Rocket } from "lucide-react";
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

  const howItWorks = [
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "1. Ask a Question",
      description: "Simply type your question or prompt into the chat interface. You can ask anything you want!",
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: "2. AI Processes",
      description: "Our powerful AI, built on Google's Gemini and Genkit, processes your request in real-time.",
    },
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: "3. Get Your Answer",
      description: "Receive a comprehensive and accurate response in seconds. It's that simple!",
    },
  ];


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
                    Unleash Your Curiosity with VarshanAI
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Welcome to <span className="font-semibold text-primary">VarshanAI</span>, your intelligent partner for everything from quick questions to complex problem-solving. Get smarter, faster.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                    <Link href="/signup">Get Started For Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Image
                  src="https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="AI concept illustration"
                  width={800}
                  height={600}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full bg-white py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">A Simple 3-Step Process</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed">
                Getting started with VarshanAI is as easy as 1, 2, 3.
              </p>
            </div>
            <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
              {howItWorks.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6">
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-500">{step.description}</p>
                </div>
              )) sprinting}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-gray-50 py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                Why VarshanAI?
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Engineered for Excellence</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed">
                Discover the powerful features that make VarshanAI the ultimate chat assistant for your needs.
              </p>
            </div>
            <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl bg-white">
                  <CardHeader className="flex flex-row items-start gap-4">
                    {feature.icon}
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>.
                  <CardContent>
                    <p className="text-gray-500">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full bg-white py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                        Testimonials
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">What Our Users Say</h2>
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed">
                        Don't just take our word for it. Here's what some of our users have to say.
                    </p>
                </div>
                <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-1 lg:grid-cols-2">
                    <Card className="bg-gray-50">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Image src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" width={48} height={48} className="rounded-full" />
                                <div>
                                    <CardTitle className="text-gray-900">Sarah J.</CardTitle>
                                    <CardDescription>Software Developer</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">"VarshanAI has been a game-changer for my productivity. The context-aware conversations and code formatting features are incredible. I can't imagine my workflow without it now."</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-50">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Image src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="User Avatar" width={48} height={48} className="rounded-full" />
                                <div>
                                    <CardTitle className="text-gray-900">Mark L.</CardTitle>
                                    <CardDescription>Student</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">"As a student, VarshanAI helps me understand complex topics and assists with my assignments. The fast responses are a lifesaver when I'm on a tight deadline."</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>


        {/* Call to Action Section */}
        <section className="w-full py-20 md:py-32 border-t bg-gray-50">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">Ready to Start?</h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed mt-4">
              Create an account today and unlock the full potential of AI-driven conversations. It's free to get started.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                <Link href="/signup">Sign Up Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-100">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4 md:px-6 gap-4">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} VarshanAI. All rights reserved.</p>
            <div className="flex gap-4">
                <Link href="/about" className="text-sm text-gray-500 hover:text-primary">About</Link>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary">Privacy</Link>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-primary">Terms</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
