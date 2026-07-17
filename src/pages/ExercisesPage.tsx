import { useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { recordActivity } from '@/hooks/use-toast';

interface Exercise {
  slug: string;
  gif: string;
  title: string;
  description: string;
}

const EXERCISES: Exercise[] = [
  {
    slug: 'bhujangasana',
    gif: '/exercises/bhujangasana.gif',
    title: 'Bhujangasana (Cobra Pose)',
    description:
      'Lie on your stomach, place your palms under your shoulders, elbows close to your body. Inhale, lift your chest off the floor while keeping your lower ribs on the ground. Keep elbows slightly bent and shoulders away from ears. Hold and breathe.',
  },
  {
    slug: 'chakrasana',
    gif: '/exercises/chakrasana.gif',
    title: 'Chakrasana (Wheel Pose)',
    description:
      'Lie on your back, bend your knees and place feet close to your buttocks. Place your palms under your shoulders with fingers pointing towards your feet. Inhale, push through hands and feet, lifting your body to form an arch. Hold, then gently lower down.',
  },
  {
    slug: 'Dhanurasana',
    gif: '/exercises/Dhanurasana.gif',
    title: 'Dhanurasana (Bow Pose)',
    description:
      'Lie on your stomach, bend your knees, and hold your ankles with your hands. Inhale, lift your chest and legs off the ground by pulling your ankles upward. Keep your gaze forward and hold the pose, breathing steadily.',
  },
  {
    slug: 'halasana',
    gif: '/exercises/halasana.gif',
    title: 'Halasana (Plough Pose)',
    description:
      'Lie on your back, lift your legs up to 90°, then over your head to touch the floor behind you. Keep your hands on your lower back for support or rest them on the floor. Hold the position and breathe gently.',
  },
  {
    slug: 'nataranjasana',
    gif: '/exercises/nataranjasana.gif',
    title: 'Natarajasana (Lord of the Dance Pose)',
    description:
      'Stand tall, shift weight onto one leg, bend the opposite knee and hold your ankle from behind. Inhale, extend your other arm forward, and lift the bent leg behind you, arching slightly. Keep balance and hold.',
  },
  {
    slug: 'paschimottanasana',
    gif: '/exercises/paschimottanasana.gif',
    title: 'Paschimottanasana (Seated Forward Bend)',
    description:
      'Sit with legs extended. Inhale, raise your arms overhead, lengthen your spine. Exhale, hinge at your hips, and reach for your feet or shins, bringing your torso towards your legs. Keep your back straight.',
  },
  {
    slug: 'sarvangasana',
    gif: '/exercises/sarvangasana.gif',
    title: 'Sarvangasana',
    description:
      'Lie down in the supine position. Raise your legs slowly to a 90° angle. Bring the legs towards the head by lifting your buttocks up. Support your back with your hands. Place the chin against the chest. Maintain the position as long as comfortable, then slowly return.',
  },
  {
    slug: 'shalabhasana',
    gif: '/exercises/shalabhasana.gif',
    title: 'Shalabhasana',
    description:
      'Lie on your stomach, place hands under your thighs. Inhale and lift your right leg up (without bending the knee). Rest your chin on the ground. Hold for 10-20 seconds. Repeat with your left leg. Then lift both legs together and repeat.',
  },
  {
    slug: 'uttanasana',
    gif: '/exercises/uttanasana.gif',
    title: 'Uttanasana',
    description:
      'Stand with your feet shoulder-width apart. Exhale, gently bend forward from the hips, placing your chest on your thighs. Keep knees slightly bent if needed. Slowly straighten your legs as much as possible without lifting the chest off the thighs.',
  },
];

const ExercisesPage = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) recordActivity('view', 'Visited Exercises Page', 'ExercisesPage');
  }, [currentUser]);

  return (
    <MainLayout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Yoga Exercises</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXERCISES.map((exercise) => (
            <Card key={exercise.slug} className="border-primary/10 overflow-hidden flex flex-col">
              <img
                src={exercise.gif}
                alt={exercise.title}
                className="w-full h-48 object-contain bg-white"
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{exercise.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{exercise.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExercisesPage;
