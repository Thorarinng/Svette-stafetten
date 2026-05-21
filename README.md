# Svette-stafetten

Enkel webapp for å logge sykkel- og løpeturer til/fra jobb i en kontorkonkurranse (26. mai – 26. juni).

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Supabase (gratis tier)
- Deploy på Vercel

## Kom i gang

### 1. Supabase

1. Opprett et prosjekt på [supabase.com](https://supabase.com).
2. Kjør SQL fra [`supabase/setup.sql`](supabase/setup.sql) i SQL Editor (oppretter `trips`-tabellen).
   - For rediger/slett: kjør [`supabase/RUN_THIS_FOR_EDIT_DELETE.sql`](supabase/RUN_THIS_FOR_EDIT_DELETE.sql) i SQL Editor.
   - **Eksisterende database:** kjør [`supabase/RUN_THIS_ALL.sql`](supabase/RUN_THIS_ALL.sql) én gang i SQL Editor (trip_date, poeng, RLS).
3. **Authentication** → **Providers** → slå på **Email** (magic link).
4. **Authentication** → **URL Configuration** → legg til redirect-URL-er:
   - `http://localhost:5173` (lokalt)
   - `https://din-app.vercel.app` (produksjon)
5. Kopier **Project URL** og **anon public** key fra Settings → API.
6. **Tilpass innloggings-e-post** (Svette-stafetten-branding): se [`supabase/email-templates/README.md`](supabase/email-templates/README.md).

### 2. Lokalt

```bash
cp .env.example .env
# Fyll inn VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY

npm install
npm run dev
```

### 3. Vercel

1. Importer repoet i Vercel.
2. Legg til miljøvariabler:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` = `https://din-app.vercel.app` (samme som Vercel-URL)
3. Deploy.

### 4. Supabase innloggingslenke (viktig)

**Authentication** → **URL Configuration**:

| Felt | Verdi |
|------|--------|
| Site URL | `https://din-app.vercel.app` |
| Redirect URLs | `https://din-app.vercel.app`, `http://localhost:5173` |

Be om magisk lenke fra **Vercel-URL** i produksjon — ikke fra `npm run dev`, ellers peker e-posten til localhost.

## Poeng

| Retning   | Poeng |
|-----------|-------|
| Tur-retur | 2     |
| En vei    | 1     |

## Funksjoner

- Ledertavle sortert etter poeng (med sykkel/løp-fordeling)
- Skjema for å logge tur med optimistisk UI (én tur per dag, velg dato innen 26. mai – 26. juni)
- Statistikk: antall turer, dager igjen, sykkel vs løp
- Nedtelling til sluttdato
- Norsk UI, mobilvennlig
- Innlogging med magisk e-postlenke — kun `@metzum.no`
- Ledertavle er åpen; kun innloggede kan logge turer
- **Mine turer** — rediger eller slett egne registreringer
