
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  progress?: number;
  unlocked?: boolean;
}

const AchievementBadge = ({
  icon,
  title,
  description,
  progress = 100,
  unlocked = true,
}: AchievementBadgeProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className={`overflow-hidden border-primary/10 ${!unlocked && 'opacity-50 grayscale'}`}>
        <CardContent className="p-4 text-center">
          <div className="relative">
            <div className={`w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-br ${unlocked ? 'from-primary to-serenity-purple-dark' : 'from-gray-400 to-gray-500'}`}>
              <span className="text-3xl">{icon}</span>
              
              {progress < 100 && (
                <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray={`${progress}, 100`}
                  />
                </svg>
              )}
            </div>
          </div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AchievementBadge;
