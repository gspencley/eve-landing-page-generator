# Eve Landing Page Generator

Slack-integrated personalized landing page generator for a GTM engineering take-home assignment.

Given a firm name from a Slack slash command, the app looks up prospect/enrichment/interaction data from local spreadsheets, deterministically selects marketing assets, persists a generated landing page in SQLite, and returns a public URL.

## Quick start

Install node v24.16.0
I recommend using nvm https://github.com/nvm-sh/nvm
```bash
nvm install 24.16.0
nvm use 24.16.0
node --version
```

Copy the example environment file to .env, install dependencies and run:

```bash
cp .env.example .env
npm install
npm run start:dev
```

Verify locally:

- `GET http://localhost:3000/health` → `{ "ok": true }`
- `GET http://localhost:3000/admin/pages` → JSON list of generated pages
- `GET http://localhost:3000/p/sample-firm` → server-rendered sample landing page

For local testing of the Slack integration, install `ngrok`

```bash
ngork config add-authtoken $YOUR_AUTHTOKEN
ngrok http 3000
```

Then create a Slack app, give it the `/landing-page` slash command, configure it to hit the `/commands/slack` endpoint, publish your app and try it out. 

## What I Would Have Implemented Given More Time

- Something a bit more flexible / extensible than the `scoreAsset()` function. Scoring prospects and choosing assets is the core set of business rules that this application implements. This is something that the Marketing Team will constantly want to tweak and play with. Although I did split the implementation of that function up into reusable blocks, it would be nice if it were easier for developers to add new scoring metrics/criteria or change existing ones. The Chain of Responsibility Pattern could serve us well here. Different scoring criteria could then be added/removed very easily, and there would be strong separation of concerns between the various "score-ers." 
- Introduce a Database Access Layer with custom repository implementations. Services are currently using TypeORM's `@InjectRepository()` decorator directly which is fine for a first pass but it couples the services layer directly to the ORM and the instant we need custom queries or more domain-specific functionality at the persistence layer, we risk seeing developers squeeze persistence responsibilities into the services layer where it doesn't belong.
- Unit tests for the ORM config. I implemented unit tests for business logic but because TypeORM uses decorators on the entity classes, any changes to those classes risks introducing regressions and, therefore, unit testing the ORM mapping is a good idea.
- Less than dummy assets. The assets that can be grabbed right now are basically "cards." I would like to throw images, animations and other "widgets" and stuff in the mix. For some prospects, having interactive assets, such as a calculator or something, would be cool.
- Web components for the landing pages. I assume that we want brand consistency across our various offerings. The landing pages could use a web components library developed in-house that our public facing website would also use and possibly our core platform as well.
- End-to-end tests to make sure that the entire flow is working correctly and to safeguard against regressions as the app evolves.
- Authentication. This is a proof of concept and not production ready. All endpoints are publicly accessible except for the Slack integration when run in production mode.

## Assessment data (`/data`)

**Place the real take-home spreadsheets in the project `/data` folder:**

| File | Purpose |
|------|---------|
| `prospect_firms.xlsx` | Firm attributes (industry, practice area, size, intake, pain points, CMS, lead status) |
| `enrichment_signals.csv` | Tech stack, competitor mentions, growth signals |
| `interaction_history.csv` | Outreach history, bounced events, previously sent assets |

If `prospect_firms.xlsx` is missing, the app derives prospect rows from `enrichment_signals.csv`. If CSV/XLSX files are absent entirely, built-in sample data is used so the app still runs locally.

A SQLite database (`DATABASE_PATH`, default `./data/app.sqlite`) is used to store app-generated data:

- Generated landing pages
- Selected assets and scoring explanations
- Page analytics events

## Environment variables

Copy `.env.example` to `.env`:

```env
PORT=3000
PUBLIC_BASE_URL=http://localhost:3000
SLACK_SIGNING_SECRET=
NODE_ENV=development
DATABASE_PATH=./data/app.sqlite
```

`SLACK_SIGNING_SECRET` is required in production. In development, signature verification is skipped when the secret is empty (local-demo friendly).

## Slack integration

### Slash command

- **Endpoint:** `POST /slack/commands`
- **Command:** `/generate-page Firm Name`
- **Example:** `/generate-page Cellino Law`

Flow:

1. Verify Slack request signature (`X-Slack-Signature`, `X-Slack-Request-Timestamp`)
2. Acknowledge quickly with an ephemeral “generating…” message
3. Match firm data, select assets, persist page
4. Post the landing page URL to Slack via `response_url`

### Expose locally with ngrok (for Slack testing)

1. Start the app: `npm run start:dev`
2. In another terminal: `ngrok http 3000`
3. Copy the HTTPS forwarding URL (e.g. `https://abc123.ngrok-free.app`)
4. Update `.env`:
   ```env
   PUBLIC_BASE_URL=https://abc123.ngrok-free.app
   ```
5. In [Slack API app settings](https://api.slack.com/apps):
   - **Slash Commands** → Request URL: `https://abc123.ngrok-free.app/slack/commands`
   - **Basic Information** → copy **Signing Secret** → set `SLACK_SIGNING_SECRET` in `.env`
6. Restart the app after changing env vars

## API overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/slack/commands` | Slack slash command handler |
| GET | `/p/:slug` | Server-rendered landing page |
| POST | `/events` | Record analytics event |
| GET | `/admin/pages` | List generated pages (JSON) |
| GET | `/admin/events` | List analytics events (JSON) |

### Analytics events

Supported `eventType` values:

- `page_view` (recorded server-side on page load)
- `asset_click`
- `cta_click`
- `form_submit`

Example:

```bash
curl -X POST http://localhost:3000/events \
  -H 'Content-Type: application/json' \
  -d '{"pageId":"<id>","eventType":"cta_click"}'
```

## Architecture

```
Slack (/generate-page)
    → FirmLookupService (normalize + fuzzy match)
    → DataService (CSV/XLSX from /data)
    → matchAssets() (weighted scoring function)
    → PageGenerationService (persist to SQLite)
    → Handlebars landing page (/p/:slug)
    → Analytics (POST /events)
```

### Modules

- **`data/`** — File parsers, normalization, runtime data loading
- **`firms/`** — Firm profile assembly and tolerant name lookup
- **`assets/`** — Static asset library + deterministic matcher
- **`pages/`** — TypeORM entities, page generation, landing + admin controllers
- **`slack/`** — Signature verification and slash command handler
- **`views/`** — Handlebars layouts and landing page template

## Asset matching

Assets are selected with a **deterministic weighted score** (highest scores win; top 3 are shown).

Scoring inputs:

| Signal | Weighting approach |
|--------|-------------------|
| Industry / practice area / firm size | Direct attribute match (+3 to +6) |
| Intake method / CMS / lead status | Direct attribute match (+3 to +5) |
| Pain points | Keyword match against firm pain points (+5 each) |
| Enrichment signals | Keyword match on news, hiring, growth, competitor mentions (+4 to +6) |
| Base asset relevance | Per-asset `baseWeight` (+7 to +11) |

Penalties:

- **Previously sent asset** (−25): asset ID appears in interaction history for the firm
- **Bounced outreach** (−8): firm has ≥2 bounced interactions (softer top-of-funnel bias)

Each asset receives a **scoring explanation** (reasons + penalties) persisted on the generated page for transparency.

## Firm lookup

Firm names are normalized for lookup:

- Case-insensitive
- `&` → `and`
- Punctuation stripped
- Token overlap for abbreviations / partial names (e.g. `JS Farrin` → `Law Offices of James Scott Farrin`)

Useful errors are returned when no match is found, including up to 5 suggestions when ambiguous.

## Assumptions

- Slack slash commands send `application/x-www-form-urlencoded` bodies
- Assessment prospect data uses the column names shown in sample/fallback rows
- Asset library URLs are placeholders (`example.eve.legal`)
- SQLite `synchronize: true` is enabled outside production for local development
- No authentication on admin endpoints yet (local demo scope)

## Tradeoffs

- **File-based source data vs DB import:** Keeps assessment data easy to swap without migrations; tradeoff is no SQL joins across prospects and pages
- **Deterministic matcher vs ML:** Explainable and testable; tradeoff is manual tag maintenance in the asset library
- **Slack async via `response_url`:** Meets Slack’s 3-second ack window; tradeoff is slightly more moving parts than synchronous-only
- **Derive prospects from enrichment CSV:** Unblocks local dev without `prospect_firms.xlsx`; tradeoff is inferred attributes may differ from official prospect sheet

## Next steps

- [ ] Add authentication for `/admin/*` routes
- [ ] Idempotent Slack retry handling (`trigger_id` dedupe)
- [ ] Regenerate/update pages when source files change
- [ ] Unit tests for normalization, matching, and signature verification
- [ ] Form submit capture on landing page CTA flow
- [ ] Production hardening (migrations, structured logging, rate limits)

## Scripts

```bash
npm run start:dev   # watch mode
npm run build       # compile to dist/
npm run start       # run compiled app
npm run lint        # ESLint
npm run format      # Prettier
```
