import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { saveContactMessage } from "@/configs/firebase";
import { recordActivity } from "@/hooks/use-toast";

const ContactPage = () => {
  useEffect(() => {
    recordActivity("view", "Visited Contact Page", "ContactPage");
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Missing information", { description: "Please fill in your name, email, and message." });
      return;
    }

    setIsSubmitting(true);
    const result = await saveContactMessage({ name, email, subject, message });
    setIsSubmitting(false);

    if (!result.success) {
      toast.error("Could not send message", { description: "Please try again in a moment." });
      return;
    }

    toast.success("Message sent", { description: "Thanks for reaching out — we'll get back to you soon." });
    recordActivity("submit", "Sent Contact Message", "ContactPage");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

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

        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Questions, feedback, or partnership inquiries — we'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Email</p>
                <a href="mailto:support@mindcare.app" className="text-sm text-muted-foreground hover:text-foreground">
                  support@mindcare.app
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">In-app support</p>
                <p className="text-sm text-muted-foreground">
                  Existing users can also chat with our AI Wellness Assistant for immediate help.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-4 border-t">
              This form is for general inquiries. If you're experiencing a mental health crisis, please use the
              SOS button in the app or contact a crisis helpline immediately — do not wait for an email reply.
            </p>
          </div>

          <Card className="md:col-span-2 border-primary/10">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>We typically respond within 1-2 business days.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Input placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <Textarea
                  placeholder="How can we help?"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
