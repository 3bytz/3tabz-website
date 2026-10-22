# 3TABZ — Consent screens (as implemented in app v1.0.0)

Consent version string: `2026-10-16` (`CONSENT_VERSION` in `src/types/index.ts`). Bump it whenever the wording below changes;
the server stores key + granted + version + timestamp for each change (`PATCH /auth/consents`).
Nothing is pre-ticked. Withdrawal is in Profile → Privacy & Data and is as easy as granting (NDPA s.35(2)).

## 1. Sign-up (register screen) — four separate switches
| Key | Required | Wording |
|---|---|---|
| age (`ageConfirmedAdult`) | yes | "I am 18 or older." |
| terms | yes | "I agree to the Terms of Use and have read the Privacy Policy and Medical Disclaimer." (links shown) |
| `healthDataProcessing` | yes | "I consent to 3TABZ storing the health information I enter (medicines, symptoms, readings) to provide the app. I can withdraw this and delete my account at any time." |
| `aiProcessing` | optional | "Optional: allow AI-written tips and summaries. Only de-identified details are sent to our AI provider. You can change this later." |
Consents are recorded right after the email code is verified (the account doesn't exist before that).

## 2. Privacy & Data → "Your choices"
| Key | Wording |
|---|---|
| `aiProcessing` | "AI tips & summaries — Sends de-identified details (no name, email or exact dates of birth) to our AI provider. Off = no AI features." |
| `caregiverSharing` | "Care-partner sharing — Allows alerts/summaries to people you invite. Off stops all sharing." |
| `productEmails` | "Product news by email — Occasional updates. Safety and account emails are always sent." |
Health-data consent cannot be "switched off" while keeping an account (the app can't work without it): the screen explains that withdrawing it means deleting the account.

## 3. Just-in-time permission prompts (OS dialogs)
| Permission | When asked | iOS purpose string |
|---|---|---|
| Notifications | after sign-in (not on first launch) | system default |
| Camera | when opening the barcode scanner | "3TABZ uses the camera only to scan the barcode on your medicine pack." |
| Location (when in use) | when opening Find pharmacy | "3TABZ uses your location only while you search for nearby pharmacies. It is not stored." |
| Face ID | when turning on App lock | "Allow 3TABZ to use Face ID to lock the app and protect your health information." |
| Alarms & reminders (Android 12+) | from Reminder check screen | system settings page |

## 4. Care-partner invite (patient side)
Shown before sending: the four permission switches (missed-dose alerts, crisis alerts, weekly summary, medicine list) with descriptions, and the delay
before a missed-dose alert. The partner must enter the invite code to connect. "Stop sharing" is available at any time.
