
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="items-center text-center">
          <div className="rounded-lg bg-primary p-3 mb-4">
              <Code2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">About VarshanAI</CardTitle>
          <CardDescription>
            Your intelligent partner for everything.
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-lg dark:prose-invert max-w-none mx-auto">
            <p>
                VarshanAI is a state-of-the-art conversational AI application built to showcase the power of modern web technologies and artificial intelligence. Our mission is to provide a seamless, intuitive, and powerful chat experience that can assist users with a wide range of tasks, from simple questions to complex problem-solving.
            </p>
            <h3>Our Technology</h3>
            <p>
                This application is built with a cutting-edge tech stack, including:
            </p>
            <ul>
                <li><strong>Next.js:</strong> A React framework for production-grade applications.</li>
                <li><strong>Firebase:</strong> For secure authentication, real-time database, and cloud storage.</li>
                <li><strong>Genkit & Google Gemini:</strong> Powering our advanced AI and generative capabilities.</li>
                <li><strong>Tailwind CSS & ShadCN UI:</strong> For a beautiful, modern, and responsive user interface.</li>
                <li><strong>TypeScript:</strong> For robust, type-safe code.</li>
            </ul>
            <h3>Our Features</h3>
            <p>
                We&apos;ve packed VarshanAI with features to make your experience productive and enjoyable:
            </p>
            <ul>
                <li>Real-time, context-aware conversations.</li>
                <li>Secure user accounts and data management.</li>
                <li>AI-powered web search and image generation.</li>
                <li>Text-to-speech for listening to responses.</li>
                <li>Markdown and code formatting support.</li>
                <li>A customizable and themeable interface.</li>
            </ul>
            <p>
                We are constantly working to improve VarshanAI and add new capabilities. Thank you for being a part of our journey!
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
