# 🥭 Mango G Portal

## 🎯 Project Purpose
Mango G Portal is an **anonymous feedback collection tool** with Filipino humor (\"Masyado ka nang madaldal! Chill muna. 🥭\" - \"You're too talkative! Chill mango!\").
 
**Key Features:**
- Clean, responsive UI with animations and loading states
- Rate limiting (3 submissions/hour per IP)
- Dual persistence: Database storage + real-time notifications
- Server-side form handling with validation
- Production-ready Next.js 16 App Router setup

## 🛠 Tech Stack & Integrations

| Stack | Purpose | Integration Details |
|-------|---------|---------------------|
| **Next.js 16 (TypeScript)** | Full-stack framework | App Router, Server Actions, Middleware, React 19 |
| **Supabase** | Database storage | Real-time PostgreSQL. Stores `nickname` + `message` in `feedback` table |
| **Discord Webhooks** | Real-time alerts | Instant embed notifications on new submissions (title, sender, message, timestamp) |
| **Upstash Redis** | Rate limiting | Sliding window limiter (3 req/hour/IP) via `@upstash/ratelimit` |
| **TailwindCSS 4** | Styling | Responsive, utility-first with custom animations |

## 🚀 Quick Start

1. **Clone & Install**
```bash
git clone <repo>
cd mango-g-portal
npm install
```

2. **Setup Environment** (see below)
3. **Run Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Setup (.env.local)

```
# Supabase (create project at supabase.com, add 'feedback' table with columns: id, nickname, message, created_at)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Discord Webhook (server settings > integrations > webhooks)
DISCORD_WEBHOOK_URL=your_discord_webhook_url

# Upstash Redis (upstash.com, create database)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

**Supabase Table Schema:**
```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  nickname TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📁 Folder Structure
```
mango-g-portal/
├── src/app/
│   ├── page.tsx          # Main feedback form
│   ├── actions/submit.ts # Server action (Supabase + Discord)
│   └── globals.css       # Tailwind styles
├── middleware.ts         # Redis rate limiting
├── public/              # Logo (mangoglogo.svg)
├── package.json         # Dependencies
└── README2.md           # This file!
```

## ⚙️ Local Development
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint check |

## 🚀 Deployment
- **Recommended: Vercel** (one-click deploy)
- Works with any Node 20+ host (set env vars)
- Edge runtime compatible (Redis middleware)

## 🎉 How It Works (Step-by-Step)
1. User submits form → Server Action triggered
2. **Rate limit check** (middleware: Redis)
3. **Supabase insert** (`feedback` table)
4. **Discord webhook** (async embed POST)
5. Success toast → Reset form

**Error Handling:** Client-side validation + server errors (e.g., DB failures).

## 🤝 Contributing
- Fork & PR
- Run `npm run lint` before commit
- Add your feedback to Discord! 🥭

## 📄 License
MIT - Free to use/modify.

---

*Built with ❤️ for chill feedback vibes.*

