## 🎙️ AI Voice Scheduling Agent

A real-time AI voice assistant that schedules meetings using natural conversation and creates Google Calendar events automatically.

## 🚀 Live Demo
https://your-app.vercel.app

---

## ✨ Features

- 🎤 Real-time voice interaction
- 🤖 AI-powered natural language understanding
- 📅 Google Calendar event creation
- 🧠 Context-aware multi-step conversation
- 🌍 Timezone-aware scheduling (IST safe)
- ⚡ Fully serverless deployment

---

## 🧠 Tech Stack

**Frontend**
- React + Vite
- Web Speech API
- Modern conversational UI

**Backend**
- Node.js serverless functions (Vercel)
- Groq LLM for intent understanding
- Chrono for natural time parsing

**Integrations**
- Google Calendar API
- OAuth2 authentication

---

## 🏗️ Architecture

The system uses a hybrid deterministic + AI approach:

- AI extracts user intent and metadata
- Backend performs deterministic time parsing
- Google Calendar handles final scheduling

This ensures reliability while maintaining natural conversation.

---

## 🧪 How It Works

1. User speaks naturally (e.g. "Schedule meeting tomorrow at 6pm")
2. AI extracts intent and metadata
3. Backend parses time safely
4. Event created in Google Calendar
5. User receives confirmation + event link

---

## 🛠️ Local Development

```bash
# install deps
npm install

# run backend
node dev-server.js

# run frontend
cd frontend
npm install
npm run dev
