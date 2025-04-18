
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPage = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: April 18, 2025</p>
          
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Serenity. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mental health application.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium mt-4 mb-2">2.1 Personal Information</h3>
            <p>
              When you create an account, we collect your name, email address, and password. Optionally, you may provide additional information such as your profile picture, phone number, and biographical information.
            </p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">2.2 Mental Health Data</h3>
            <p>
              To provide our services, we may collect:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Mood tracking and journal entries</li>
              <li>Responses to mental health assessments</li>
              <li>Usage of meditation and coping tools</li>
              <li>Chat conversations with our AI wellness assistant</li>
              <li>Goals and progress data</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-4 mb-2">2.3 Usage Information</h3>
            <p>
              We automatically collect certain information about your device and how you interact with our app, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Device type and operating system</li>
              <li>App usage statistics and features accessed</li>
              <li>Time spent on different sections of the app</li>
              <li>Error logs and performance data</li>
            </ul>
          </section>
          
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your experience and content</li>
              <li>Track your progress and provide insights about your mental wellbeing</li>
              <li>Process and complete transactions</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Send you technical notices, updates, security alerts, and support messages</li>
              <li>Develop new programs, products, services, and features</li>
            </ul>
          </section>
          
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. All information is encrypted both in transit and at rest.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
            <p>
              We will retain your personal information only for as long as reasonably necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The right to access your personal data</li>
              <li>The right to rectification of inaccurate personal data</li>
              <li>The right to erasure of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal data</li>
              <li>Rights relating to automated decision-making and profiling</li>
            </ul>
          </section>
          
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@serenity.app" className="text-primary hover:underline">privacy@serenity.app</a>
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPage;
