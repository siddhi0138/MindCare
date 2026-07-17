import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Shield, Sparkles, Users } from "lucide-react";
import { recordActivity } from "@/hooks/use-toast";

const AboutPage = () => {
  useEffect(() => {
    recordActivity("view", "Visited About Page", "AboutPage");
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

        <h1 className="text-3xl font-bold mb-6">About MindCare</h1>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground text-base">
              MindCare is a mental wellness companion designed to make emotional support, self-reflection, and
              coping tools accessible whenever you need them. We built MindCare around a simple idea: taking care
              of your mind should be as easy and stigma-free as taking care of your body.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p>
              We want to help people build self-awareness and healthy coping habits through accessible,
              evidence-informed tools — mood tracking, guided meditation, journaling, an AI wellness assistant, and
              a directory to connect with licensed therapists when professional support is needed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              <div className="flex items-start gap-3 p-4 rounded-lg border">
                <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">AI Wellness Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    24/7 conversational support grounded in mental health resources, with built-in crisis detection.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border">
                <Heart className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Mood & Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Daily check-ins and analytics that help you notice patterns in how you feel over time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border">
                <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Self-Assessments</h3>
                  <p className="text-sm text-muted-foreground">
                    Screening tools for anxiety, depression, and stress to help you understand where you stand.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border">
                <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Community & Therapists</h3>
                  <p className="text-sm text-muted-foreground">
                    A supportive community space and a directory to find licensed mental health professionals.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">An Important Note</h2>
            <p>
              MindCare is a wellness and self-help tool. It is not a substitute for professional diagnosis,
              therapy, or emergency care. If you're in crisis, please use the SOS button in the app or contact a
              crisis helpline immediately.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
