# 3TABZ Data Retention Schedule

Version 2026-10-16. Reflects the retention rules implemented in the API code (TTL indexes and the deletion job). Review annually.

| Data | Retention | How it's enforced |
|---|---|---|
| Account & health data (medicines, logs, journal, check-ins, readings, meal plans, care partners, dependants, referrals, subscriptions) | while the account is active; deleted 30 days after a deletion request | `account-deletion-executor` cron → `DELETE_ACCOUNT` job removes the user and 27 related collections |
| Unverified sign-ups (email code) | code valid 15 min | verification TTL in user record |
| Refresh tokens | 30-day lifetime; purged 7 days after expiry | TTL index on `expiresAt` (+7 days) |
| Password-reset tokens | single use, short expiry | refresh-token collection with `type=password-reset` |
| Data export files | one-time download link, 72 hours | TTL index on `expiresAt` |
| Shared doctor-report links | until expiry (1–14 days chosen by user) + 7 days, then removed | TTL index on `expiresAt` |
| Notification delivery log (type, outcome, opened) | 120 days | TTL index |
| Expo push receipts tickets | 2 days | TTL index |
| AI usage log (tokens, feature, no prompt text) | 400 days | TTL index |
| Store webhook events (idempotency) | 180 days | TTL index |
| Admin sessions | expiry + 1 day | TTL index |
| Admin audit log | 2 years (730 days) | TTL index |
| Server application logs | [set in CloudWatch: e.g. 30 days] | log group retention setting |
| Database backups | [e.g. 35 days point-in-time] | database provider setting |
| On-device data (tokens, medicine cache, offline queue, PDFs) | until sign-out / uninstall | `wipeLocalData()` on sign-out and account deletion |
