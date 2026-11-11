# Pet adoption app

Read [TASK.md](TASK.md) before starting implementation or resuming work. It defines the milestone order, acceptance checks, and owner approval gates.

## Product

Build a Tinder-inspired pet adoption app. The signed-out landing page explains the app in a sentence or two and makes logging in the primary action. Use Better Auth for email/password sign-up, login, and logout. After authentication, open Discover.

Discover shows one pet at a time. Swipe left to pass or right to save the pet to Matches. A match records interest in a pet and leaves the adoption decision with the shelter. Matches is a simple list of saved pets. Keep signed-in navigation to Discover, Matches, and sign out. The MVP ends at saving interest.

## Interaction and visual design

- Support mouse drag on desktop, touch swipes on mobile, Left/Right arrow keys, and visible Pass and Adopt buttons. Route every input through the same decision handler. Ignore key repeats and shortcuts while typing or interacting with another control. Snap back on a short or canceled drag. Advance once per accepted decision and let the user retry if saving fails.
- Use Tinder's stacked-card layout, large pet photos, and prominent circular actions as the visual reference. Give the app its own colorful identity with playful accents and readable type. Use full-bleed photography where practical, especially inside cards. Keep the desktop deck centered and the mobile deck close to edge-to-edge.
- Use readable scrims over image text, descriptive alt text, visible keyboard focus, and reduced-motion support. Include loading, empty, and retry states for Discover and Matches.

## Implementation

- Use Vite, React, TypeScript, Tailwind CSS, and shadcn/ui on the frontend. Use Express and TypeScript on the server, PostgreSQL with Drizzle ORM and versioned SQL migrations, Better Auth with its Drizzle adapter, and ESLint across the project.
- Keep a same-origin API. Proxy API requests through Vite in development and serve the built frontend from Express in production. Protect pet and decision API routes with server-side session checks and derive the user ID from the session.
- Store pets and each user's decisions in Postgres. A decision belongs to one user and one pet. Enforce uniqueness on that pair and make retries safe. Discover excludes previously decided pets for that user. Matches lists that user's right swipes, newest first. Preserve decisions across reloads and sign-ins.
- Use the mock catalog in TASK.md. Use stable fixture IDs, fictional profiles, and an explicit seed command that can be rerun without duplicating pets or erasing user data.

## Environments

Read `DATABASE_URL` and Better Auth configuration from server-side environment variables. Commit an `.env.example` with placeholders and ignore local secret files. Keep connection strings and auth secrets out of source, browser bundles, and logs.

The owner has designated a Render Postgres instance for development and eventual production. Use its external connection URL for local development when configured and its internal URL on Render where available. Use a disposable Postgres database for automated tests and clean migration rehearsals. Apply reviewed, versioned migrations to the shared database and preserve existing data.

Package production as one Render web service serving the frontend and API. Keep build, migrate, seed, and start as separate commands. Document the GitHub-linked deployment setup and the environment values the owner supplies.
