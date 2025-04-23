
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Your Mental Health Journey Begins Here
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Experience personalized support, track your moods, practice mindfulness, and connect with a community that understands.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="text-md" asChild>
              <Link to="/">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-md" asChild>
              <Link to="/resources">Learn More</Link>
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="w-full h-80 md:h-96 lg:h-[450px] bg-gradient-to-br from-primary/30 via-serenity-purple/20 to-serenity-blue/30 rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-60 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-3/4 h-3/4 opacity-30">
                <path fill="#9B87F5" d="M40.8,-69.7C50.9,-60.3,55.8,-44.7,61.5,-30.3C67.1,-15.8,73.6,-2.5,73.4,10.8C73.2,24.1,66.2,37.4,56.5,48.3C46.8,59.2,34.3,67.8,20.2,73C6,78.3,-9.8,80.3,-24.5,77C-39.3,73.6,-52.9,65,-63.3,52.9C-73.7,40.8,-81,25.3,-82,9.3C-83.1,-6.8,-78,-23.3,-69.3,-37C-60.6,-50.7,-48.3,-61.5,-34.8,-69.1C-21.3,-76.7,-6.7,-80.9,6.7,-79.8C20.1,-78.7,30.8,-79.1,40.8,-69.7Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
          
          {/* Floating elements */}
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-10 right-14 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg w-32 h-16 flex items-center justify-center"
          >
            <span className="text-lg font-medium text-primary">Feeling Calm</span>
          </motion.div>
          
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/2 -left-6 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg"
          >
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <span className="text-sm font-medium">Meditation</span>
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [5, -5, 5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 right-10 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg"
          >
            <span className="text-sm font-medium">🧠 Mental Clarity</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
