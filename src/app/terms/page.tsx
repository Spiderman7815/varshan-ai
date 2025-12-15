
import { LandingHeader } from "@/components/landing-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Terms of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-muted-foreground prose dark:prose-invert">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                
                <p>
                  Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the VarshanAI application (the "Service") operated by us.
                </p>

                <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                </p>

                <h2 className="text-xl font-semibold text-foreground">2. Accounts</h2>
                <p>
                  When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>

                <h2 className="text-xl font-semibold text-foreground">3. User Conduct</h2>
                <p>
                  You are responsible for your conduct and any data, text, files, information, usernames, images, graphics, photos, profiles, audio and video clips, sounds, musical works, works of authorship, applications, links and other content or materials (collectively, "Content") that you submit, post or display on or via the Service.
                </p>
                
                <h2 className="text-xl font-semibold text-foreground">4. Intellectual Property</h2>
                <p>
                  The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of VarshanAI and its licensors.
                </p>

                <h2 className="text-xl font-semibold text-foreground">5. Termination</h2>
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                
                <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
                <p>
                  In no event shall VarshanAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>

                <h2 className="text-xl font-semibold text-foreground">7. Changes</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
                </p>
                
                <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
