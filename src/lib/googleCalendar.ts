interface GoogleCalendarEventInput {
  title: string;
  description: string;
  location: string;
  start: Date;
  durationMinutes: number;
}

interface GoogleCalendarResult {
  success: boolean;
  eventUrl?: string;
  reason?: 'not_configured' | 'denied' | 'error';
}

interface GoogleTokenClient {
  requestAccessToken: (overridable?: { prompt?: string }) => void;
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: { type?: string }) => void;
          }) => GoogleTokenClient;
        };
      };
    };
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let gisScriptPromise: Promise<void> | null = null;

const loadGoogleIdentityServices = (): Promise<void> => {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gisScriptPromise) return gisScriptPromise;

  gisScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')));
      return;
    }
    const script = document.createElement('script');
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });

  return gisScriptPromise;
};

const requestAccessToken = (): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Identity Services unavailable'));
      return;
    }
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID as string,
      scope: CALENDAR_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || 'no_access_token'));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: (error) => {
        reject(new Error(error?.type || 'popup_closed'));
      },
    });
    tokenClient.requestAccessToken({ prompt: '' });
  });

// Opens a Google consent popup (must be called from a user-gesture handler) and creates the
// event directly on the user's primary Google Calendar via the Calendar API. Falls back to
// { success: false } if the client ID isn't configured or the user denies/closes the popup —
// callers should fall back to the .ics download in that case.
export const addEventToGoogleCalendar = async (event: GoogleCalendarEventInput): Promise<GoogleCalendarResult> => {
  if (!CLIENT_ID) {
    return { success: false, reason: 'not_configured' };
  }

  try {
    await loadGoogleIdentityServices();
    const accessToken = await requestAccessToken();

    const end = new Date(event.start.getTime() + event.durationMinutes * 60 * 1000);
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.title,
        description: event.description,
        location: event.location,
        start: { dateTime: event.start.toISOString() },
        end: { dateTime: end.toISOString() },
        reminders: { useDefault: true },
      }),
    });

    if (!response.ok) {
      return { success: false, reason: 'error' };
    }

    const data = await response.json();
    return { success: true, eventUrl: data.htmlLink };
  } catch {
    return { success: false, reason: 'denied' };
  }
};

export const isGoogleCalendarConfigured = () => Boolean(CLIENT_ID);
