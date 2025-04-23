
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SmilePlus, Brain, FileText, HeadphonesIcon, Users, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';
const features = [
  {
    title: 'Mood Tracking',
    description: 'Track your daily moods and emotions with simple check-ins to identify patterns.',
    icon: SmilePlus,
    link: "/journal",
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'AI Support Chat',
    description: 'Get 24/7 emotional support through our AI-powered chat assistant.',
    icon: Brain,
    link: "/chat",
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Guided Journal',
    description: 'Express your thoughts with guided journaling prompts and secure diary entries.',
    icon: FileText,
    link: "/journal",
    color: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Meditation Library',
    description: 'Access a collection of guided meditations, breathing exercises and sleep stories.',
    icon: HeadphonesIcon,
    link: "/meditation",
    color: 'from-teal-500 to-emerald-500',
  },
  {
    title: 'Community Support',
    description: 'Connect with others on similar journeys through moderated support groups.',
    icon: Users,
    link: "/community",
    color: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Progress Insights',
    description: 'Visualize your mental wellness journey with personalized progress tracking.',
    icon: PieChart,
    link: "/analysis",
    color: 'from-cyan-500 to-blue-500',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Features to Support Your Journey</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tools and resources designed to help you understand, manage, and improve your mental wellbeing.
        </p>
      </div>
      
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={item} className="card-hover" >
            <Link to={feature.link ?? "/"} className="h-full">
              <Card className="h-full border-primary/10">
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          </motion.div >
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
