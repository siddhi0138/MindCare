
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];
const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Great'];

const MoodTracker = () => {
  const [moodLevel, setMoodLevel] = useState(2); // 0-4 index for the 5 mood levels
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Here you would normally save this to your backend
    console.log('Mood submitted:', { mood: moodLevel, note });
    setSubmitted(true);
    
    // Reset after a delay for demo purposes
    setTimeout(() => {
      setSubmitted(false);
      setMoodLevel(2);
      setNote('');
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>Track your mood to build self-awareness</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="py-8 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="text-6xl mb-4"
              >
                ✅
              </motion.div>
              <h3 className="text-xl font-medium mb-2">Mood Recorded!</h3>
              <p className="text-muted-foreground">
                Thank you for checking in today.
              </p>
            </div>
          ) : (
            <>
              <div className="py-6">
                <div className="flex justify-between mb-6">
                  {moodEmojis.map((emoji, index) => (
                    <div 
                      key={index}
                      className={`flex flex-col items-center transition-all ${
                        moodLevel === index ? 'scale-125' : 'opacity-70'
                      }`}
                    >
                      <span className="text-4xl mb-2">{emoji}</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {moodLabels[index]}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Slider 
                  value={[moodLevel]} 
                  min={0} 
                  max={4} 
                  step={1} 
                  onValueChange={(value) => setMoodLevel(value[0])}
                  className="mt-6"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="mood-note" className="block text-sm font-medium mb-2">
                    Add a note about your day (optional)
                  </label>
                  <Textarea 
                    id="mood-note"
                    placeholder="What's on your mind today?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleSubmit} className="w-full">
                  Save Today's Mood
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MoodTracker;
