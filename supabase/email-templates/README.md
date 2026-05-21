# Tilpass innloggings-e-post (Svette-stafetten)

Supabase sender magisk lenke-e-post. Standardteksten («powered by Supabase») endres i **dashboard**, ikke i React-appen.

## Steg i Supabase Dashboard

1. Åpne prosjektet → **Authentication** → **Email Templates**
2. Velg malen **Magic Link**
3. **Subject** — lim inn fra [`magic-link-subject.txt`](./magic-link-subject.txt):
   ```
   Logg inn på Svette-stafetten
   ```
4. **Body** — bytt til **HTML** (hvis det finnes toggle), lim inn hele [`magic-link.html`](./magic-link.html)
5. Klikk **Save**

Test: logg ut i appen → «Send innloggingslenke» → sjekk innboks.

## Viktig: behold denne variabelen

I HTML-malen **må** denne stå urørt:

```
{{ .ConfirmationURL }}
```

Det er lenken brukeren klikker for å logge inn. Uten den fungerer ikke innlogging.

## Redirect-URL (samme sted)

**Authentication** → **URL Configuration**:

| Felt | Verdi |
|------|--------|
| Site URL | `https://din-app.vercel.app` (eller `http://localhost:5173` lokalt) |
| Redirect URLs | Samme URL + evt. `http://localhost:5173` |

## «Opt out» / «powered by Supabase»

Den lille foten (*You're receiving this email because… powered by Supabase*) kommer fra Supabase sin standardleveranse. For å fjerne eller endre den helt:

- **Authentication** → **SMTP Settings** → aktiver **Custom SMTP** (egen avsender, f.eks. Metzum sin e-post)
- Eller kontakt Supabase support / sjekk plan for «custom email» på ditt abonnement

Med **kun** mal-tilpasning over kan du styre emne, overskrift, knapp og brødtekst — det meste brukerne ser.

## Avsendernavn (valgfritt)

Under **Project Settings** → **General** kan du sette **Project name** til `Svette-stafetten` — noen e-postklienter viser det som avsender-tittel ved siden av e-postadressen.

Med **Custom SMTP** kan du sette f.eks. `Svette-stafetten <noreply@metzum.no>`.
