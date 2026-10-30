# Cambridge Questionnaire

Unmoderated user-testing questionnaire built with **Next.js**, **Supabase**, and deployed on **Vercel** (all free tiers).

---

## Setup in 5 steps

### 1. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → New project (free tier is fine)
2. Once created, open **SQL Editor** and paste + run the contents of [`supabase-schema.sql`](./supabase-schema.sql)
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Create your `.env.local` file
```bash
cp .env.local.example .env.local
```
Fill in the three values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_PASSWORD=choose-a-strong-password
```

### 3. Run locally
```bash
npm install
npm run dev
```
- Questionnaire → http://localhost:3000
- Admin → http://localhost:3000/admin

### 4. Deploy to Vercel (free)
1. Push this repo to GitHub (or Cursor Origin)
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add the three environment variables in Vercel's **Settings → Environment Variables**
4. Deploy — done!

### 5. Share the live URL
Send respondents the root URL (`https://your-app.vercel.app`).  
Admin dashboard lives at `https://your-app.vercel.app/admin`.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | The questionnaire (4 tasks + overall feedback) |
| `/admin` | Password-protected results dashboard with CSV download |
| `/api/submit` | POST endpoint — stores a response in Supabase |
| `/api/responses` | GET endpoint — returns all responses (requires admin password header) |

---

## Tech stack
- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS**
- **Supabase** (PostgreSQL, free tier)
- **Vercel** (hosting, free tier)
