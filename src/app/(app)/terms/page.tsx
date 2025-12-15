
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <CardDescription>
            Last Updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
            <p>Welcome to VarshanAI! These terms and conditions outline the rules and regulations for the use of VarshanAI's Website.</p>

            <h3>1. Acceptance of Terms</h3>
            <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use VarshanAI if you do not agree to all of the terms and conditions stated on this page.</p>
            
            <h3>2. User Accounts</h3>
            <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            
            <h3>3. Content</h3>
            <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.</p>
            <p>You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.</p>

            <h3>4. Prohibited Uses</h3>
            <p>You may use the Service only for lawful purposes. You may not use the Service:</p>
            <ul>
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                <li>To generate or disseminate verifiably false information and/or content with the purpose of harming others.</li>
                <li>To generate or disseminate content that is sexually explicit, violent, or promotes discrimination.</li>
            </ul>

            <h3>5. Termination</h3>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

            <h3>6. Changes to Terms</h3>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

            <h3>Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us.</p>
        </CardContent>
      </Card>
    </div>
  );
}
