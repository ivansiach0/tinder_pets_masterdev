# Pawprint

Pawprint is a pet adoption discovery app. Sign in to browse mock pet profiles, pass on a pet, or save it to Matches.

## Local development

Use Node.js 24. Run the following from the repository root.

```sh
npm ci
cp -n .env.example .env
openssl rand -base64 32
```

Set the values in the root `.env` file.

| Variable | Local value |
| --- | --- |
| `DATABASE_URL` | The external connection URL from the designated Render Postgres instance, or a disposable Postgres URL for testing. |
| `BETTER_AUTH_URL` | `http://localhost:5173`. Use this same address in your browser. |
| `BETTER_AUTH_SECRET` | The generated value from the command above. |

Apply migrations and load mock pets when setting up a fresh database. The designated Render database already has the initial migration and 67 mock profiles. Pawprint uses the `pawprint` schema and tracks its migrations separately from the existing `public.pets` table.

```sh
npm run db:migrate
npm run db:seed
npm run dev
```

Open [Pawprint locally](http://localhost:5173/). Vite serves the UI and forwards `/api` to Express on port 3001. Run `npm run lint`, `npm run typecheck`, and `npm run build` to verify changes.

## Deploy from GitHub to Render

Push the approved release to your GitHub repository. In Render, create a **Web Service** using **Git Provider**, connect GitHub, and select the repository. Use the branch you push releases to. [Render web services](https://render.com/docs/web-services)

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Region | Ohio, in the same workspace and region as the existing Render Postgres instance |
| Branch | `main` |
| Root Directory | Leave blank to use the repository root |
| Build Command | `npm ci && npm run build` |
| Pre-Deploy Command | `npm run db:migrate` on a plan with Pre-Deploy |
| Start Command | `npm start` |
| Health Check Path | `/health` |
| Auto-Deploy | **On Commit** for this repository. Use **After CI Checks Pass** if you add GitHub CI checks. |

Set these environment variables on the Render web service.

| Variable | Render value |
| --- | --- |
| `NODE_VERSION` | `24.21.0` |
| `DATABASE_URL` | The **Internal Database URL** from the existing Render Postgres instance. |
| `BETTER_AUTH_URL` | The public HTTPS origin users will open, such as `https://your-service.onrender.com`. |
| `BETTER_AUTH_SECRET` | A separate production secret generated with `openssl rand -base64 32`. Keep it consistent across deploys. |

Render supplies `PORT`. Express binds to `0.0.0.0` and serves the API and built frontend from one origin. The unauthenticated `GET /health` returns HTTP 200 when Postgres responds and HTTP 503 when the database is unavailable. [Render health checks](https://render.com/docs/health-checks) · [Render database connection URLs](https://render.com/tutorials/postgres-on-render/connection-strings)

### Apply migrations and load fixtures

- On a plan with Pre-Deploy, Render runs `npm run db:migrate` before switching to the new release.
- On a plan without Pre-Deploy, run `npm run db:migrate` from the release checkout using the existing Render database's external URL before pushing a release that contains schema changes.
- For a fresh database, run `npm run db:seed` once after migrating. The seed skips existing fixture IDs and preserves accounts and decisions. The designated Render database is already seeded.

Build and startup are independent of migrations and seeding. Pushes or merges to the linked branch trigger future deploys according to the Auto-Deploy setting. [Render deployment lifecycle](https://render.com/docs/deploys)

After the first release, check `/health`, open the landing page, and verify sign-in and the Discover-to-Matches flow using a test account.
