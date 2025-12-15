
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          <CardDescription>
            Last Updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
            <p>Your privacy is important to us. It is VarshanAI's policy to respect your privacy regarding any information we may collect from you across our website.</p>

            <h3>1. Information We Collect</h3>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
            <ul>
                <li><strong>Account Information:</strong> When you register for an account, we collect your email address and display name.</li>
                <li><strong>Chat Data:</strong> We store your chat history, including messages and any files you upload, to provide a continuous conversation experience.</li>
                <li><strong>Usage Data:</strong> We may collect information about how you interact with our service to help us improve it.</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>We use the information we collect in various ways, including to:</p>
            <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                <li>Find and prevent fraud</li>
            </ul>
            
            <h3>3. Data Storage and Security</h3>
            <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
            <p>Your chat data is stored securely in Firebase Firestore and is protected by security rules to ensure only you can access it.</p>

            <h3>4. Your Data Rights</h3>
            <p>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services. You have the right to access, update, or delete your personal information at any time through your profile page.</p>

            <h3>5. Third-Party Services</h3>
            <p>Our AI features are powered by Google's Gemini models. Your prompts and conversations may be processed by Google to provide the AI responses. We do not share your personal account information with Google.</p>

            <h3>6. Changes to This Policy</h3>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

            <h3>Contact Us</h3>
            <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
        </CardContent>
      </Card>
    </div>
  );
}
