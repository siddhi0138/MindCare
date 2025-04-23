import React, { useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from '@/contexts/AuthContext';
import { saveUserActivity } from '@/configs/firebase';

const ExercisesPage: React.FC = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const userId = currentUser?.id;
    if (userId) {
      const timestamp = new Date().toISOString();
      const activityData = {
        userId,
        timestamp,
        activityType: "visit-exercises-page",
        activityName: "",
        pageName: "ExercisesPage",
      };
      saveUserActivity(activityData);
    }
  }, [currentUser]);

  return (
    <MainLayout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold dark:text-white">Yoga Exercises</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">

          {/* Bhujangasana */}
          <div className="rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
            <img src="/exercises/bhujangasana.gif" alt="Bhujangasana" className="w-full h-48 object-contain" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Bhujangasana (Cobra Pose)</h2>
              <p className="text-gray-700 text-center dark:text-gray-300">
                Lie on your stomach, place your palms under your shoulders, elbows close to your body.
                Inhale, lift your chest off the floor while keeping your lower ribs on the ground.
                Keep elbows slightly bent and shoulders away from ears. Hold and breathe.
              </p>
            </div>
          </div>

          {/* Chakrasana */}
          <div className="rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
            <img src="/exercises/chakrasana.gif" alt="Chakrasana" className="w-full h-48 object-contain" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Chakrasana (Wheel Pose)</h2>
              <p className="text-gray-700 text-center dark:text-gray-300">
                Lie on your back, bend your knees and place feet close to your buttocks.
                Place your palms under your shoulders with fingers pointing towards your feet.
                Inhale, push through hands and feet, lifting your body to form an arch.
                Hold, then gently lower down.
              </p>
            </div>
          </div>

          {/* Dhanurasana */}
          <div className="rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
            <img src="/exercises/Dhanurasana.gif" alt="Dhanurasana" className="w-full h-48 object-contain" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Dhanurasana (Bow Pose)</h2>
              <p className="text-gray-700 text-center dark:text-gray-300">
                Lie on your stomach, bend your knees, and hold your ankles with your hands.
                Inhale, lift your chest and legs off the ground by pulling your ankles upward.
                Keep your gaze forward and hold the pose, breathing steadily.
              </p>
            </div>
          </div>

          {/* Halasana */}
          <div className="rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
            <img src="/exercises/halasana.gif" alt="Halasana" className="w-full h-48 object-contain" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Halasana (Plough Pose)</h2>
              <p className="text-gray-700 text-center dark:text-gray-300">
                Lie on your back, lift your legs up to 90°, then over your head to touch the floor behind you.
                Keep your hands on your lower back for support or rest them on the floor.
                Hold the position and breathe gently.
              </p>
            </div>
          </div>

          {/* Natarajasana */}
          <div className="rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
            <img src="/exercises/nataranjasana.gif" alt="Natarajasana" className="w-full h-48 object-contain" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Natarajasana (Lord of the Dance Pose)</h2>
              <p className="text-gray-700 text-center dark:text-gray-300">
                Stand tall, shift weight onto one leg, bend the opposite knee and hold your ankle from behind.
                Inhale, extend your other arm forward, and lift the bent leg behind you, arching slightly.
                Keep balance and hold.
              </p>
            </div>
          </div>

          {/* Paschimottanasana */}
          <div className="rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
            <img src="/exercises/paschimottanasana.gif" alt="Paschimottanasana" className="w-full h-48 object-contain" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Paschimottanasana (Seated Forward Bend)</h2>
              <p className="text-gray-700 text-center dark:text-gray-300">
                Sit with legs extended. Inhale, raise your arms overhead, lengthen your spine.
                Exhale, hinge at your hips, and reach for your feet or shins, bringing your torso towards your legs.
                Keep your back straight.
              </p>
            </div>
          </div>

          {/* Sarvangasana */}
          <div className="rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
            <img src="/exercises/sarvangasana.gif" alt="Sarvangasana" className="w-full h-48 object-contain" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Sarvangasana</h2>
              <p className="text-gray-700 text-center dark:text-gray-300">
                Lie down in the supine position. Raise your legs slowly to a 90° angle.
                Bring the legs towards the head by lifting your buttocks up.
                Support your back with your hands. Place the chin against the chest.
                Maintain the position as long as comfortable, then slowly return.
              </p>
            </div>
          </div>

          {/* Shalabhasana */}
          <div className="rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
            <img src="/exercises/shalabhasana.gif" alt="Shalabhasana" className="w-full h-48 object-contain" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Shalabhasana</h2>
              <p className="text-gray-700 text-center dark:text-gray-300">
                Lie on your stomach, place hands under your thighs.
                Inhale and lift your right leg up (without bending the knee).
                Rest your chin on the ground. Hold for 10-20 seconds.
                Repeat with your left leg. Then lift both legs together and repeat.
              </p>
            </div>
          </div>

          {/* Uttanasana */}
          <div className="rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
            <img src="/exercises/uttanasana.gif" alt="Uttanasana" className="w-full h-48 object-contain" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">Uttanasana</h2>
              <p className="text-gray-700 text-center dark:text-gray-300">
                Stand with your feet shoulder-width apart. Exhale, gently bend forward from the hips,
                placing your chest on your thighs. Keep knees slightly bent if needed.
                Slowly straighten your legs as much as possible without lifting the chest off the thighs.
              </p>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default ExercisesPage;

