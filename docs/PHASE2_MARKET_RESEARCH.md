# 3TABZ — Phase 2: Market & Community Research, Pain → Feature Map, Pricing

Prepared 16 Oct 2026. Every number below has a source link. Where a source is old or indirect, it says so.
Nothing here is a clinical claim about 3TABZ itself — 3TABZ has no outcome data yet.

---

## 1. The opportunity in numbers (Nigeria first)

| Fact | Figure | Source (date) |
|---|---|---|
| Adults with hypertension | **30.6%** crude prevalence; about **27.5 million** people aged ≥20 in 2020 (up from ~4.3 m in 1995) | Adeloye et al., *J Clin Hypertens* 2021 ([UCLan repository](https://knowledge.lancashire.ac.uk/id/eprint/36955/)) |
| Adults (20–79) with diabetes | **~3.0 million**; prevalence 2.8% (age-standardised 3.0%) | IDF Diabetes Atlas 11th ed., 2024 ([country table via Medbox](https://medbox.org/index.php/dl/6878e8f2be6e2c6db864eb12); [IDF Nigeria page](https://diabetesatlas.org/data-by-location/country/nigeria/)) |
| Babies born with sickle cell disease | **at least 150,000 a year** (of ~7 m births) — WHO estimate, no national newborn screening | [Africa Check, quoting WHO](https://africacheck.org/reports/weighing-nigerias-sickle-cell-burden-is-it-the-worlds-highest/) |
| Who pays for care | **~76%** of health spending is out-of-pocket (2022) | [Dataphyte, citing World Bank/WHO](https://dataphyte.com/issue/pocket-science/2025/03/burden-billing-and-budget-in-nigerias-healthcare-sector) |
| Internet access | **157.4 m** internet subscriptions; broadband penetration **56.11%** (May 2026) | NCC data via [THISDAY, 27 Aug 2026](https://www.thisdaylive.com/2026/08/27/internet-subscribers-hit-157-4m-as-broadband-penetration-increases-to-56-11/) |
| Phones people use | Tecno 23.6%, Infinix 21.7%, itel 5.4% (Transsion ≈ 50.7%), Samsung 12.4%, **Apple 9.4%** (Feb 2025) | Statcounter via [Intelpoint](https://intelpoint.co/insights/tecno-has-the-highest-share-among-phone-brands-in-nigeria-at-23-55-as-of-february-2025/) |
| Exchange rate used in this doc | **₦1,332/US$** official (13 Oct 2026); parallel ₦1,365–1,375 | [TechEconomy, 14 Oct 2026](https://techeconomy.ng/dollar-to-naira-exchange-rate-today-october-14-2026) |

**What this means:** the core user is an adult with hypertension, diabetes or sickle cell (or a carer), on a
low- to mid-range **Android phone from Transsion**, paying for medicines from their own pocket, with mobile data
that is common but not always on. iPhone users are a minority (~9%) but over-index among diaspora and urban professionals.

## 2. What goes wrong today (pain points, with evidence)

| Pain | Evidence |
|---|---|
| **Forgetting doses** is the #1 reason for non-adherence | Sokoto study (605 hypertensive outpatients): only **8.9%** adherent; forgetfulness was the most cited reason (35.2% of mentions), then missed doses 32.2%, side effects 13.7%, cost 8.3% ([BMC Cardiovasc Disord 2018](https://link.springer.com/article/10.1186/s12872-018-0934-x)) |
| **Cost** forces rationing and skipped doses | Patients and a nurse describe skipping or rationing medicines as prices rise ([AllAfrica/Vanguard, 2024](https://allafrica.com/stories/202406180099.html)) |
| **Fake / substandard medicines** | NAFDAC's DG put the prevalence of substandard and falsified medicines at **17%** (statement c. 2019–2020) ([BusinessDay](https://clone.businessday.ng/?p=391905)) — older figure, used only to justify "check NAFDAC number" nudges |
| **Reminders that don't arrive** on Tecno/Infinix | HiOS "actively manages background app activity to save battery"; apps must be whitelisted in Phone Master / auto-start ([Singularity app wiki](https://singularity-app.com/wiki/tecno-notifications/)) |
| **Data costs / patchy signal** | Broadband penetration is ~56% — nearly half the population is not on broadband (NCC, above) |
| **Reminders help — modestly** | Two-way text interventions in Africa improved medicine adherence, RR **1.14** (95% CI 1.07–1.21; 6 RCTs, 2,783 participants) ([PLoS ONE 2022 meta-analysis](https://ideas.repec.org/a/plo/pone00/0266717.html)) — so 3TABZ should be honest: reminders help some people, not miracles |
| **Paid competitors are pricing people out** | Medisafe became fully paid outside the US on 1 Jan 2026: **$4.99/month or $39.99/year** ([Medisafe help centre](https://help-center.medisafe.com/en/articles/13052285-medisafe-is-now-a-fully-paid-app-for-users-outside-the-u-s)) ≈ ₦6,650/month at the official rate |

Community listening: I could not find a citable Nigerian forum thread worth quoting (Nairaland search returned nothing
relevant), so **no community quotes are included** rather than inventing them. Recommended next step: 10 short
WhatsApp/phone interviews with patients from sickle-cell and diabetes support groups before launch.

## 3. Pain → feature map (what was built in this release)

| Pain | Feature in this release | Free or Pro |
|---|---|---|
| Forgetting doses | On-device reminders (72-h rolling window, work offline), "I took it / Snooze / Skip" on the lock screen, 30-min follow-up, server "did you take it?" backup | **Free** |
| Reminders killed by Tecno/Infinix/Xiaomi | Reminder reliability check: exact-alarm access, battery optimisation, brand-specific steps, test reminder | Free |
| Shared phones / stigma | Discreet reminders (no medicine names), app lock, privacy cover | Free |
| Patchy data | Offline-first dose logging + check-ins with automatic sync; sign-in survives offline refresh failures | Free |
| Danger signs missed | Deterministic red-flag engine with Nigeria 112/199 and crisis line; "Get help now" works offline | Free |
| Dangerous combinations / duplicate paracetamol | Curated interaction & duplicate-ingredient checker; official label text from openFDA | Free |
| "What do I tell the doctor?" | Symptom journal + questions for clinician; doctor PDF; passcode-protected share link | Journal free; AI appointment summary Pro |
| Family support | Care partners (consent, per-permission, revocable): missed-dose and crisis alerts | Free |
| Children / elderly parents | Caregiver mode (dependants) | Pro |
| Cost of food & meds | Nigerian meal planner built around medicine timings and a ₦ budget; ₦ cost estimates | Plan free (1 re-plan/week); costs & unlimited re-plans Pro |
| Motivation | Daily check-in, streaks with freezes, weekly story (routine numbers only), patterns from own logs | Patterns: 1 free, all Pro |
| Fake medicines | Pharmacy finder note to check NAFDAC/PCN registration; barcode scan with NAFDAC number display | Free |

### Community feature — recommendation: **skip for v1**
An in-app community means moderating medical misinformation, self-harm content and personal data in public posts
(App Store 1.1/1.2 user-generated content rules require reporting, blocking and timely moderation). With no moderation
team yet, the risk outweighs the benefit. Instead: care partners (private, consented) and a link to established
patient groups (e.g. sickle-cell foundations) curated by the team.

## 4. Pricing

### 4.1 Store rules that shape pricing
- Digital features (Pro) **must** be sold through in-app purchase on iOS (App Store Guideline 3.1.1); auto-renewing subscriptions must give ongoing value, last ≥7 days and describe what the user gets before purchase (3.1.2) ([Apple Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)). The paywall in this release follows this.
- Apple commission: **15%** for Small Business Program members (and for subscriptions after the first year) ([Adapty summary](https://adapty.io/blog/app-store-small-business-program/)). Enrol in the Small Business Program before launch.
- Google Play: **15%** on auto-renewing subscriptions in most markets; for Australia/EEA/Japan/UK/US Google now lists 10% + a 5% billing fee ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/112622?hl=en)).
- Nigeria has a **naira App Store storefront** ([AppsOps, July 2026](https://appsops.store/blog/app-store-pricing-africa-2026)); choose the nearest naira price point in App Store Connect — the exact tier values must be read there.

### 4.2 Recommended launch prices
Principles: safety and reminders are free forever; Pro must cost clearly less than a month's typical medicine bill and
less than Medisafe; yearly gets ~2 months free; 7-day free trial on yearly only.

| Market | Monthly | Yearly | Rationale |
|---|---|---|---|
| **Nigeria (NGN)** | **₦1,500** (≈ $1.13) | **₦12,000** (≈ $9.01; ₦1,000/mo) | ~23% of Medisafe's monthly price at the official rate; within the PPP-adjusted ₦1,200–2,000 band suggested for a $4.99 product ([AppsOps](https://appsops.store/blog/app-store-pricing-africa-2026)) |
| **UK (GBP)** — diaspora | **£2.99** | **£24.99** | Below Medisafe ($4.99 ≈ £3.7–4); familiar app price points |
| **US (USD)** — diaspora | **$3.99** | **$29.99** | Below Medisafe $4.99 / $39.99 |
| Ghana, Kenya, South Africa | local price point nearest **$1.50** / **$12** | — | same logic as Nigeria; enable only after emergency numbers are verified (server table marks them UNVERIFIED) |

Revenue per Nigerian subscriber after a 15% fee: ₦1,275/month or ₦10,200/year. Price in naira, not dollars — a
dollar-priced app converts badly after the 2023 devaluation.

### 4.3 What is not paywalled (and why)
Reminders, dose logging, red-flag checks, emergency numbers, interaction checker, symptom journal, doctor PDF/sharing,
care partners, data export and deletion. These are safety or legal-rights features; paywalling them would harm users
and invite App Review rejection under 1.4.1.

## 5. Dashboard: what to watch after launch
- **Cohort retention** (D1/D7/D30) by acquisition week and by condition (from collection names).
- **Reminder health:** % of devices with `localRemindersActive`, exact-alarm granted, notification permission denied — by phone brand.
- **Push performance** (new page): sent vs opened vs suppressed by type, to prune noisy nudges.
- **Safety:** count of red-flag emergency matches per week (aggregate only) — a spike may indicate an outbreak or a rule bug.
- **Conversion:** trial starts, trial→paid, churn reasons (App Store/Play cancellation surveys).

## Sources
- [Adeloye et al. 2021 — hypertension in Nigeria 1995–2020](https://knowledge.lancashire.ac.uk/id/eprint/36955/)
- [IDF Diabetes Atlas — Nigeria](https://diabetesatlas.org/data-by-location/country/nigeria/) · [IDF Atlas 11th ed. country tables (Medbox)](https://medbox.org/index.php/dl/6878e8f2be6e2c6db864eb12)
- [Africa Check — sickle cell burden](https://africacheck.org/reports/weighing-nigerias-sickle-cell-burden-is-it-the-worlds-highest/)
- [Dataphyte — out-of-pocket spending](https://dataphyte.com/issue/pocket-science/2025/03/burden-billing-and-budget-in-nigerias-healthcare-sector)
- [THISDAY — NCC internet statistics, Aug 2026](https://www.thisdaylive.com/2026/08/27/internet-subscribers-hit-157-4m-as-broadband-penetration-increases-to-56-11/)
- [Intelpoint — phone brand shares, Feb 2025](https://intelpoint.co/insights/tecno-has-the-highest-share-among-phone-brands-in-nigeria-at-23-55-as-of-february-2025/)
- [TechEconomy — naira rate, 14 Oct 2026](https://techeconomy.ng/dollar-to-naira-exchange-rate-today-october-14-2026)
- [BMC Cardiovascular Disorders 2018 — adherence in Sokoto](https://link.springer.com/article/10.1186/s12872-018-0934-x)
- [AllAfrica — drug prices](https://allafrica.com/stories/202406180099.html)
- [BusinessDay — NAFDAC 17% substandard/falsified](https://clone.businessday.ng/?p=391905)
- [Singularity app — Tecno notification settings](https://singularity-app.com/wiki/tecno-notifications/)
- [PLoS ONE 2022 — two-way SMS in Africa (RePEc record)](https://ideas.repec.org/a/plo/pone00/0266717.html)
- [Medisafe — paid outside US from 1 Jan 2026](https://help-center.medisafe.com/en/articles/13052285-medisafe-is-now-a-fully-paid-app-for-users-outside-the-u-s)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) · [Adapty — Small Business Program](https://adapty.io/blog/app-store-small-business-program/) · [Google Play service fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en) · [AppsOps — App Store pricing in Africa 2026](https://appsops.store/blog/app-store-pricing-africa-2026)
