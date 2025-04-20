import React, { useState, useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";


const ExercisesPage: React.FC = () => {
  return (
    <MainLayout>
     <div className="container mx-auto p-4 space-y-6">
     <h1 className="text-3xl font-bold">Yoga Exercises</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {/* Exercise 1 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
          <img
            src="/exercises/bhujangasana.gif"
            alt="Bhujangasana"

            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Mountain Pose (Tadasana)</h2>
            <p className="text-gray-700 text-center">
              Stand tall with your feet hip-width apart, grounding down through all four corners of your feet.
              Engage your core, lift your chest, and relax your shoulders. Let your arms hang by your sides with
              palms facing forward. Breathe deeply.
            </p>
          </div>
        </div>

        {/* Exercise 2 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
          <img
            src="/exercises/chakrasana.gif"
            alt="Chakrasana"

            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Warrior II Pose (Virabhadrasana II)</h2>
            <p className="text-gray-700 text-center">
              Step one foot back about 4 feet and turn it out 90 degrees. Turn your other foot slightly inward.
              Extend your arms parallel to the floor, palms down. Bend your front knee directly over your ankle,
              keeping your torso upright. Gaze over your front hand.
            </p>
          </div>
        </div>

        {/* Exercise 3 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
          <img
            src="/exercises/Dhanurasana.gif"
            alt="Dhanurasana"

            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Triangle Pose (Trikonasana)</h2>
            <p className="text-gray-700 text-center">
              Stand with your feet about 4 feet apart. Turn one foot out 90 degrees and the other slightly inward.
              Extend your arms parallel to the floor. Reach your front hand forward, then hinge at your hips to lower
              it towards your front foot (or a block). Extend your other arm towards the ceiling. Gaze at your
              raised hand or the ceiling.
            </p>
          </div>
        </div>

        {/* Exercise 4 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
          <img
            src="/exercises/halasana.gif"
            alt="Halasana"

            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Downward-Facing Dog (Adho Mukha Svanasana)</h2>
            <p className="text-gray-700 text-center">
              Start on your hands and knees. Walk your hands forward slightly and tuck your toes. Lift your hips
              towards the ceiling, forming an inverted V-shape with your body. Keep your arms straight, press your
              palms into the mat, and relax your head and neck.
            </p>
          </div>
        </div>

        {/* Exercise 5 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
          <img
            src="/exercises/nataranjasana.gif"
            alt="Natarajanasana"

            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Child's Pose (Balasana)</h2>
            <p className="text-gray-700">
              Kneel on the floor with your big toes touching and knees hip-width apart. Lower your torso between
              your knees and stretch your arms forward, palms down. Rest your forehead on the mat. Breathe deeply and
              relax.
            </p>
          </div>
        </div>

        {/* Exercise 6 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
          <img
            src="/exercises/paschimottanasana.gif"
            alt="Paschimottanasana"

            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Corpse Pose (Savasana)</h2>
            <p className="text-gray-700 text-center">
              Lie on your back with your feet slightly apart and arms by your sides, palms facing up. Close your
              eyes and relax your entire body. Focus on your breath and allow your mind to become still.
            </p>
          </div>
        </div>
         {/* Exercise 7 */}
         <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
          <img
            src="/exercises/sarvangasana.gif"
            alt="Sarvangasana"

            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Sarvangasana</h2>
            <p className="text-gray-700 text-center">
            Lie down in the supine position or lying on your stomach.
            Raise your legs slowly upward and bring it to a 90° angle.
            Bring the legs towards the head by raising the buttocks up.
            Raise the legs; abdomen and chest try to form a straight line.
            Place the palms on your back for support.
            Place the chin against the chest.
            Maintain the position as long as comfortable.
            Try to maintain the pose for up to 30 seconds or more.
            Slowly return back to the original position.
            While doing this, first lower the buttocks with hands supporting the back and slowly come to the
            surface or in the original position.
            </p>
          </div>
        </div>
         {/* Exercise 8 */}
         <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
          <img
            src="/exercises/shalabhasana.gif"
            alt="Shalabhasana"

            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Shalabhasana</h2>
            <p className="text-gray-700 text-center">
            Lie down on your Stomach; place both hands underneath the thighs.
            Breath in (inhale) and lift your right leg up, (your leg should not bend at the knee).
            Your chin should rest on the ground.
            Hold this position about ten to twenty seconds.
            After that exhale and take down your leg in the initial position.
            Similarly do it with your left leg.
            Repeat this for five to seven times.
            After doing it with the left leg, inhale and lift your both legs up (Your legs should not bend at the knees; lift your legs as much as you can).
            With both legs repeat the process for two to four times.
            </p>
          </div>
        </div>
         {/* Exercise 9 */}
         <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-sm">
          <img
            src="/exercises/uttanasana.gif"
            alt="Uttanasana"

            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Uttanasana</h2>
            <p className="text-gray-700 text-center">
            Take a standing position; keep your feet and shoulder distance apart
            and parallel to each other.
            Press your feet down in to the ground and ground yourself powerfully.
            Now breathe out and gently bend down from the hips (not the waist) and place your chest and
            stomach on your thighs.
            If you are a beginner, you ought to bend your knees slightly to accomplish this.
            If your knees are bent, make sure that they’re straight over your toes.
            Slowly begin to straighten out your legs however check that your chest and abdomen never leave
            your thighs.
            Now elevate your hips as you straighten through your hamstring muscles all whereas pressing your
            heels into the ground.
            </p>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default ExercisesPage;