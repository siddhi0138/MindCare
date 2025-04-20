
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import MoodTracker from "@/components/home/MoodTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      
      <section className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              How are you feeling today?
            </h2>
            <MoodTracker />
          </div>
          
          <div className="flex flex-col gap-6">
            <Card className="border-primary/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-serenity-purple to-serenity-purple-dark p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Quick Journal</h3>
                  <p className="text-white/80 mb-4">
                    Document your thoughts and track your mental wellbeing journey.
                  </p>
                  <Button variant="secondary" asChild>
                    <Link to="/journal" className="flex items-center gap-1">
                      Start Writing <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-serenity-blue to-blue-400 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Talk to AI</h3>
                  <p className="text-white/80 mb-4">
                    Get support anytime with our AI wellness companion.
                  </p>
                  <Button variant="secondary" asChild>
                    <Link to="/chat" className="flex items-center gap-1">
                      Start Chatting <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-green-400 to-teal-500 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Guided Meditation</h3>
                  <p className="text-white/80 mb-4">
                    Reduce stress with guided breathing and meditation exercises.
                  </p>
                  <Button variant="secondary" asChild>
                    <Link to="/meditation" className="flex items-center gap-1">
                      Start Meditating <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
