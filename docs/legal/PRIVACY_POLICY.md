# 3TABZ Privacy Policy

**Draft for legal review — version 2026-10-16.** Text in [brackets] must be completed by 3tabz before publishing.
This policy describes exactly what the 3TABZ app (v1.0.0), API and admin tools do as built. If the product changes, update this policy first.

**Controller:** 3tabz, a company registered in Nigeria, RC [RC NUMBER], [REGISTERED ADDRESS].
**Data Protection Officer:** [DPO NAME], dpo@3tabz.com · General privacy questions: privacy@3tabz.com

---

## 1. Summary
- 3TABZ helps you manage medicines and keep a health diary. It does **not** diagnose, treat or provide telemedicine.
- We collect the health information **you** enter so the app can work. We do not sell it, use it for advertising, or show ads.
- AI features are **off** unless you turn them on. When on, we send only the minimum de-identified details needed.
- You can export your data or delete your account in the app at any time (Profile → Privacy & Data).

## 2. What we collect and why

| Data | Examples | Why we use it | Legal basis (NDPA 2023) |
|---|---|---|---|
| Account details | name, email, password (stored only as a one-way hash), timezone, country, language | create and secure your account, send verification and safety emails | contract (s.25(1)(b)) |
| Age confirmation | that you confirmed you are 18+ | accounts are for adults; children are managed by a parent as dependants | legal obligation / contract |
| **Health information** (sensitive personal data, s.65) | medicines, doses, schedules, dose logs, refills, symptoms, readings (temperature, blood pressure, sugar, SpO₂), check-ins (mood, pain, sleep, water, period), conditions/collection names, meal-plan answers, notes | provide reminders, logs, reports, patterns, safety checks and meal plans | your consent (s.30(1)(a)), given at sign-up and withdrawable |
| Dependants' information | name, relationship, their medicines | caregiver mode, entered by a parent/guardian | consent of the parent/guardian (s.31) |
| Care-partner links | partner email, permissions, alert delay | send the alerts you choose to people you invite | your consent |
| Device & technical data | push token, app version, platform, phone manufacturer, notification permission state, which notification types you open, IP address in server logs | deliver reminders and notifications, fix reliability problems, security | legitimate interests (s.25(1)(f)) / contract |
| Purchases | store, product, renewal status, expiry, signed purchase proof | provide Pro and prevent fraud | contract; legal obligation (tax/records) |
| Approximate location | only while you use "Find pharmacy" | sent **from your phone directly** to OpenStreetMap's Overpass service to list nearby pharmacies. 3TABZ does not receive or store it | your request (consent) |
| Camera | barcode scanning | read the barcode on a medicine pack **on your phone**; images are not uploaded | your request |

We do **not** collect: contacts, photos, precise location, advertising identifiers, browsing history, or data from HealthKit/Health Connect.

## 3. AI features (optional)
If you switch on "AI tips & summaries" (Privacy & Data), we send our AI provider [OpenAI, L.L.C., USA] only the fields needed for the feature you
use — for example medicine names, condition names, routine statistics or the wording of your own symptom notes when you ask for an appointment
summary. We never send your name, email, phone, exact date of birth or account id. AI output is checked by our software and never contains
doses beyond your prescription; safety warnings are produced by fixed rules, not AI. [Confirm with OpenAI: API data is not used for training and
retention terms — link the provider's current policy here.] You can switch AI off at any time; this stops new processing.

## 4. Who we share data with (service providers)
We only share what each provider needs, under contract, to run 3TABZ:

| Provider | Purpose | Location |
|---|---|---|
| Amazon Web Services | hosting the API, database backups, secrets | USA (us-east-1) [confirm] |
| [MongoDB Atlas / database host] | database | [region] |
| [Redis host] | queues, rate limits, short-lived cache | [region] |
| Expo (650 Industries) → Apple Push Notification service / Google Firebase Cloud Messaging | delivering push notifications (message text + push token) | USA |
| Apple, Google | in-app purchases and subscription status | USA / global |
| [Email provider] | verification codes, password resets, exports, care-partner invites | [region] |
| OpenAI (only if you enable AI) | AI tips and summaries | USA |
| US FDA openFDA (public API) | we look up official label text by **medicine name only** (no personal data) | USA |
| OpenStreetMap Overpass (from your device) | pharmacy search with approximate location | Germany |

We may disclose data if required by Nigerian law or a court order, or to protect someone's life in an emergency. Care partners see only what you
allow. A doctor you share a report link with sees that report only while the link is valid.

## 5. International transfers
Our servers are currently outside Nigeria (see table). Under NDPA s.41–43 we transfer data only where the recipient gives adequate protection or
another lawful basis applies. [Lawyer to confirm basis: standard contractual safeguards with each provider and/or your informed consent at sign-up.
Consider moving storage to a region the NDPC considers adequate.]

## 6. How long we keep data
See the Data Retention Schedule (`https://3tabz.com/privacy#retention`). In short: your health data is kept while your account is active.
When you delete your account it is removed after a **30-day** grace period (sign in during that time to cancel). Backups are overwritten within
[BACKUP WINDOW, e.g. 35] days. Apple and Google keep their own purchase records under their policies. [Lawyer: confirm no per-user tax record retention is required.]

## 7. Your rights (NDPA s.34–38)
You can: access your data and get a copy (Export my data — a one-time download link valid 72 hours); correct it in the app; delete your account
(Delete my account) or individual entries; withdraw consent at any time (as easily as you gave it, s.35) — e.g. turn off AI or care-partner sharing;
object to processing; not be subject to solely automated decisions with significant effects (3TABZ makes none); and complain to the
**Nigeria Data Protection Commission** (ndpc.gov.ng). UK/EU users also have equivalent rights under UK/EU GDPR and may complain to the ICO or their
local authority. Email dpo@3tabz.com — we reply within [30] days.

## 8. Security
HTTPS for all traffic; passwords hashed with bcrypt; free-text health notes encrypted field-by-field (AES-256-GCM) on top of storage encryption;
sign-in tokens stored in your phone's secure keychain; admin access needs two-factor sign-in and every admin action is logged; optional app lock and
discreet notifications. No system is perfectly secure. If a breach is likely to risk your rights we will notify the NDPC within **72 hours** (s.40) and
tell you without undue delay where the risk is high.

## 9. Children
3TABZ accounts are for adults (18+). Parents/guardians may record information about their children as dependants; they are responsible for having
the authority to do so. We do not knowingly create accounts for children. Contact us if you think a child has an account.

## 10. Notifications on shared phones
Reminders may show medicine names on your lock screen. Turn on **Discreet reminders** to hide them.

## 11. Changes
We will notify you in the app before material changes take effect and record the policy version you accepted.

## 12. Contact
3tabz, [REGISTERED ADDRESS] · privacy@3tabz.com · DPO: dpo@3tabz.com

---
*References: Nigeria Data Protection Act 2023 s.25, s.30, s.31, s.34–38, s.39–43, s.65 ([text](https://assets.kpmg.com/content/dam/kpmg/ng/pdf/nigeria-data-protection-act2023.pdf)); NDPC GAID 2025 ([PDF](https://ndpc.gov.ng/wp-content/uploads/2025/07/NDP-ACT-GAID-2025-MARCH-20TH.pdf)); Apple Guideline 5.1.3 ([Apple](https://developer.apple.com/app-store/review/guidelines/)); Google Play account-deletion requirements ([Google](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en-GB)).*
