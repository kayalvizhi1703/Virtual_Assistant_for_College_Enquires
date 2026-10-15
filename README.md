# Nandha Smart Campus Assistant

A complete, modern, interactive website for **Nandha Arts and Science College (Autonomous)**, Erode.

Built with React + Vite + Tailwind CSS + Framer Motion + Supabase + JavaScript NLP.

## Features

### Public Website
- **Sticky navbar** with NASC logo, navigation links, "Ask Nandha" button, theme & language toggles
- **Hero section** with deep-blue gradient, animated floating shapes, animated counters
- **About section** with motto, NAAC B+ badge, Bharathiar University affiliation, principal info
- **Departments & Courses** — filterable, searchable cards with slide-over detail panels
- **Placement section** with animated stats and bar chart
- **Notifications page** with category filters (exam, admission, event, circular, placement)
- **Contact page** with address, phone, email, Google Maps embed, contact form (saved to Supabase)

### Smart Chatbot ("Nandha Assistant")
- Floating widget + dedicated /chat page
- **NLP engine**: TF-IDF + cosine similarity with Fuse.js fuzzy backup
- Understands **English, Tamil, and Tanglish** (e.g. "fees evlo", "hostel irukka")
- Context memory (remembers last course discussed for follow-up questions)
- Rich replies: option cards, course carousels, fee tables, follow-up chips
- Thumbs up/down feedback on every answer
- Voice assistant: speech-to-text input and text-to-speech replies
- Low-confidence fallback with office contact + suggested topics
- Unanswered queries saved to database for admin review

### Interactive Tools (11 tools)
1. **Course Finder Quiz** — 5 questions, top 3 matches with match percentage
2. **Fee Calculator** — course + hostel + transport, animated pie chart breakdown
3. **Eligibility Checker** — enter stream + percentage, see eligible/not-eligible courses
4. **Admission Journey Tracker** — 5-step checklist with progress bar + confetti on 100%
5. **Interactive Campus Map** — SVG layout, tap zones for details, virtual tour mode
6. **Course Compare** — compare 2-3 courses side by side
7. **Career Path Explorer** — animated roadmap of jobs, higher studies, skills
8. **Smart Bus Route Finder** — search by area, get route/time/fee
9. **Events Countdown** — live countdown timers + "Add to calendar" (.ics download)
10. **Saved Answers** — bookmark chatbot answers, view later
11. **Get a Call Back** — lead form saved to Supabase

### Command Palette
- Press `/` or `Ctrl+K` to search any page, course, or feature

### Admin Panel (/admin)
- **Login** with Supabase Auth (email/password)
- **Dashboard** with stats and Recharts charts (daily chats, topics, feedback, leads)
- **Intent management** — add/edit/delete intents, patterns, English & Tamil responses
- **Unanswered queries** — convert to intent, mark resolved
- **Leads** — call-back requests with status (New, Contacted, Admitted)
- **Chat history** — search and date filter
- **CRUD** for notifications, events, departments, courses, bus routes
- **Settings** — college details, contact info, confidence threshold
- **CSV export** for chat logs, leads, unanswered queries

### NLP Test Page (/test)
- Runs 25 sample questions (English, Tamil, Tanglish) through the matcher
- Shows predicted intent, confidence, pass/fail, overall accuracy

## Tech Stack
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Supabase** for database, auth, and RLS
- **Fuse.js** for fuzzy matching
- **Recharts** for admin charts
- **lucide-react** for icons

## NLP Module
Separate commented files in `src/nlp/`:
- `preprocess.ts` — lowercase, Tanglish normalization, stopword removal, stemming
- `tfidf.ts` — TF-IDF vectorizer with cosine similarity
- `matcher.ts` — combines TF-IDF + Fuse.js, context memory, language detection

## Setup

### Prerequisites
- Node.js 18+
- A Supabase project

### Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** In the Bolt environment, these are pre-populated automatically.

### Install & Run
```bash
npm install
npm run dev      # development
npm run build    # production build
npm run typecheck # type checking
```

### Demo Admin Login
To use the admin panel, create an admin user in your Supabase project:
1. Go to Supabase Dashboard → Authentication → Users → Add user
2. Set email and password
3. Use those credentials at `/admin`

Example demo credentials (create in Supabase):
- Email: `admin@nandhaarts.ac.in`
- Password: `nascadmin123`

## Database
The Supabase migration is automatically applied. Tables created:
- `profiles`, `settings`, `departments`, `courses`, `faculty`, `bus_routes`
- `notifications`, `events`, `intents`
- `chat_logs`, `unanswered_queries`, `feedback`, `leads`, `contact_messages`

**RLS policies**: Public can read content tables and insert chat logs, unanswered queries, feedback, leads, and contact messages. Only authenticated admin can create, update, or delete.

## Design
- Deep-blue gradient hero (#1e3a8a → #3b82f6)
- Gold accent (#f59e0b)
- Glassmorphism cards
- Poppins font
- Light/dark mode toggle
- English/Tamil language toggle
- Fully responsive, mobile-first
- No external images — circular SVG "NASC" badge as logo

## License
© Nandha Arts and Science College (Autonomous). All rights reserved.
