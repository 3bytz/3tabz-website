# Web subscriptions and RevenueCat: setup guide

Last updated 22 Oct 2026. This covers the three ways a person can become Pro, how each one reaches the app, and exactly what you must configure.

## How it fits together

| Where the person pays | Who verifies it | How Pro unlocks in the app |
|---|---|---|
| Inside the iOS app (App Store) | RevenueCat, then our server re-checks RevenueCat's REST API | Immediately after purchase (`POST /v1/billing/revenuecat/sync`), and by webhook for renewals, refunds and expiry |
| Inside the Android app (Google Play) | Same as above | Same as above |
| On 3tabz.com/subscribe (Stripe or Paystack) | Our server, from the provider's signed webhook | The next time the app opens or comes to the foreground; the subscription query refetches on focus |

The server is the only place that decides Pro. Every source writes a row in the `subscriptions` collection and `recomputeEntitlement()` sets `subscriptionTier` and `proExpiresAt` on the user. A person can have more than one source; the latest end date wins.

## Store policy, in one paragraph

Both stores let an app unlock a subscription that was bought elsewhere, as long as the same subscription is also sold through in-app purchase (Apple guideline 3.1.3(b); Google Play payments policy). The app therefore never mentions the website by default. A link to web checkout can be switched on per storefront from the dashboard (Settings, then "Web checkout link in the app") only where the rules allow it: today that is the Apple US storefront (`ios:USA`), and Google Play US only after enrolling in Google's external content links program (`android:USA`). EU storefronts need Apple's External Purchase Link entitlement and Google's billing choice program first. Leave the field empty if in doubt. See `GROWTH_AND_MARKET_RESEARCH.md` section 6 for sources and fees.

Wording rule for the app, store listing and marketing aimed at app users outside allowed storefronts: never say "subscribe on our website" or "cheaper on the web". The website itself can sell freely.

## 1. RevenueCat (in-app purchases on both stores)

1. Create a RevenueCat project with an iOS app (bundle `com.threetabz.com`) and an Android app (package `com.threetabz.com`). Connect App Store Connect (in-app purchase key) and Google Play (service account with "View financial data" and "Manage orders").
2. Products: create in App Store Connect and Play Console, then import into RevenueCat:
   - `com.threetabz.com.pro.monthly`, `com.threetabz.com.pro.yearly`
   - `com.threetabz.com.family.yearly` (optional, Care Circle)
3. Entitlements: create `pro` (attach all Pro products) and `family` (attach family products). The server reads both (`REVENUECAT_ENTITLEMENTS=pro,family`).
4. Offerings: one `default` offering with packages `$rc_monthly` and `$rc_annual` (the app reads `MONTHLY` and `ANNUAL` package types).
5. Project settings, then Restore behaviour: choose **Transfer if there are no active subscriptions** (recommended) or **Keep with original App User ID** if you want to stop one store account unlocking several 3TABZ accounts.
6. App user ID: the app calls `Purchases.logIn(<3TABZ user id>)` after sign-in and `logOut()` on sign-out. Never use anonymous IDs for purchases.
7. Webhook: Integrations, then Webhooks, URL `https://api.3tabz.com/v1/billing/webhooks/revenuecat`, Authorization header value = a long random string. Put the same value in `REVENUECAT_WEBHOOK_AUTH`.
8. Secret API key (v1, starts `sk_`): put in `REVENUECAT_SECRET_API_KEY`. Public SDK keys (start `appl_` and `goog_`) go in the app as `EXPO_PUBLIC_RC_IOS_KEY` and `EXPO_PUBLIC_RC_ANDROID_KEY` (they are designed to be public).
9. App Store Server Notifications V2 and Google RTDN should now point at RevenueCat (RevenueCat shows the URLs). The old direct endpoints (`/v1/webhooks/apple`, `/v1/webhooks/google-rtdn`) still work for any purchase verified before the switch; set `IAP_PROVIDER=revenuecat`.

## 2. Stripe (web, international cards)

1. Products, then create "3TABZ Pro" with two recurring prices (monthly and yearly) and "3TABZ Care Circle" with a yearly price. Add `currency_options` for GBP, EUR, CAD and AUD on each price so Checkout charges in local currency.
2. Copy the price IDs into `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`, `STRIPE_PRICE_FAMILY_YEARLY`.
3. Settings, then Customer portal: allow cancel, switch plan, update payment method; return URL `https://3tabz.com/account`.
4. Webhooks, then add endpoint `https://api.3tabz.com/v1/billing/webhooks/stripe` with events:
   `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`.
   Copy the signing secret (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`.
5. Turn on Stripe Tax if you need VAT/GST collection in the UK, EU or Australia (talk to your accountant).

## 3. Paystack (web, local cards, bank transfer, USSD)

1. Plans: create "Pro Monthly" (monthly), "Pro Yearly" (annually) and "Care Circle Yearly" (annually) in NGN. Copy plan codes (`PLN_...`) to `PAYSTACK_PLAN_PRO_MONTHLY`, `PAYSTACK_PLAN_PRO_YEARLY`, `PAYSTACK_PLAN_FAMILY_YEARLY`.
2. Settings, then API keys and webhooks: webhook URL `https://api.3tabz.com/v1/billing/webhooks/paystack`. Paystack signs with your secret key, so `PAYSTACK_SECRET_KEY` is used for both API calls and signature checks.
3. `PAYSTACK_COUNTRIES` (default `NG`) controls where the local payment option is offered on the website. People in those countries also see the Stripe card option.
4. Refunds: Paystack refunds do not end the subscription automatically. Disable the subscription in Paystack, then (if you want immediate removal) revoke it from the dashboard's Subscriptions page.

## 4. Server environment variables

```
IAP_PROVIDER=revenuecat
REVENUECAT_SECRET_API_KEY=sk_...
REVENUECAT_WEBHOOK_AUTH=<random 48+ chars>
REVENUECAT_ENTITLEMENTS=pro,family

WEB_BILLING_ENABLED=true
WEB_CHECKOUT_STOREFRONTS=            # leave empty; use the dashboard instead
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_FAMILY_YEARLY=price_...
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_COUNTRIES=NG
PAYSTACK_PLAN_PRO_MONTHLY=PLN_...
PAYSTACK_PLAN_PRO_YEARLY=PLN_...
PAYSTACK_PLAN_FAMILY_YEARLY=PLN_...
PUBLIC_WEB_URL=https://3tabz.com
CORS_ORIGINS=https://3tabz.com,https://www.3tabz.com
```

Secrets go into AWS Secrets Manager (`scripts/sync-secrets.sh`); both task definitions already reference them.

## 5. The web sign-in, step by step

1. The person types the email they use in the app. `POST /v1/billing/web/start` always answers `{sent:true}` (no account enumeration) and emails a 6-digit code only if the account exists. Limits: 5 codes per email per hour, 20 per IP per hour.
2. `POST /v1/billing/web/verify` checks the code (5 attempts, 10-minute expiry, one use) and returns a 30-minute token signed with a key derived from `JWT_ACCESS_SECRET` plus a fixed label. That token is useless against the normal API, and normal app tokens are useless here.
3. `POST /v1/billing/web/session` returns the masked email, current plan, the payment options for the person's region and the live prices (read from Stripe and Paystack, cached for one hour).
4. `POST /v1/billing/web/checkout` refuses if the person already has an active store or web plan, then returns a Stripe Checkout or Paystack authorisation URL.
5. The provider webhook writes the subscription. The person gets a "Pro is active" email with a link to `/account`.

## 6. Test plan before launch

| # | Test | Expected |
|---|---|---|
| 1 | iOS sandbox purchase (TestFlight) | Paywall shows store prices; after purchase, Profile shows Pro within seconds; RevenueCat customer shows the 3TABZ user ID |
| 2 | Android licence-tester purchase | Same |
| 3 | Restore on a second device signed in to the same 3TABZ account | Pro restored |
| 4 | Restore on a different 3TABZ account with the same store account | Follows your RevenueCat restore setting |
| 5 | Stripe test card `4242 4242 4242 4242` on /subscribe | Webhook 200; app shows Pro after foregrounding; Profile says "billed through your 3TABZ web account" |
| 6 | Stripe card `4000 0000 0000 0341` (fails on renewal) then advance the test clock | Status becomes grace period, then expired; Pro removed after grace |
| 7 | Paystack test card | Subscription row with `platform: paystack`; manage link opens Paystack page |
| 8 | Replay a webhook from the Stripe dashboard | Second delivery returns `duplicate: true`, no double processing |
| 9 | Send a forged webhook with a wrong signature | 400 |
| 10 | App on a non-US storefront | No "Other ways to pay" link anywhere |
| 11 | Add `ios:USA` in the dashboard, App Store US sandbox account | Paywall shows "Other ways to pay" under the store button |

## Behaviour worth knowing

- **Refunds:** a Stripe refund cancels the subscription and removes Pro straight away. A RevenueCat refund does the same on the next sync or webhook.
- **Failed renewals:** Stripe `past_due` keeps Pro for 7 days from the start of the unpaid period; Paystack "attention" keeps it 5 days past the due date. Active web plans get a 1–2 day buffer so a slightly late renewal webhook never locks anyone out.
- **Paystack retries:** if a Paystack event arrives before the account link is known, the server answers 503 and Paystack retries it later. The customer code is saved on the user once the first payment arrives.
- **One account per subscription:** a store or web subscription already linked to one 3TABZ account cannot be claimed by another (409).
