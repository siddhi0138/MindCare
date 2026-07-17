# MindCare

## About

MindCare is a mental health application that helps users manage their well-being through self-assessments,
mood tracking, journaling, guided coping tools, community support, and access to therapists — backed by real
data persistence (Firebase/Firestore) and AI features (Google Gemini via a Python backend).

## Key Features

### Mental Health Tools

- **Assessments** — anxiety, depression, and stress questionnaires with a history view (select entries to
  download as PDF, email, or delete individually or in bulk).
- **AI Wellness Chat** — a Gemini-powered assistant with crisis detection, RAG over a mental-health knowledge
  base (with PDF upload to expand it), voice input, and persisted conversation history.
- **Journal** — entries with mood tagging, a calendar view, and streak tracking; journal mood feeds into
  Mood Trends alongside the dedicated Mood Tracker.
- **Coping Tools** — guided breathing exercises, grounding exercises, affirmations, and relaxation games
  (Memory, Word Zen, Coloring, Find the Ball), each logged to a tool-activity history.
- **Progress Dashboard** — Mood Trends, Emotion Distribution, coping-tool activity, journaling streaks, an
  achievements system, and AI-generated mood forecasts/recommendations.
- **Lifestyle Risk Predictor** — a scikit-learn model estimates stress/anxiety/depression risk from lifestyle
  inputs, with a saved prediction history.
- **Resources** — articles, podcasts, and videos, bookmarkable to a personal "Saved" list.
- **Reminders** — custom reminders, plus email reminders for upcoming therapist appointments and event RSVPs
  (starting 5 days out, daily, via a backend email service).
- **Community** — real-time chat rooms, support groups (joinable and creatable), and events with RSVP,
  `.ics` calendar download, and email confirmation.
- **Therapist Directory** — search/filter by location, availability, and specialty; book consultations or
  video sessions with a simulated video-call screen, and manage upcoming/past appointments.
- **Emergency SOS** — one-tap access to crisis helplines (India and international).

## Tech Stack

**Frontend:** React, TypeScript, Vite, shadcn-ui, Tailwind CSS, React Router, Recharts, Plotly
**Backend:** FastAPI (Python), Google Gemini (`google-genai`), scikit-learn, FAISS (RAG), fpdf2, Resend
**Data:** Firebase Auth + Firestore
**Observability:** Langfuse (optional, traces Gemini calls)

## Getting Started

### Prerequisites

- **Node.js** (LTS) and npm — [nodejs.org](https://nodejs.org/)
- **Python 3.11+**
- A **Google Gemini API key** — [ai.google.dev](https://ai.google.dev/)

### Frontend

```sh
npm install
npm run dev
```

The frontend runs on `http://localhost:8080` by default and talks to the backend at `http://localhost:8000`
(override with a `VITE_API_URL` env var if needed). Firebase config is already set in
`src/configs/firebase.ts`, pointed at this project's Firebase instance — Firestore security rules and
indexes are managed directly in the Firebase Console, not checked into this repo.

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
```

Then run:

```sh
uvicorn main:app --reload --port 8000
```

Both the frontend and backend need to be running for the app to be fully functional — chat, AI insights,
the risk predictor, and emailed reports/reminders all depend on the backend.

## How to Contribute

Contributions and feedback are welcome — open an issue or submit a pull request.
