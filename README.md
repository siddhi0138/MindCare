<div align="center">

# 💙 MindCare

**Your pocket mental wellness companion — assess, journal, chat, and connect, all in one place.**

[![Live App](https://img.shields.io/badge/🌐_Live_App-your--mental--buddy.web.app-6C5CE7?style=for-the-badge)](https://your-mental-buddy.web.app)

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)

</div>

<br>

MindCare helps people manage their well-being through self-assessments, mood tracking, journaling, guided
coping tools, community support, and access to therapists — backed by real data persistence
(Firebase/Firestore) and genuine AI features (Google Gemini via a Python backend). Every feature below is
fully wired up and working end to end — no mock data, no placeholder buttons.

<br>

## 📑 Contents

- [✨ Features](#features)
- [🛠️ Tech Stack](#tech-stack)
- [🚀 Getting Started](#getting-started)
- [🤝 Contributing](#how-to-contribute)

<br>

## ✨ Features

### 📝 Assessments
Standardized anxiety, depression, and stress questionnaires, each scored with a clear severity level and
personalized recommendations. Every result is saved to a full history view where you can select entries to
download as a PDF, email them to yourself (or anyone), or delete them individually or in bulk.

### 💬 AI Wellness Chat
A Gemini-powered assistant that actually understands context — it retrieves relevant passages from a curated
mental-health knowledge base (RAG) before answering, detects crisis language and responds accordingly,
supports voice input, and remembers your conversation history across sessions. You can even upload your own
PDFs to expand what it knows.

### 📔 Journal
Free-form journal entries with mood tagging and a calendar view of your writing history, plus streak
tracking to build the habit. Journal moods automatically feed into your Mood Trends chart, right alongside
the dedicated Mood Tracker.

### 🌬️ Coping Tools
A toolbox for in-the-moment relief: guided breathing exercises, grounding techniques, affirmations, and four
relaxation mini-games (Memory, Word Zen, Coloring, Find the Ball). Every session is logged so you can see
which tools you actually reach for.

### 📊 Progress Dashboard
Your wellness at a glance — Mood Trends, Emotion Distribution, coping-tool activity, journaling streaks, an
achievements system that rewards consistency, and AI-generated forecasts that flag where your mood might be
heading next.

### 🔮 Lifestyle Risk Predictor
A scikit-learn model trained to estimate stress, anxiety, and depression risk from everyday lifestyle
inputs — sleep, exercise, work hours, social support, and more — with every prediction saved to a personal
history.

### 📚 Resources
A curated library of articles, podcasts, and videos on mental health topics, with a one-tap "Save" to build
your own personal reading/watch list.

### ⏰ Reminders
Custom reminders you set yourself, plus automatic email reminders for upcoming therapist appointments and
event RSVPs — starting five days out and continuing daily right through the day of the event.

### 🫂 Community
Real-time chat rooms, support groups you can join or create, and events you can RSVP to — complete with
**direct Google Calendar sync** (falls back to an `.ics` download if you decline calendar access) and an
email confirmation for every RSVP.

### 🩺 Therapist Directory
Search and filter therapists by location, availability, and specialty. Book a consultation or video session
through a simulated video-call screen, sync the appointment straight to your Google Calendar, and manage all
your upcoming and past appointments in one place.

### 🆘 Emergency SOS
One-tap access to crisis helplines, covering both India and international numbers — always just one tap
away, no matter where you are in the app.

<br>

## 🛠️ Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React · TypeScript · Vite · shadcn-ui · Tailwind CSS · React Router · Recharts · Plotly · Google Identity Services (Calendar OAuth) |
| Backend | FastAPI (Python) · Google Gemini (`google-genai`) · scikit-learn · FAISS (RAG) · fpdf2 · Gmail API · Resend |
| Data | Firebase Auth + Firestore |
| Observability | Langfuse — optional, traces Gemini calls |

<br>

## 🚀 Getting Started

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

## 🤝 How to Contribute

Contributions and feedback are welcome — open an issue or submit a pull request.
