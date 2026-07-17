<div align="center">

# MindCare

*A mental wellness companion — assessments, journaling, AI support, and community, in one place.*

[![Live App](https://img.shields.io/badge/live-your--mental--buddy.web.app-2d2d2d?style=flat-square)](https://your-mental-buddy.web.app)
![React](https://img.shields.io/badge/React-18-2d2d2d?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-2d2d2d?style=flat-square&logo=typescript&logoColor=3178C6)
![FastAPI](https://img.shields.io/badge/FastAPI-2d2d2d?style=flat-square&logo=fastapi&logoColor=009688)
![Firebase](https://img.shields.io/badge/Firebase-2d2d2d?style=flat-square&logo=firebase&logoColor=FFCA28)
![Gemini](https://img.shields.io/badge/Google%20Gemini-2d2d2d?style=flat-square&logo=googlegemini&logoColor=8E75FF)

</div>

<br>

MindCare helps people manage their well-being through self-assessments, mood tracking, journaling, guided
coping tools, community support, and access to therapists — backed by real data persistence
(Firebase/Firestore) and genuine AI features (Google Gemini via a Python backend). Every feature below is
fully wired up and working end to end, not a placeholder.

<br>

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#how-to-contribute)

<br>

## Features

**Assessments** — anxiety, depression, and stress questionnaires with a history view; select entries to
download as PDF, email, or delete individually or in bulk.

**AI Wellness Chat** — a Gemini-powered assistant with crisis detection, RAG over a mental-health knowledge
base (with PDF upload to expand it), voice input, and persisted conversation history.

**Journal** — entries with mood tagging, a calendar view, and streak tracking; journal mood feeds into Mood
Trends alongside the dedicated Mood Tracker.

**Coping Tools** — guided breathing exercises, grounding exercises, affirmations, and relaxation games
(Memory, Word Zen, Coloring, Find the Ball), each logged to a tool-activity history.

**Progress Dashboard** — Mood Trends, Emotion Distribution, coping-tool activity, journaling streaks, an
achievements system, and AI-generated mood forecasts and recommendations.

**Lifestyle Risk Predictor** — a scikit-learn model estimates stress, anxiety, and depression risk from
lifestyle inputs, with a saved prediction history.

**Resources** — articles, podcasts, and videos, bookmarkable to a personal "Saved" list.

**Reminders** — custom reminders, plus email reminders for upcoming therapist appointments and event RSVPs,
starting five days out and continuing daily through the event.

**Community** — real-time chat rooms, support groups (joinable and creatable), and events with RSVP, direct
Google Calendar sync (falling back to an `.ics` download if declined), and email confirmation.

**Therapist Directory** — search and filter by location, availability, and specialty; book consultations or
video sessions with a simulated video-call screen, sync the appointment straight to Google Calendar, and
manage upcoming and past appointments.

**Emergency SOS** — one-tap access to crisis helplines, India and international.

<br>

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React · TypeScript · Vite · shadcn-ui · Tailwind CSS · React Router · Recharts · Plotly · Google Identity Services (Calendar OAuth) |
| Backend | FastAPI (Python) · Google Gemini (`google-genai`) · scikit-learn · FAISS (RAG) · fpdf2 · Gmail API · Resend |
| Data | Firebase Auth + Firestore |
| Observability | Langfuse — optional, traces Gemini calls |

<br>

## Getting Started

### Prerequisites

- Node.js (LTS) and npm — [nodejs.org](https://nodejs.org/)
- Python 3.11+
- A Google Gemini API key — [ai.google.dev](https://ai.google.dev/)

### Frontend

```sh
npm install
npm run dev
```

The frontend runs on `http://localhost:8080` by default and talks to the backend at `http://localhost:8000`
(override with a `VITE_API_URL` env var if needed). Firebase config is already set in
`src/configs/firebase.ts`, pointed at this project's Firebase instance — Firestore security rules and
indexes are managed directly in the Firebase Console, not checked into this repo.

Optional — direct "Add to Google Calendar" on event RSVPs and therapist bookings needs a
`VITE_GOOGLE_CLIENT_ID` env var (`.env.local` for dev, `.env.production` for the deployed build). Create an
OAuth client at [console.cloud.google.com](https://console.cloud.google.com): enable the Google Calendar
API, set up the OAuth consent screen, then create a Web application OAuth client with your app's origins
listed under Authorized JavaScript origins — no redirect URI needed. Without this set, the calendar checkbox
falls back to the `.ics` download automatically.

### Backend

```sh
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Create `backend/.env`:

```
GEMINI_API_KEY=your_key_here

# Optional — Gemini call tracing, get free keys at https://cloud.langfuse.com
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_HOST=https://cloud.langfuse.com

# Optional — enables emailed reports/reminders, get a key at https://resend.com/api-keys
RESEND_API_KEY=

# Optional — sends notification emails via Gmail API instead of Resend (works for any
# recipient, not just the Resend account owner). Takes priority over RESEND_API_KEY above
# when set. Requires a Google Cloud OAuth client with the gmail.send scope authorized
# once against the sending Gmail account to get a refresh token.
GMAIL_SENDER_EMAIL=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
```

Then run:

```sh
uvicorn main:app --reload --port 8000
```

Both the frontend and backend need to be running for the app to be fully functional — chat, AI insights, the
risk predictor, and emailed reports and reminders all depend on the backend.

<br>

## How to Contribute

Contributions and feedback are welcome — open an issue or submit a pull request.
