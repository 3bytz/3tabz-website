# 3TABZ — Launch checklist (first Apple + Google submission)

Tick in order. Owner: [YOU] unless stated.

## A. Company & accounts
- [ ] CAC details, registered address, DPO named → fill placeholders in `/docs/legal` and `/website`
- [ ] Nigerian data-protection lawyer reviews Privacy Policy, Terms, Medical Disclaimer, transfer basis (NDPA s.41–43)
- [ ] NDPC: check whether 3tabz is a data controller of major importance and register; plan the annual compliance audit (GAID 2025)
- [ ] D-U-N-S number; Apple Developer **organisation** account; Google Play **organisation** account
- [ ] Apple Small Business Program enrolment; Paid Apps agreement, tax and bank info (both stores)
- [ ] Mailboxes: support@, privacy@, dpo@, security@3tabz.com

## B. Infrastructure (API)
- [ ] Secrets in AWS Secrets Manager (see `.env.example`): new `JWT_*`, `ADMIN_JWT_SECRET`, `FIELD_ENCRYPTION_KEYS` + `FIELD_ENCRYPTION_ACTIVE_KID`, `FIELD_BLIND_INDEX_KEY`, Apple .p8 + key id + issuer + `APPLE_APP_APPLE_ID`, Google SA JSON, RTDN audience/email, SMTP, OpenAI
- [ ] Create IAM task role `threetabz-api-task-role` with `iam-task-role-policy.json`; register `task-definition.json` (API, `RUN_CRONS=false`) and `task-definition.worker.json` (one worker, `RUN_CRONS=true`)
- [ ] MongoDB replica set with backups (point-in-time) + restore test; Redis with AUTH/TLS
- [ ] Build image from the new `Dockerfile` (`npm ci` uses the committed lockfile)
- [ ] Run `node dist/scripts/migrate-field-encryption.js --dry-run`, then for real (existing data)
- [ ] Seed the first admin: `SEED_ADMIN_EMAIL=… npx ts-node -r tsconfig-paths/register src/scripts/seed-admin.ts`, sign in, enrol TOTP
- [ ] Apple App Store Server Notifications V2 → `/v1/subscription/apple` (prod + sandbox); Google RTDN Pub/Sub push → `/v1/subscription/google-rtdn`
- [ ] CloudWatch alarms: 5xx, latency, auth failures, webhook verification failures, cron failures; log retention set
- [ ] WAF rate-based rule on the ALB

## C. Dashboard
- [ ] Deploy with `ADMIN_API_URL`, `ADMIN_JWT_SECRET`; restrict by IP/VPN; set admin IP allow-list to the dashboard's egress IP
- [ ] Confirm `__Host-3tabz_admin` cookie is HttpOnly/Secure/SameSite=Strict in production

## D. Website
- [ ] Publish `/website` with clean URLs and headers (see WEBSITE_SPEC.md); check `/reset-password` end-to-end

## E. App build
- [ ] `npm ci` → `npx tsc --noEmit` → `npx expo-doctor` (all green in this release)
- [ ] `eas build -p all --profile production` (sets `EXPO_PUBLIC_API_URL=https://api.3tabz.com/v1`)
- [ ] On real devices (at least one **Tecno or Infinix**, one Samsung, one iPhone): reminders fire offline; "I took it" from lock screen while offline syncs later; reliability screen; test reminder; exact-alarm settings link; discreet mode; app lock; sign-out wipes reminders
- [ ] Sandbox purchase + restore on iOS (StoreKit sandbox) and Android (licence testers); server shows `isPro`
- [ ] Pidgin strings reviewed by a native speaker **and** a pharmacist (src/i18n/pcm.ts is a draft)
- [ ] Clinician review of red-flag rules, interaction list and meal-planner rules (record reviewer + date in the server `KNOWLEDGE_META`)

## F. Store consoles (see STORE_SUBMISSION_PACK.md)
- [ ] Listing, screenshots, IAP products, privacy label / Data safety, Health apps declaration, age rating questionnaire, review notes with demo account
- [ ] Google: if the account is **personal**, run the 12-tester × 14-day closed test first
- [ ] Phased release on both stores

## G. After launch (first 2 weeks)
- [ ] Watch Push performance and reminder-health metrics by phone brand
- [ ] External penetration test (SECURITY.md §6) — before scaling marketing
- [ ] Plan: Next.js 15/16 upgrade for the dashboard; certificate-pinning decision; WebAuthn for admins
