const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Sends a plain-text notification email via the backend's Resend integration.
// Fails silently (returns false) rather than throwing — a missing/misconfigured
// email backend should never block the booking/RSVP flow it's attached to.
export const sendNotificationEmail = async (recipientEmail: string, subject: string, body: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/send-notification-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient_email: recipientEmail, subject, body }),
    });
    return res.ok;
  } catch (error) {
    console.error('Error sending notification email:', error);
    return false;
  }
};
