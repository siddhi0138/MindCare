import { useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Fires a lightweight, fire-and-forget ping to the backend as soon as the app loads.
// The Render free tier spins the backend down after ~15 minutes idle, and the first
// request after that takes 30-60s to wake it back up. Pinging /health immediately on
// load means that wake-up happens in the background while the user is still just
// looking at the page, so their first *real* action (chat, insights, predictor) is
// much less likely to be the one eating that cold-start delay.
const BackendWarmup = () => {
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`).catch(() => {
      // Ignore — this is just a best-effort warm-up, not a user-facing request.
    });
  }, []);

  return null;
};

export default BackendWarmup;
