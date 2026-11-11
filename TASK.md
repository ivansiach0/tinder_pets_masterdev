# Implementation milestones

Work on the first milestone whose owner approval is unchecked. For each completed and verified item, change `[ ]` to `[x]`. Leave blocked or unverified items unchecked and report the reason. At the end of the milestone, share what changed, the checks you ran, and instructions for the owner's review. Include screenshots or a local URL for UI milestones when available.

Stop at each owner approval checkbox, including when resuming in a new chat. The owner checks the box or explicitly approves that milestone in chat. If they approve in chat, record it before starting the next milestone. Apply requested corrections within the current milestone and return it for review.

## 1. Scaffold and public landing

- [x] Scaffold the Vite/React and Express apps, configure TypeScript, Tailwind, shadcn/ui, and ESLint, and commit the package lockfile.
- [x] Add root scripts for development, lint, typecheck, and build. Confirm both apps run locally and that Vite proxies an API request to Express.
- [x] Build the minimal public landing page with a full-bleed pet image where practical, a short product description, and a primary login CTA that opens the sign-in screen. Authentication is connected in milestone 2.
- [x] Run lint, typecheck, and build. Review the landing page at desktop and mobile widths and confirm the CTA is reachable by keyboard.
- [ ] **Owner approval for milestone 1**

## 2. Database, mock catalog, and authentication

- [ ] Add Drizzle schema and versioned migrations for Better Auth, pets, and decisions. Include foreign keys and a unique constraint for user and pet.
- [ ] Add `npm run db:migrate` and `npm run db:seed`. Apply migrations to a fresh disposable database and run the seed twice. Verify the catalog contains 67 unique pets.
- [ ] Wire Better Auth to Express and React. Provide sign-up, sign-in, and sign-out with feedback for failed submissions. Add a protected Discover route and redirect signed-out visitors to sign-in.
- [ ] Implement protected API endpoints to fetch undecided pets, record a decision, and list matches. Verify anonymous requests are rejected, invalid decisions are rejected, duplicate submissions create one row, and two accounts have isolated results.
- [ ] Verify sign-up, sign-in, session persistence on reload, and sign-out in the browser. Apply the reviewed migration and seed to the designated Render database if its connection is configured. Report which database was verified.
- [ ] **Owner approval for milestone 2**

## 3. Discover and Matches

- [ ] Build the responsive Discover deck with full-bleed photos, pet details, Pass and Adopt actions, and loading, error, and end-of-deck states.
- [ ] Verify left and right decisions by mouse drag, arrow keys, touch swipe, and buttons. Verify short and canceled gestures snap back, and repeated input during a save advances only one card.
- [ ] Build Matches and its empty and error states. Verify a right swipe appears in Matches after reload, a left swipe stays out of Matches, and both pets stay out of Discover for that account.
- [ ] Verify save failure preserves the current card and allows retry. Review keyboard navigation, focus visibility, reduced motion, and mobile touch behavior on a device or in browser emulation. Report which environment was used.
- [ ] **Owner approval for milestone 3**

## 4. Render deployment handoff

- [ ] Make `npm run build` build both apps and `npm start` serve the built app on `0.0.0.0` using Render's `PORT`. Verify direct navigation to a frontend route works and unknown API routes return API errors.
- [ ] Add a health endpoint that returns success when the server and database are reachable. Verify it reports failure when the database is unavailable.
- [ ] Document the Render settings in the README. Use `npm ci && npm run build` for Build, `npm run db:migrate` for Pre-Deploy on supported plans, and `npm start` for Start. Document a separately run migration for plans without Pre-Deploy and a one-time seed command. Keep schema changes and seeding out of build and startup.
- [ ] Document the GitHub branch connection and automatic deploy settings, health-check path, database URL, Better Auth public URL and secret, and local setup from `.env.example`. Use the existing Render database in the deployment instructions. See [Render deploys](https://render.com/docs/deploys) and [Render health checks](https://render.com/docs/health-checks).
- [ ] Rehearse a clean install, build, migration, seed, and production start against a disposable database. Smoke-test health, landing, login, swipe, and Matches. Share the exact Render settings with the owner. Leave GitHub push and live deployment for the owner's release.
- [ ] **Owner approval for milestone 4**

## Mock catalog

Use `https://pets-images.dev-apis.com/pets/` as the base URL. Ranges are inclusive.

| Species | Image filenames | Count |
| --- | --- | ---: |
| Dogs | `dog1.jpg` through `dog39.jpg` | 39 |
| Cats | `cat1.jpg` through `cat14.jpg` | 14 |
| Birds | `bird1.jpg` through `bird9.jpg` | 9 |
| Rabbits | `rabbit1.jpg` through `rabbit3.jpg` | 3 |
| Reptiles | `reptile1.jpg` and `reptile2.jpg` | 2 |

Give each pet a fictional name, age, location, and short bio. Verify the URLs when building the seed and handle image load failures without disabling swipe controls.
