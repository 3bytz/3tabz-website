# Security and scale review, round 2 (22 Oct 2026)

Scope: server (NestJS), mobile app (Expo), admin dashboard (Next.js), website. This round builds on `SECURITY.md` (STRIDE model, ASVS/MASVS checklist, 32-case pentest plan), which still applies.

## 1. Dependency vulnerabilities

| Project | Before | After | How |
|---|---|---|---|
| Server (production deps) | 21 (1 critical `tar` via bcrypt, 6 high incl. `multer` and `body-parser` DoS in Express 4, `nodemailer` SMTP injection, `lodash`) | **0** | NestJS 10 → 11.2 (Express 5), bcrypt 6, nodemailer 10.2, throttler 6.7, helmet 8, `uuid` replaced by `crypto.randomUUID` and pinned to 11 via `overrides` |
| Dashboard (production deps) | 2 (critical Next.js request smuggling / RSC DoS, high PostCSS) | **0** | Next 14.2.35 → 16.4.2, React 19.2; `middleware.ts` renamed to `proxy.ts` (Next 16 convention); async `cookies()` and route `params` |
| App | not auditable offline the same way | removed `react-native-iap` + `react-native-nitro-modules`, added `react-native-purchases@10.12.2` | fewer native modules to keep patched |

## 2. Findings fixed in code this round

| # | Area | Finding | Risk | Fix |
|---|---|---|---|---|
| 1 | Email | SMTP transport had `tls.rejectUnauthorized: false` | A network attacker could intercept password-reset and sign-in codes | Certificate verification on, TLS 1.2 minimum, STARTTLS required on port 587, pooled connections with timeouts |
| 2 | Logs | Email addresses written to logs in full | Personal data in CloudWatch | Masked (`a***@domain`) |
| 3 | Rate limiting | In-memory throttler: every ECS task kept its own counters | Limits multiplied by task count; brute force spread across tasks | Redis-backed throttler storage (atomic Lua), shared by all tasks; fails open if Redis is down so the app stays up |
| 4 | Input | Sanitiser stopped at depth 10 and passed deeper objects through unchecked | `$`-operator injection hidden at depth 11+ | Bodies nested deeper than 12 levels are rejected with 400 |
| 5 | Headers | `X-Request-ID` taken from the client without limits | Log injection, oversized log lines | Only `[A-Za-z0-9_-]{8,64}` accepted, otherwise a new UUID |
| 6 | Process | No handler for unhandled promise rejections; failed bootstrap left a zombie | Silent crashes or tasks that never become healthy | Rejections logged; uncaught exceptions log and exit so ECS replaces the task; bootstrap failure exits with code 1 |
| 7 | HTTP | Node keep-alive (5 s) shorter than ALB idle timeout (60 s) | Intermittent 502s under load | `keepAliveTimeout` 65 s, `headersTimeout` 66 s, `requestTimeout` 30 s; gzip for responses over 1 KB |
| 8 | Inventory | Pill count updated with read-then-write | Lost updates when two devices log at once | Single atomic update (`$add` / `$max(0, …)` pipeline) |
| 9 | Billing | New web and RevenueCat endpoints | Forged webhooks, replay, account takeover through checkout | Stripe signature (5-minute tolerance), Paystack HMAC-SHA512 on the raw body, RevenueCat shared secret with constant-time compare; idempotency ledger; one subscription can belong to one account (unique index); web sign-in via one-time email code with per-email and per-IP limits; billing tokens signed with a separate derived key and audience; tested in `billing.spec.ts` |
| 10 | Dashboard | Stale `task-definition copy.json` used the execution role as the task role | Anyone deploying it would grant the app the execution role's permissions | File removed; use `task-definition.json` and `task-definition.worker.json` only |
| 11 | Copy | AI disclaimer, website and app emergency text said "112 (Nigeria)" to everyone | Wrong advice for US/UK users in an emergency | Local number by country in the app; neutral examples on the website and in AI disclaimers |
| 12 | Website | No CSP; legal pages allowed framing via missing headers on some paths | Clickjacking and script injection surface | Strict CSP (self + Google Fonts + API), `frame-ancestors 'none'`, Permissions-Policy, no-store and no-referrer on billing pages |

## 2b. Independent review pass (second reviewer, same day)

A separate reviewer read the new billing, cron and storage code without seeing my notes. Every finding below was fixed and re-tested.

| # | Finding | Fix |
|---|---|---|
| R1 | RevenueCat sync never closed rows for products the user no longer owned | After each sync, any other active RevenueCat row for that user is marked expired |
| R2 | Stripe refunds without an invoice were ignored, and a later webhook could reactivate a refunded plan | Refunds resolve by subscription or customer, cancel the Stripe subscription, mark it refunded; refunded rows are never reactivated |
| R3 | Web sign-in code attempts were counted with read-then-write | Attempts use an atomic counter (5 max); a code can be redeemed exactly once |
| R4 | Expiry job could expire a row renewed between read and write | The update repeats the full "still expired" condition |
| R5 | Sign-in start time revealed whether an email had an account | Response returns immediately; lookup and email happen in the background |
| R6 | Stripe `past_due` kept Pro for the whole new period | Pro runs to the start of the unpaid period plus 7 days |
| R7 | Inventory "consumed" entries replaced the count instead of subtracting | Treated as a subtraction, floored at 0 |
| R8 | Paystack customer links lived only in Redis for 30 days, and unlinked events were dropped | Link stored on the user record; unlinked events return 503 so Paystack retries |
| R9 | Long cron runs could outlive their lock | Locks renew themselves while the job runs; released only by their owner |
| R10 | Default country was Nigeria for every new user | Country comes from the profile or the device time zone; `scripts/fix-default-country.ts` cleans old rows |
| R11 | Two webhooks for one purchase could send two "plan active" emails; renewals could drop Pro for minutes | The email is sent only by the update that actually changed the status; active web plans carry a 1–2 day renewal buffer |
| R12 | A subscription could be rewritten by a webhook carrying another user's ID | Upserts are scoped to the owning user; clashes return 409 |
| R13 | Two entitlement recalculations for one user could race | Per-user Redis lock with a short wait |
| R14 | A slow Redis could stall every request in the rate limiter | Rate-limit lookups give up after 250 ms and allow the request |
| R15 | Expiry warnings were sent to people who had already renewed | Warnings skip anyone still Pro |

## 3. Scaling to 1M users: what changed and why

The old cron jobs did one or more database queries per medicine every 5 to 15 minutes. At 1M users with about 3 medicines each that is roughly 3M queries per run, which cannot finish inside the lock window and would have overlapped and fallen over.

| Job | Before | After |
|---|---|---|
| Dose ledger (every 15 min) | 1 query + 1 insert per medicine | 1 log query per 1,000 medicines, `insertMany` with duplicates ignored |
| Dose pushes (every 5 min) | 2–4 queries per medicine plus 1 per user | 3 queries per 500 medicines (logs, care partners, local-reminder status); sends run through a bounded pool (`CRON_CONCURRENCY`, default 20) |
| Local-time jobs (every 15 min) | Recomputed time-zone maths up to 8 times per user | Once per time zone per run; only users with something due do any work, in parallel through the pool |
| Health-activity reminders | Loaded every scheduled activity into memory | Streams in batches of 500 |
| Subscription expiry and warnings | Loaded every matching row into memory | Streams with cursors, batched updates |

Other changes:
- Mongo pool from a fixed 5 to `MONGO_MAX_POOL` (default 50) per task, with queue timeout 10 s.
- New indexes: `medications {status, _id}`, `push_tokens {userId, isInvalid, localRemindersActive, lastSeenAt}`, `users {subscriptionTier, proExpiresAt}`, partial `users {dataExportRequested}`, `subscriptions {platform, providerSubscriptionId}` (unique), `subscriptions {status, currentPeriodEnd}`.
- The app polled `/subscription` every 60 s and today's schedule every 60 s while open. At 50k people with the app open that is about 1,700 requests per second for nothing. Now: subscription refetches on app focus only, schedule every 5 minutes (the screen already updates instantly when you log a dose), dashboard every 10 minutes.

### Suggested capacity plan (estimates, validate with the load test)

| Stage | Users | API tasks (0.5 vCPU / 1 GB) | Worker | MongoDB Atlas | Redis |
|---|---|---|---|---|---|
| Launch | up to 50k | 2 (autoscale 2–4 on CPU 60%) | 1 | M10 | 1 small node |
| Growth | 50k–300k | 3–8 | 1 (2 vCPU) | M30, read preference primary | cache.t4g.small with replica |
| Scale | 300k–1M | 6–20 | 2, split crons by job | M40/M50 + online archive for logs older than 18 months | cache.m7g.large with replica |

Notes: the worker must stay at one task per job unless you shard jobs (the Redis lock already prevents double sends). Expo push has its own rate limits (about 600 notifications per second per project); dose reminders are scheduled on the phone so pushes are only the backup, which keeps you far below that.

## 4. Load test

`npm run loadtest` in the server project (uses autocannon). Run it against **staging**, never production (the script refuses `3tabz.com` unless you force it).

```
LOADTEST_BASE_URL=https://staging-api.3tabz.com/v1 \
LOADTEST_EMAIL=loadtest@yourdomain.com LOADTEST_PASSWORD=... \
LOADTEST_CONNECTIONS=200 LOADTEST_DURATION=60 LOADTEST_P99_MS=800 \
npm run loadtest
```

One account will hit its own per-user rate limit quickly; that shows up as `throttled429` and is expected. For a realistic picture, raise `THROTTLE_LIMIT` on staging or run several copies with different accounts.

## 5. What I verified, and what I could not

| Check | Result |
|---|---|
| Server `tsc --noEmit`, `nest build` | Pass |
| Server unit and HTTP tests (jest) | 52/52 pass, including 9 new billing tests over real HTTP (signature checks, replay, sign-in codes, token separation) and 3 throttler tests against a real Redis |
| Server boot with a real MongoDB | **Not run.** This sandbox could not download a MongoDB binary (blocked network). Run `npm run start:dev` against staging and the Postman/curl cases in `SECURITY.md` before release |
| Load test numbers | **Not run here** for the same reason. Script provided |
| Dashboard `tsc`, `next build`, proxy checks (no cookie, forged JWT, valid JWT, missing CSRF, cross-origin, blocked auth path) | Pass |
| App `tsc`, `expo export --platform android`, `expo prebuild` (iOS and Android) | Pass |
| App `expo-doctor` | 19/21; the 2 failures are network checks that could not reach Expo's servers from this sandbox |
| App screens | Rendered in a browser build against a mock API and reviewed visually (Today, Meds, Add medicine, Check-in, Profile, Paywall, Quick actions, All tools). Native-only parts (notifications, purchases, haptics) need a development build on a device |
