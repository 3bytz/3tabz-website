# 3TABZ CHANGELOG

## [1.1.0] — 2026-10-22

Four full projects (app, server, dashboard, website). Each has a `CHANGED_FILES.txt` against what you uploaded. Code comments were removed across all projects at your request, so most files show as modified.

### Highlights
- **International first.** Country comes from the profile, else the device region or time zone. Nigerian foods, naira prices and local examples appear only for users in Nigeria; everyone else gets international defaults. Emergency numbers by country everywhere.
- **New look.** Warm sage and cream design system, realistic app icon, splash and pill visuals (pick a shape and colour per medicine), floating tab bar, emoji removed.
- **Right-edge quick launcher.** Replaces the Home action buttons with a half-circle edge panel (pin your favourites) plus a searchable All tools screen.
- **One purchase system.** RevenueCat replaces react-native-iap on iOS and Android.
- **Subscribe on the web.** New /subscribe and /account pages (Stripe, plus Paystack where configured) unlock Pro in the app on next open. The app links to it only in storefronts you list in the dashboard (default: none), so store rules are respected.
- **Security and scale.** 0 known production vulnerabilities on server and dashboard (NestJS 11, Next.js 16), shared Redis rate limits, rewritten crons for 1M users, independent review with 15 findings fixed. Details in `SECURITY_AND_SCALE_REVIEW_2026-10-22.md`.
- **Optional intro video** after the store-required static splash; prompts in `SPLASH_VIDEO_PROMPTS.md`.

### Verification (this session, Node 22)
| Project | Check | Result |
|---|---|---|
| Server | `tsc --noEmit`, `nest build` | pass |
| Server | `jest` | 52/52 (billing over real HTTP, throttler against real Redis) |
| Server | boot and load test against real MongoDB | not run: MongoDB could not be downloaded in this sandbox |
| Server / Dashboard | `npm audit --omit=dev` | 0 vulnerabilities |
| App | `tsc --noEmit`, `expo export` (Android and iOS), `expo prebuild` | pass |
| App | `expo-doctor` | 19/21; the 2 failures need Expo's servers, unreachable here |
| App | web build against a mock API, screenshots of changed screens | reviewed |
| Dashboard | `tsc --noEmit`, `next build`, proxy security checks | pass |
| Not run | EAS builds, devices, sandbox purchases, real webhooks | need your accounts |

### Architectural changes
1. **RevenueCat for in-app purchases.** One SDK and one server sync path for both stores, which also gives cross-platform entitlement. The server still decides who is Pro, using RevenueCat's REST API and a signed webhook.
2. **Web billing module.** Stripe and Paystack checkouts write to the same subscriptions collection as the stores, so the app's Pro check did not change. Web sign-in uses a one-time email code and a short-lived token that cannot be used on the main API.
3. **Next.js 16 for the dashboard.** Needed to clear a critical advisory; `middleware.ts` became `proxy.ts` with the same checks.

## [1.0.0-store-ready] — 2026-10-16

Full, updated projects: `3tabz-app-files`, `3tabz-server-files`, `3tabz-dashboard-files`, plus `/docs` and `/website`.
Each zip contains the complete project (no `node_modules`, build output or secrets) and a `CHANGED_FILES.txt` listing
every file added, modified or deleted against what you uploaded.

### Verification (run in this session, Node 22)
| Project | Check | Result |
|---|---|---|
| Server | `tsc --noEmit` | ✅ pass |
| Server | `nest build` | ✅ pass |
| Server | `jest` (safety rules, time/dose maths, nutrition planner, pattern engine) | ✅ 36/36 tests, 5 suites |
| Server | end-to-end smoke against real MongoDB replica set + Redis | ✅ 52/52 core + 18/18 new-feature checks |
| Server | every cron run once | ✅ no errors; no Mongoose duplicate-index warnings |
| App | `npm ci` from the committed lockfile (clean copy) | ✅ pass |
| App | `tsc --noEmit` | ✅ pass |
| App | `expo-doctor` | ✅ 21/21 checks |
| App | `expo export --platform android` | ✅ Hermes bundle produced |
| Dashboard | `tsc --noEmit` + `next build` (14.2.35) | ✅ pass |
| Dashboard | BFF end-to-end against the local API (login → TOTP enrol → proxy → CSRF → logout → forged cookie) | ✅ 21/21 |
| Not run | EAS native builds, real-device tests, store sandbox purchases, iOS export | ❌ need your Apple/Google/EAS accounts and devices |

### Architectural changes (two sentences each)
1. **On-device reminders are now primary.** The app keeps a rolling 72-hour window of OS-scheduled dose notifications (plus 30-minute follow-ups), so reminders fire with no data connection. The server sends its own pre-dose push only to devices that report local reminders are off, and always sends a "did you take it?" backup after a missed dose.
2. **Offline-first dose logging.** "I took it/Skip" (in the app or on the lock screen) marks the dose handled on the phone first, then calls the idempotent API or queues the call with the original `takenAt`. The queue keeps network/5xx failures for retry and drops 4xx rejections so it can never loop.
3. **Admin dashboard uses a backend-for-frontend.** The admin JWT now lives in an HttpOnly, Secure, SameSite=Strict cookie and all API calls go through Next.js route handlers that add it server-side. Mutations also need a same-origin Origin header and a CSRF double-submit token, and middleware verifies the JWT signature with `jose`.
4. **In-app purchases rewritten for react-native-iap v14 + StoreKit 2.** Every purchase is bound to the signed-in account (`appAccountToken` / `obfuscatedAccountId`) and the server verifies the signed JWS/purchase token with Apple/Google before the app finishes the transaction. Prices and trials come only from the store; there is no longer a dev-placeholder purchase path in the paywall.
5. **Symptom checker → Symptom Journal.** The app no longer shows AI "likely causes"; it records symptoms, runs the deterministic red-flag engine (emergency numbers for the user's country) and suggests questions for a clinician. AI only tidies the user's own notes into an appointment summary (Pro, consent required).
6. **Background location removed.** The "leaving home" geofence was replaced by a time-based "Before you head out" reminder, and background/fine location, the location foreground service and `UIBackgroundModes=location` were removed. Location is now foreground-only and coarse, used solely by the pharmacy finder.
7. **API and worker are separate tasks.** The same image runs as the public API (`RUN_CRONS=false`) and one worker (`RUN_CRONS=true`), each with a read-only root filesystem and a task role that denies all AWS APIs. Redis locks make sure no cron runs twice.

### Server (`3tabz-server-files`)
Everything from the previous rounds (global auth/throttle/subscription guards, field encryption v2, email verification,
App Store Server API + Play subscriptionsv2 + signed webhooks, timezone-aware dose ledger, deterministic safety engine,
symptom journal, care partners, check-ins & patterns, nutrition planner, share links, exports/deletion, admin TOTP/sessions/audit
log, remote config) plus, in this round:
- **Infra:** new multi-stage `Dockerfile` (node 22-alpine, non-root, tini, healthcheck, `npm ci` from lockfile); `task-definition.json` hardened (read-only root FS, `/tmp` volume, all capabilities dropped, init process, task role, full secrets list); new `task-definition.worker.json`; `iam-task-role-policy.json`; `.dockerignore`; `.env.example` with every variable.
- **New script:** `src/scripts/migrate-field-encryption.ts` (idempotent, compare-and-set, `--dry-run`) for plaintext/legacy/rotated values.
- **Security:** `seed-admin.ts` no longer contains a hard-coded password (env or one-time generated, ≥14 chars); admin invite passwords now ≥12 chars (max 72).
- **Privacy:** withdrawing `caregiverSharing` consent now revokes every pending/active care-partner link immediately (NDPA s.35).
- **Fix:** removed duplicate Mongoose index declarations (push tokens, collections, medications, users, admin users, referrals, dependents, reminders, illness history, health news, refresh tokens, settings).
- **Deep links:** care-partner and crisis pushes now open `/(modals)/care-partners`.

### App (`3tabz-app-files`)
- **IAP:** `src/lib/iap/manager.ts` + `useIAP.ts` rewritten (fetchProducts/requestPurchase/getAvailablePurchases/finishTransaction v14 API; Android offer tokens; pending purchases; finish only after server verification; restore sends all purchases and finishes only verified ones).
- **Paywall:** new shared `src/components/paywall/Paywall.tsx` (monthly/yearly from the store, auto-renew/cancel disclosure, Terms/EULA/Privacy/Subscription terms links, restore, manage) used by FeatureGate and Profile; accurate Pro list; "$2.99" hard-coding removed.
- **Auth:** register → email code (`app/(auth)/verify-email.tsx`); 18+ confirmation and separate un-ticked consents (terms, health data, optional AI); unverified logins routed to verification; `PATCH /auth/consents`; `expiresIn` honoured.
- **Sign-out wipe:** `src/lib/session/wipe.ts` revokes the refresh + push token, cancels all scheduled notifications, clears the offline queue, caches, stores and generated PDFs.
- **Reminders:** `src/lib/reminder/local-scheduler.ts` (72-h window, iOS 64-notification cap respected, discreet mode), `dose-actions.ts`, `reliability.ts` + **Reminder reliability check** screen (exact-alarm access, battery optimisation, OEM steps for Tecno/Infinix/itel/Xiaomi/Samsung/Oppo/Vivo/Huawei, test reminder); `expo-background-task` replaces deprecated `expo-background-fetch`.
- **Notifications:** single channel set matching server channel ids (incl. `safety`); every server push type routed; deep-link allow-list; "I took it / Snooze / Skip" via offline queue; cold-start taps handled; open tracking; `app/+native-intent.tsx` gates incoming links.
- **New screens:** Symptom Journal, Daily check-in, My Patterns, Meal planner (with local meal-time reminders), Care partners, Share report (secure link + passcode), Get help now (offline emergency numbers), Reminder check, Verify email.
- **Privacy:** privacy cover in the app switcher, optional biometric app lock, discreet reminders, consent toggles, `allowBackup=false`, PDFs written to cache.
- **Safety & wording:** "Risk score" → "Consistency score"; "Predictions" → "Pattern estimates"; occurrence/onboarding/vitals/sickle-cell copy made non-diagnostic; medication guide is free and label-based (personal "details for dosing" field removed) with a deterministic interaction panel.
- **Contract fixes:** logs array, local-time scheduled instants, local `yyyy-MM-dd` dates, next-dose fields, 402 → 7-day fallback, care-partner list shape, check-in red flags surfaced, consent response merge, removed dead `/recovery` calls.
- **Config:** `app.json` — splash via `expo-splash-screen` plugin, background/fine location and microphone removed/blocked, `SCHEDULE_EXACT_ALARM`, privacy manifest, `ITSAppUsesNonExemptEncryption=false`, Face ID string; `eas.json` profiles with per-environment API URL and auto-increment; `.gitignore`; `.env.example` warning about public vars.
- **i18n:** `src/i18n` (English + **draft** Nigerian Pidgin for reminders, actions and safety text; language picker in Profile).
- Removed: `leaving-home-reminder.ts`, `watch-integration.ts` (claimed HealthKit/complications that didn't exist), client-side AI prompts.

### Dashboard (`3tabz-dashboard-files`)
- Next.js **14.2.35**; `jose`, `qrcode`, `server-only` added; mock data file deleted.
- BFF: `app/api/session/*` (login, totp, totp-setup with QR, totp-enable, logout, me, setup-account) and `app/api/admin/[...path]` proxy; `lib/server/session.ts`.
- `middleware.ts` verifies the session JWT; `next.config.js` security headers; rewrites to the API removed.
- Login handles forced TOTP enrolment; setup page requires 12+ character passwords; cron schedules sent as `{ jobs }`.
- New pages: Audit log, Push performance, Meal templates (validated JSON CMS). "Data exports" flag removed from Settings (a legal right can't be switched off).

### Docs & website
- `docs/SECURITY.md` (STRIDE, ASVS L2 / MASVS mapping, 32-case pentest plan with curl), `docs/PHASE2_MARKET_RESEARCH.md` (sourced), `docs/STORE_SUBMISSION_PACK.md`, `docs/LAUNCH_CHECKLIST.md`, `docs/WEBSITE_SPEC.md`, `docs/legal/*` (privacy, terms, medical disclaimer, subscription terms, deletion, retention, cookies, consent screens — drafts for legal review with `[placeholders]`).
- `website/`: static pages for privacy, terms, disclaimer, subscription terms, delete account, working password reset, support, cookies and three condition pages.

### What you must do manually
1. Fill the `[placeholders]` (RC number, address, DPO, providers/regions, backup window) and get legal sign-off before publishing the legal pages.
2. Set the new server secrets (see `.env.example`), create the IAM task role, register both task definitions, then run the field-encryption migration.
3. App: run `npm ci` (lockfile updated), then a **new EAS build** — native modules changed (`expo-background-task`, `expo-intent-launcher`, `expo-local-authentication`, `expo-localization`, `expo-file-system`), so an OTA update is not enough.
4. Dashboard: set `ADMIN_API_URL` and `ADMIN_JWT_SECRET`; remove any old `NEXT_PUBLIC_*` variables. Every admin must sign in again and enrol an authenticator app.
5. Have the Pidgin strings, red-flag rules, interaction list and meal-planner rules reviewed by a native speaker and a clinician/pharmacist.

---

## [P0-hotfix-1] — 2026-10-16
(Unchanged — see previous delivery.) Admin TOTP bypass closed, JWT-in-query removed, analytics `days` clamp, Google API path
encoding, false "caregiver notified" messages removed, app tokens moved to SecureStore, offline-safe refresh handling,
dashboard mock data opt-in only.
