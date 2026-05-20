# FuelMate Pro

A premium, AI-powered vehicle, fuel, and expense management solution.

- ⚡ Built with **React 19 + TanStack Start + Vite**
- 🎨 Tailwind CSS v4 + shadcn/ui + Framer Motion + Recharts
- 🌙 Dark-first premium UI (amber + charcoal)
- 🧠 AI-style insights section
- 🗄️ **Supabase-ready** backend (schema + types included)
- 📦 Runs locally with **mock data mode** out of the box


## Features

- **Smart fuel logging** - Track fill-ups, mileage, cost-per-unit, and fuel efficiency.
- **Vehicle garage** - Manage multiple vehicles with detailed performance and history views.
- **Expense tracking** - Record maintenance, insurance, tolls, repairs, and other ownership costs.
- **Analytics dashboard** - View fuel cost, efficiency trends, monthly spend, and vehicle health metrics.
- **Service reminders** - Keep up with oil changes, tire rotations, insurance renewals, and scheduled maintenance.
- **AI assistant experience** - Surface driving insights, maintenance suggestions, and fuel-saving recommendations.
- **Responsive premium UI** - Modern dark-first interface built for desktop and mobile.
- **Supabase-ready data model** - Includes schema, RLS policies, and generated database types.

## Screenshots

![FuelMate Pro screenshot 1](./images/1.png)

![FuelMate Pro screenshot 2](./images/2.png)

![FuelMate Pro screenshot 3](./images/3.png)

![FuelMate Pro screenshot 4](./images/4.png)

![FuelMate Pro screenshot 5](./images/5.png)

![FuelMate Pro screenshot 6](./images/6.png)

## Quick start

```bash
bun install
bun run dev
# → http://localhost:5173
```

The app runs immediately with rich mock data — no backend required.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, paste & run [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy your project URL + anon key.
4. Create a `.env` from the template:

```bash
cp .env.example .env
```

5. Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=ey...
```

6. Restart the dev server. Auth and CRUD calls will switch from mock data to
   real Supabase once you wire calls in `src/lib/`.

## Project structure

```
src/
  components/      Reusable UI (Logo, AppShell, StatCard, AuthShell, ui/*)
  lib/
    mock-data.ts   Demo data (vehicles, fuel logs, expenses, reminders)
    database.types.ts  Supabase row/insert/update types
  routes/
    index.tsx           Landing page
    login.tsx           Sign in
    register.tsx        Sign up
    forgot-password.tsx Password reset
    app.tsx             Authenticated shell (sidebar + topbar)
    app.dashboard.tsx   Overview + analytics
    app.vehicles.tsx    Garage
    app.vehicles.$id.tsx Vehicle detail
    app.fuel.tsx        Fuel logs (table + cards + modal)
    app.expenses.tsx    Expense tracking
    app.analytics.tsx   Advanced analytics
    app.reminders.tsx   Service reminders
    app.assistant.tsx   AI assistant
    app.settings.tsx    Settings
    app.profile.tsx     Profile
  styles.css       Design tokens (oklch dark amber theme)
supabase/
  schema.sql       Tables, RLS policies, signup trigger
.env.example       Environment variable template
```

## Database schema

| Table       | Purpose                                  |
| ----------- | ---------------------------------------- |
| `profiles`  | Mirrors `auth.users` with display fields |
| `vehicles`  | User-owned cars/trucks                   |
| `fuel_logs` | Per-vehicle fuel-up history              |
| `expenses`  | Maintenance, insurance, tolls, etc.      |
| `reminders` | Service & renewal reminders              |

All tables have **Row Level Security** enabled with per-user policies. Profiles
are auto-created via the `on_auth_user_created` trigger.


## Credit

All rights reserved by Code with Shahriar.

