# Workspace

## Overview

**RUseen** — AI-powered travel planning platform for Russia. Fully in Russian language. Users fill in trip parameters and the AI generates a complete multi-day itinerary.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS
- **State management**: Zustand
- **AI**: Anthropic Claude via Replit AI Integrations (claude-sonnet-4-6)
- **Maps**: Leaflet.js + OpenStreetMap (free, no API key, interactive route map with geocoding via Nominatim)
- **Routing**: OSRM fallback (real driving distances/times), Yandex Distance Matrix API primary (activates when key approved)
- **Animations**: Framer Motion

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/             # Express API server
│   │   └── src/
│   │       ├── routes/trips.ts # Trip generation/save/fetch endpoints
│   │       └── services/aiPlanner.ts # OpenAI travel plan generation
│   └── ruseen/                 # React + Vite frontend (RUseen app)
│       └── src/
│           ├── pages/          # Home, Planner, Details, Results, SavedTrip
│           ├── components/     # Header, Footer, LoadingOverlay, UI chips
│           ├── store/          # Zustand trip store
│           └── hooks/          # useTheme (light/dark mode)
├── lib/
│   ├── api-spec/               # OpenAPI spec + Orval codegen config
│   ├── api-client-react/       # Generated React Query hooks
│   ├── api-zod/                # Generated Zod schemas from OpenAPI
│   ├── db/                     # Drizzle ORM schema + DB connection
│   │   └── src/schema/trips.ts # Trips table schema
│   └── integrations-openai-ai-server/ # OpenAI client
├── scripts/
└── ...
```

## Key Features

1. **Trip Planning Form** (`/planner`) — comprehensive form with:
   - Start/destination locations
   - Transport type (car/plane/train/bus)
   - Travel type (educational/beach/gastronomic/ecological/business/extreme/event)
   - Date range, budget with currency selector
   - Adults/children counter
   - Attraction preferences, accommodation type/stars/area
   - Dietary preferences, activities
   - Event mode (for travel to specific events)
   - Additional notes

2. **AI Route Generation** — OpenAI gpt-5.2 generates full JSON with:
   - Daily plans (morning/afternoon/evening)
   - 3 hotel options (budget/mid/premium) with amenities, pros, totalPrice, booking links to Yandex Travel
   - Restaurants, attractions
   - Transport options
   - Gas stations + road stops (for car trips)
   - Budget breakdown

3. **Details Page** (`/details`) — ДЕТАЛИ: first step after AI generation:
   - Hero city photo + thumbnail gallery
   - City info block (name, region, summary)
   - ОТЕЛИ: horizontal-scroll hotel cards (price/night, stars, "Выбрать тариф")
   - ТРАНСПОРТ: flight cards (Aviasales live prices) or train cards (Tutu.ru)
   - ЭКСКУРСИИ: horizontal-scroll attraction cards with booking links
   - Fixed bottom: ИТОГО total + "Продолжить" → navigates to `/results`

4. **Route Page** (`/results`) — МАРШРУТ: second step, shows the itinerary:
   - Sticky header: ← back to `/details` + destination + save button (desktop)
   - Horizontal day picker (date number + day abbreviation)
   - Daily timeline grouped as Утро / День / Вечер
   - Activity cards: title + address (blue) + cost
   - Map: desktop (right panel sticky) / mobile (below content)
   - Fixed bottom "Сохранить" button (mobile)

4. **Saved Trips** (`/saved-trips`) — lists all saved plans

5. **Popular Routes** (`/popular-routes`) — Travelpayouts DRIVE widget (marker `507110`)

6. **Light/Dark Theme** — persisted to localStorage

## Monetization

- **Yandex Distribution** — script in `index.html <head>`
- **Travelpayouts affiliate** — marker `507110`; DRIVE widget + hotel/flight deep links
- **Yandex Travel affiliate** — `https://travel.yandex.ru/--/xaIXaYbL8xwedg` for hotel booking

## API Endpoints

- `GET /api/healthz` — health check
- `POST /api/trips/generate` — generate AI travel plan
- `POST /api/trips` — save a trip
- `GET /api/trips` — list all saved trips
- `GET /api/trips/:id` — get saved trip
- `GET /api/flights/search` — Travelpayouts/Aviasales flight prices

## Database Tables

- `trips` — saved trip plans with JSONB plan column

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI proxy URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI proxy API key
- `TRAVELPAYOUTS_TOKEN` — Aviasales/Travelpayouts data API token

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
