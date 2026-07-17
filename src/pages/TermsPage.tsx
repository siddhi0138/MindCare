import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { recordActivity } from "@/hooks/use-toast";

const TermsPage = () => {
  useEffect(() => {
    recordActivity("view", "Visited Terms Page", "TermsPage");
  }, []);

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

        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: April 18, 2025</p>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using MindCare, you agree to be bound by these Terms of Service and our
              Privacy Policy. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">2. Not a Substitute for Professional Care</h2>
            <p>
              MindCare provides self-help tools, educational content, and an AI wellness assistant for general
              informational and wellness purposes. It is <strong>not</strong> a medical device, does not provide
              medical diagnoses, and is not a substitute for professional mental health treatment, therapy, or
              emergency services. Always seek the advice of a qualified health provider with any questions you may
              have regarding a medical or mental health condition.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">3. Emergencies</h2>
            <p>
              MindCare is not equipped to handle medical or psychiatric emergencies. If you or someone you know is
              in crisis or in danger, please contact your local emergency number immediately or use the SOS button
              within the app to reach crisis resources.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">4. Your Account</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activity under your account. You must provide accurate information when creating an account and
              notify us promptly of any unauthorized use.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the service for any unlawful purpose or in violation of any applicable laws</li>
              <li>Attempt to gain unauthorized access to other users' accounts or data</li>
              <li>Interfere with or disrupt the integrity or performance of the service</li>
              <li>Use automated means to access the service without our prior written consent</li>
              <li>Post or transmit harmful, abusive, or harassing content in community features</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">6. AI-Generated Content</h2>
            <p>
              The AI Wellness Assistant uses generative AI to produce responses. While we aim for helpful,
              supportive, and safe responses, AI-generated content may occasionally be inaccurate or incomplete. It
              does not diagnose conditions or prescribe treatment, and should not be relied upon as professional
              advice.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of MindCare — including text, graphics, logos, and
              software — are owned by MindCare or its licensors and are protected by intellectual property laws.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to MindCare at our discretion, including for
              violations of these Terms, without prior notice.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p>
              MindCare is provided "as is" without warranties of any kind. To the fullest extent permitted by law,
              we are not liable for any indirect, incidental, or consequential damages arising from your use of the
              service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">10. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes by posting the
              updated Terms on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:support@mindcare.app" className="text-primary hover:underline">
                support@mindcare.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsPage;
