import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserAppointments,
  markAppointmentReminderSent,
  getUserEventRsvpDocs,
  markEventReminderSent,
} from '@/configs/firebase';
import { sendNotificationEmail } from '@/lib/notify';

const CHECK_INTERVAL_MS = 60_000;
const REMINDER_WINDOW_DAYS = 5;

const dateKey = (d: Date) => d.toISOString().slice(0, 10);

// Days remaining until `target`, rounded up so "any time on the 5th day before" still counts as day 5
const daysUntil = (target: Date, now: Date) => Math.ceil((target.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

// Sends one reminder email per day, starting REMINDER_WINDOW_DAYS days before an appointment/event
// and continuing daily through the day it happens, for anything with reminders opted in.
// Limitation: this only runs while the app is open in a browser tab — there is no server-side
// cron here (that would need a Firebase Admin service-account credential this project doesn't
// have), so it can't wake up and notify a user who isn't active that day.
const ReminderChecker = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const email = currentUser?.email;
    const userId = currentUser?.id;
    if (!email || !userId) return;

    const checkReminders = async () => {
      const now = new Date();
      const today = dateKey(now);
      const [appointments, rsvps] = await Promise.all([
        getUserAppointments(userId),
        getUserEventRsvpDocs(userId),
      ]);

      for (const appt of appointments) {
        if (appt.status !== 'upcoming' || !appt.remindersEnabled || appt.lastReminderSentDate === today) continue;
        const target = appt.scheduledFor.toDate();
        const remaining = daysUntil(target, now);
        if (remaining < 0 || remaining > REMINDER_WINDOW_DAYS) continue;

        const kind = appt.type === 'video' ? 'video session' : 'consultation';
        const whenPhrase = remaining === 0 ? 'today' : `in ${remaining} day${remaining === 1 ? '' : 's'}`;
        const sent = await sendNotificationEmail(
          email,
          `Reminder: ${kind} with ${appt.therapistName} ${whenPhrase}`,
          `This is a reminder that you have a ${kind} with ${appt.therapistName} scheduled for ${target.toLocaleString()} (${whenPhrase}).`
        );
        if (sent) await markAppointmentReminderSent(appt.id, today);
      }

      for (const rsvp of rsvps) {
        if (!rsvp.remindersEnabled || rsvp.lastReminderSentDate === today) continue;
        const target = rsvp.eventStart.toDate();
        const remaining = daysUntil(target, now);
        if (remaining < 0 || remaining > REMINDER_WINDOW_DAYS) continue;

        const whenPhrase = remaining === 0 ? 'today' : `in ${remaining} day${remaining === 1 ? '' : 's'}`;
        const sent = await sendNotificationEmail(
          email,
          `Reminder: "${rsvp.eventTitle}" is ${whenPhrase}`,
          `This is a reminder that you RSVP'd to "${rsvp.eventTitle}", happening ${target.toLocaleString()} (${whenPhrase}).`
        );
        if (sent) await markEventReminderSent(userId, rsvp.eventId, today);
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [currentUser]);

  return null;
};

export default ReminderChecker;
