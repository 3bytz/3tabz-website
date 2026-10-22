# 3TABZ — Store Submission Pack (Apple App Store + Google Play, first submission)

Prepared 16 Oct 2026 for app version 1.0.0. Bundle / package id: `com.threetabz.com`.
Fields marked **[YOU]** need information only you have (RC number, address, D-U-N-S, demo account).

---

## 0. Before you start (blocking items)

| # | Item | Why |
|---|---|---|
| 1 | Enrol **both** store accounts as an **organisation** (3tabz, CAC RC [YOU]) with a D-U-N-S number | Apple 5.1.1(ix): apps in highly regulated fields such as healthcare "should be submitted by a legal entity that provides the services, and not by an individual developer". Google: the 12-tester / 14-day closed test is required only for **personal** accounts created after 13 Nov 2023 |
| 2 | Publish the website pages in `/website` (privacy, terms, medical disclaimer, subscription terms, delete account, reset password) | URLs are required in both consoles and are linked from the paywall and sign-up |
| 3 | Create IAP products (§3) and enrol in Apple's **Small Business Program** | 15% commission |
| 4 | Server secrets set: `APPLE_APP_APPLE_ID`, App Store Server API key (.p8), Google service account + RTDN topic | purchases can't be verified otherwise |
| 5 | Create a review demo account with sample data (§5) | both stores test sign-in |
| 6 | Have a Nigerian data-protection lawyer review `/docs/legal` and register with the NDPC if you are a data controller of major importance | NDPA 2023 / GAID 2025 |

## 1. Listing copy

**App name (30):** `3TABZ: Medicine Reminder`
**Subtitle (iOS, 30):** `Doses, refills & health diary`
**Short description (Play, 80):** `Medicine reminders that work offline, plus refill alerts and a health diary.`

**Promotional text (iOS, 170):**
`Reminders now work even without data. New: daily check-in, symptom journal with warning-sign checks, care partners and a Nigerian meal planner.`

**Keywords (iOS, 100):** `pill,reminder,medication,tracker,hypertension,diabetes,sickle cell,refill,blood pressure,dose,health`

**Description (both stores):**
```
3TABZ helps you take the right medicine at the right time — even when your phone has no data.

REMINDERS THAT ARRIVE
• Dose reminders are set on your phone, so they work offline.
• Tap "I took it", "Snooze" or "Skip" right from the notification.
• A gentle follow-up if a dose isn't logged.
• Reminder check: fixes battery and alarm settings on Tecno, Infinix, itel, Samsung, Xiaomi and more.
• Discreet mode hides medicine names on the lock screen.

STAY ON TOP OF YOUR TREATMENT
• Refill and low-stock alerts, pharmacy finder.
• Medicine information from official drug labels, food rules and a check for well-known interactions and duplicate ingredients (e.g. two products containing paracetamol).
• Daily check-in and simple patterns from your own logs.
• Symptom journal that checks for warning signs and helps you prepare questions for your doctor.
• Doctor report (PDF) and a secure, passcode-protected link to share it.

FAMILY AND CARERS
• Care partners: let someone you trust get missed-dose or crisis alerts — you choose what they see.
• Caregiver mode for children and dependants (Pro).

YOUR DATA, YOUR CHOICE
• Export or delete your data from the app at any time.
• AI-written tips are optional and off unless you turn them on.
• We never sell your data and there are no ads.

3TABZ PRO (optional subscription)
Full history and trends, all your patterns, appointment summaries, meal planner costs and unlimited re-plans, and caregiver mode. Reminders and safety features are always free.

IMPORTANT
3TABZ does not diagnose, treat or give medical advice, and it is not a substitute for a doctor or pharmacist. Never change a dose without your prescriber. In an emergency in Nigeria call 112 or 199.
```

**Category:** iOS primary **Medical**, secondary **Health & Fitness**. Play: **Medical**.
**Support URL:** `https://3tabz.com/support` · **Marketing URL:** `https://3tabz.com` · **Privacy:** `https://3tabz.com/privacy`
**Copyright:** `© 2026 3tabz` · **Contact email:** support@3tabz.com

## 2. Screenshots (create from a release build with demo data)
Required sizes: iPhone 6.9" (1320×2868) and 6.5"; Play phone 1080×1920+; Play feature graphic 1024×500 (`assets/images/featuredGraphics.png` exists — check text is legible).
1. Today screen with next dose + quick actions · 2. Lock-screen reminder with "I took it" (discreet off) · 3. Reminder check screen (Tecno guidance) · 4. Interaction checker result · 5. Symptom journal red-flag card (use a demo entry) · 6. Care partners · 7. Meal planner timetable · 8. Paywall (must match the in-app paywall exactly).
Do not show real patient data, fake reviews, or claims such as "doctor-approved".

## 3. In-app purchases
| Reference name | Product ID | Type | Group | Duration | Intro offer |
|---|---|---|---|---|---|
| 3TABZ Pro Monthly | `com.threetabz.com.pro.monthly` | Auto-renewable | 3TABZ Pro | 1 month | none |
| 3TABZ Pro Yearly | `com.threetabz.com.pro.yearly` | Auto-renewable | 3TABZ Pro | 1 year | 7-day free trial (optional) |

Play: create two subscriptions with the same ids, one base plan each (auto-renewing, plain base plan without offer tags — the app picks the offer without an `offerId`). Prices: see PHASE2_MARKET_RESEARCH.md §4.2 (₦1,500 / ₦12,000; £2.99 / £24.99; $3.99 / $29.99).
The server allow-list also contains `.family.monthly/.family.yearly` for later; **don't create them now**.
Apple: App Store Server Notifications V2 URL `https://api.3tabz.com/v1/subscription/apple` (production and sandbox).
Google: RTDN Pub/Sub push endpoint `https://api.3tabz.com/v1/subscription/google-rtdn` with OIDC auth; set `GOOGLE_RTDN_AUDIENCE` to that URL.
Subscription display name/description (both): "3TABZ Pro — Full history, all patterns, appointment summaries, meal-plan costs and caregiver mode."

## 4. Privacy declarations

### 4.1 Apple App Privacy ("nutrition label")
Tracking: **No** (no ad SDKs, no data brokers, no cross-app tracking).

| Data type | Collected | Linked to user | Purposes |
|---|---|---|---|
| Health (medicines, logs, symptoms, readings, check-ins) | Yes | Yes | App Functionality |
| Name, Email address | Yes | Yes | App Functionality, Account management (App Functionality) |
| User ID | Yes | Yes | App Functionality |
| Device ID (push token) | Yes | Yes | App Functionality |
| Purchase history | Yes | Yes | App Functionality |
| Product interaction (which notifications are opened) | Yes | Yes | Analytics, App Functionality |
| Coarse location (pharmacy search, sent to OpenStreetMap Overpass, not stored) | Yes | No | App Functionality |
| Other user content (free-text notes) | Yes | Yes | App Functionality |
Not collected: contacts, photos (camera is used only to read barcodes on-device), browsing history, financial info, precise location, crash data (no crash SDK in this release).

### 4.2 Google Play Data safety
- Data collected: Personal info (name, email, user IDs) · Health and fitness (health info) · App activity (app interactions, other user-generated content) · App info and performance (none) · Device or other IDs (push token) · Financial info (purchase history) · Location (approximate — processed ephemerally for pharmacy search).
- Shared with third parties: **No** for sale/advertising. Service providers (hosting, email, push, optional AI) are processing on our behalf — not "sharing" under Play's definition. Location goes from the device directly to OpenStreetMap Overpass at the user's request.
- Encrypted in transit: **Yes**. Users can request deletion: **Yes** (in-app + `https://3tabz.com/delete-account`).
- Account deletion URL field: `https://3tabz.com/delete-account` (Google requires a web resource that works without reinstalling the app).

### 4.3 Play Health apps declaration (required for every app)
Declare: **Medication & treatment management** (reminders, logging, refill), **Symptom tracking / health diary**, **Nutrition** (meal planner). Not a medical device; no clinical decision support; no Health Connect integration in v1.

### 4.4 Permissions justification (Play / review notes)
| Permission | Why |
|---|---|
| POST_NOTIFICATIONS | dose reminders |
| SCHEDULE_EXACT_ALARM | on-time dose reminders; user grants it in "Alarms & reminders"; the app works (less precisely) without it. Not using USE_EXACT_ALARM (reserved for alarm-clock/calendar apps) |
| RECEIVE_BOOT_COMPLETED | restore scheduled reminders after restart |
| CAMERA | scan the barcode on a medicine pack (on device) |
| ACCESS_COARSE_LOCATION | find nearby pharmacies, only while the screen is open |
| USE_BIOMETRIC | optional app lock |
| BILLING | Pro subscription |
Removed in this release: background location, fine location, foreground location service, microphone.

## 5. App Review information (paste into App Store Connect "Notes" and Play "App access")
```
Demo account: [YOU: reviewer@3tabz.com / password]  (email already verified, sample medicines and logs loaded)

What 3TABZ is: a medication reminder and health diary for adults with long-term conditions (Nigeria first).
What it is NOT: no telemedicine, no clinician chat, no diagnosis, no treatment or dosing advice. The app
always tells users to follow their prescriber/pharmacist and shows emergency numbers (Nigeria 112/199).

Safety: the Symptom Journal runs a deterministic red-flag rule set (not AI) and shows emergency guidance;
AI-written tips are optional (off by default, consent screen in Profile > Privacy & Data) and never include doses.
Medicine information comes from official US FDA label text (openFDA) and a curated interaction list.

Reminders are scheduled locally with the OS (expo-notifications). Try: add a medicine 2 minutes ahead,
lock the device, then use "I took it" on the notification.

Subscriptions: 3TABZ Pro (monthly/yearly) via In-App Purchase only. Paywall: Profile > See Pro plans.
Restore purchases is on the paywall. Reminders and safety features are free.

Account deletion: Profile > Privacy & Data > Delete my account (in-app). Data export is next to it.
Sign in with Apple is not offered because the app has no third-party/social login (email + password only).
```

## 6. Age rating
Apple (new questionnaire; must be completed — updates were blocked after 31 Jan 2026 without it): answer
**Medical or wellness topics: Yes (informational, frequent)**; all violence/sexual/gambling/UGC: **None**; no unrestricted web access
(the only web view shows the user's own PDF). Apple assigns the resulting tier. Accounts are adults-only (18+ confirmation at sign-up;
children are managed by a parent as dependants).
Play (IARC): Medical/health information present; no user interaction features (care partners are private, invite-only); no location sharing with other users.

## 7. Export compliance
`ITSAppUsesNonExemptEncryption = false` is set (the app uses only HTTPS/OS cryptography, which is exempt).

## 8. Submission order
1. Server + website live → 2. EAS `production` build (`eas build -p all --profile production`) → 3. TestFlight internal + Play internal test → 4. Play closed test (only if your Play account is **personal** — 12 testers × 14 days) → 5. Submit both with the notes above → 6. Phased release (iOS 7-day phased, Play staged 10%→50%→100%).

## Sources
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (1.4.1, 3.1.1, 3.1.2, 5.1.1(v), 5.1.1(ix), 5.1.3)
- [9to5Mac — new App Store age ratings and 31 Jan 2026 deadline](https://9to5mac.com/2025/07/24/apple-notifies-developers-of-new-app-store-age-rating-system/)
- [Google Play — testing requirements for new personal accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en-GB)
- [Google Play — account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en-GB)
- [Google Play — Health apps declaration](https://support.google.com/googleplay/android-developer/answer/14738291)
- [Google Play — target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en-419)
- [Android 14 — exact alarms denied by default](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms?hl=en)
- [Google Play service fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en)

---

# Addendum, 22 Oct 2026 (version 1.1.0): read this before submitting

## A. What changed that affects review

| Change | Where it shows up in the consoles |
|---|---|
| In-app purchases now go through **RevenueCat** (`react-native-purchases`). Same product IDs, same prices, same Restore button | Nothing new to declare to Apple. In Play Data safety, "Purchase history" is collected and shared with a service provider (RevenueCat) for app functionality |
| **Web subscriptions** (Stripe, Paystack) on 3tabz.com. The app never links to them outside storefronts you enable in the dashboard | Apple 3.1.3(b) multiplatform: the same subscription is sold as an in-app purchase, so unlocking a web purchase on sign-in is allowed. Leave the dashboard storefront list empty for the first submission |
| New app icon, splash and screenshots (sage design) | Upload the new 1024 px icon from `assets/images/icon.png` (no transparency, no rounded corners) and new screenshots |
| `UIBackgroundModes` contains `remote-notification`, `fetch` and `processing` | These come from `expo-notifications` and `expo-background-task`. Justification for review notes: "Background refresh keeps the next 72 hours of on-device medicine reminders scheduled when the user has not opened the app. No location is used." |
| Optional intro video (if you add one) | Plays after the static launch screen, once, with Skip. Nothing to declare |

## B. Listing copy (international)

**App name (30):** `3TABZ: Medicine Reminder`
**Subtitle (iOS, 30):** `Pill reminders, refills & care`
**Short description (Play, 80):** `Medicine reminders that work offline, refill alerts, family care circle, reports.`

**Promotional text (iOS, 170):**
`A calmer way to stay on track: reminders that work without signal, refills before you run out, a care circle for family, and a one-page report for your doctor.`

**Keywords (iOS, 100):** `pill reminder,medication,tracker,refill,blood pressure,diabetes,caregiver,dose,health diary,adhd`

**Description (both stores):**
```
3TABZ helps you take the right medicine at the right time, even when your phone has no signal.

REMINDERS YOU CAN COUNT ON
• Reminders are scheduled on your phone, so they still go off on a plane or with no data.
• Tap "I took it", "Snooze" or "Skip" right from the notification.
• A gentle follow-up if a dose goes unlogged.
• Reminder check: spots battery and alarm settings that silence reminders, with step-by-step fixes for your phone.
• Discreet mode hides medicine names on the lock screen.

SEE YOUR MEDICINES AT A GLANCE
• Pick the shape and colour of each pill so you, and anyone helping you, recognise it instantly.
• Today screen with your next dose, what's waiting, and a one-tap "I took it".
• Quick actions on the edge of the screen and a searchable list of every tool.

STAY AHEAD OF REFILLS AND SYMPTOMS
• Pill counts, refill reminders and a pharmacy finder.
• Medicine information from official drug labels, food rules, and checks for well-known interactions and duplicate ingredients.
• 10-second daily check-in, symptom journal with warning-sign checks, vitals and temperature.

FAMILY AND CARERS
• Care circle: someone you trust can get a missed-dose alert, only with your consent and only after the delay you choose.
• Manage medicines for children, parents or anyone you care for (Pro).

READY FOR YOUR APPOINTMENT
• A one-page PDF of doses, vitals and symptoms, or a secure link with a passcode that expires.

YOUR DATA, YOUR CHOICE
• No ads. We never sell your data.
• Export or delete everything from inside the app.

3TABZ PRO (optional subscription)
Full history and trends, patterns across sleep, food, mood and doses, appointment summaries, unlimited meal plans with cost estimates, and caregiver mode. Reminders, logging and safety features are always free.

IMPORTANT
3TABZ is a reminder and self-management tool. It is not a medical device and does not diagnose, treat or give dosing advice. Always follow your clinician's instructions. In an emergency, call your local emergency number.
```

**Release notes (1.1.0):**
```
A fresh, calmer design, realistic pill pictures you can match to your own medicines, quick actions on the edge of the screen, a searchable tools page, meal plans in your local currency, and faster, more reliable syncing.
```

## C. Screenshots (6.9" iPhone 1320 x 2868, and Android phone 1080 x 1920 or larger)

1. Today: next dose card with "I took it" (headline: "Never wonder if you took it")
2. Medicines list with pill pictures ("Every pill, at a glance")
3. Quick actions fanned out from the edge ("Everything one swipe away")
4. Care circle screen ("Family who know, only if you say so")
5. Doctor report or share link ("A summary your doctor can read in a minute")
6. Reminder check ("Reminders that survive battery savers")
7. Meal planner ("Meals timed around your doses")
8. Paywall with prices shown by the store (optional; must match the live product)

Use a fictional demo account (for example "Sarah Miller") and invented medicines only. Do not show real patient data.

## D. Review notes to paste (Apple and Google)

```
3TABZ is a medicine reminder and self-management app. It does not diagnose, treat or give dosing advice; red-flag symptoms in the journal and check-in show the local emergency number.

Demo account: [demo email] / [password]. The account has sample medicines, logs and a care partner.

Purchases: 3TABZ Pro is sold as an auto-renewing in-app subscription (monthly and yearly). Prices and trial terms come from the store. Restore Purchases is on the paywall and in Profile. A subscription can also be bought on our website; such purchases unlock Pro when the person signs in with the same account. The app does not link to or mention web purchasing in your storefront.

Background modes: remote notifications for reminder backups; background fetch/processing to keep the next 72 hours of on-device reminders scheduled. No location is used in the background.

Account deletion: Profile → Privacy & data → Delete account, or https://3tabz.com/delete-account.
```

## E. App Privacy / Data safety additions

| Data type | Purpose | Shared with | Notes |
|---|---|---|---|
| Purchase history | App functionality (unlocking Pro) | RevenueCat (in-app), Stripe or Paystack (web) as processors | Not used for tracking or advertising |
| User ID | App functionality | RevenueCat (as the app user ID) | Our internal account ID, no email sent to RevenueCat |
| Email address (web checkout only) | Account management, receipts | Stripe or Paystack as processors | Only when the person pays on the website |
