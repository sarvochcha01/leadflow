<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite" alt="SQLite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

# LeadFlow

A lightweight, single-screen **Lead Management CRM** where a sales rep can track leads, log discussions, and set follow-up reminders. Built with Next.js 16, SQLite, and Tailwind CSS v4.

## ✨ Features

- **Lead Tracking** — Create, view, and manage leads with status tracking (New → Contacted → Qualified → Proposal Sent → Won / Lost)
- **Discussion Timeline** — Log discussion notes per lead with a rich vertical timeline UI
- **Follow-Up Reminders** — Set follow-up dates; today's follow-ups are pinned to the top, overdue ones are highlighted in red
- **Search & Filter** — Search by lead name or company; filter by status with pill-style tabs
- **Stats Dashboard** — At-a-glance metrics: total leads, win count, conversion rate, follow-ups due
- **Dark Mode** — Premium dark UI with smooth micro-animations, glassmorphic dialogs, and custom scrollbars

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Database** | [SQLite](https://www.sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Language** | TypeScript 5 |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Date Handling** | [date-fns](https://date-fns.org/) |

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/sarvochcha01/leadflow.git
cd leadflow

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env

# 4. Seed the database with sample data
npm run seed

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

```bash
# One-command startup
docker compose up --build

# Or use Docker directly
docker build -t leadflow .
docker run -p 3000:3000 -v leadflow-data:/app/data leadflow
```

## 📁 Project Structure

```
leadflow/
├── app/
│   ├── api/
│   │   ├── leads/              # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.ts    # GET (detail), PATCH (update status)
│   │   │       └── discussions/
│   │   │           └── route.ts # GET, POST discussions
│   │   └── stats/
│   │       └── route.ts        # Dashboard stats endpoint
│   ├── globals.css             # Design tokens + base styles
│   ├── layout.tsx              # Root layout, fonts, metadata
│   └── page.tsx                # Main client page
├── components/
│   ├── Header.tsx              # App header with branding
│   ├── StatsRow.tsx            # Dashboard stat cards
│   ├── Toolbar.tsx             # Search bar + status filter pills
│   ├── LeadList.tsx            # Lead list with follow-up sections
│   ├── LeadCard.tsx            # Individual lead card
│   ├── LeadAvatar.tsx          # Coloured avatar initials
│   ├── StatusBadge.tsx         # Colour-coded status pill
│   ├── LeadDialog.tsx          # Lead detail modal
│   ├── TimelineEntry.tsx       # Discussion timeline item
│   ├── DiscussionForm.tsx      # Add discussion form
│   ├── StatusDropdown.tsx      # Status change dropdown
│   └── AddLeadDialog.tsx       # Add new lead modal
├── lib/
│   ├── db.ts                   # SQLite connection + migrations
│   ├── schema.ts               # Table schemas
│   └── types.ts                # TypeScript interfaces
├── scripts/
│   └── seed.ts                 # Database seed script
├── data/                       # SQLite database (gitignored)
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## 🔌 API Reference

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leads` | List all leads (supports `?status=` and `?search=` query params) |
| `POST` | `/api/leads` | Create a new lead (`{ name, company?, phone? }`) |
| `GET` | `/api/leads/:id` | Get lead detail with all discussions |
| `PATCH` | `/api/leads/:id` | Update lead status (`{ status }`) |

### Discussions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leads/:id/discussions` | List discussions for a lead |
| `POST` | `/api/leads/:id/discussions` | Add a discussion (`{ note, follow_up_at? }`) |

### Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Dashboard statistics |

## 🌍 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_PATH` | `./data/leadflow.db` | Path to the SQLite database file |

## 📄 License

MIT
