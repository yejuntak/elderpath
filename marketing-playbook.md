# ElderPath — $0 Marketing & 시장검증 Playbook

*Built from 3-lens research (organic-growth case studies, validation benchmarks, caregiver-channel mapping), June 2026. All tactics $0 cash; constraint is ~15–25 founder-hours/week.*

---

## The One Engine (everything else is distribution)

**Weekly "Assisted Living Transparency Report," one state at a time** — AI-analyzed public inspection data (CMS bulk datasets + state portals like TX LTCSearch). One 800-word report + 3 stat graphics + facility lookup table per week.

Why this is the whole strategy:
- **It IS the product** — every report-card page doubles as programmatic SEO (NerdWallet/levels.fyi model; solo-scale proof: 15K templated pages → 67→2,100 monthly signups in 10 months, Omnius case)
- **No consumer-grade equivalent exists for assisted living** — ProPublica covers nursing homes only; assisted-living data is fragmented across 50 state sites. The fragmentation is the moat and the story.
- **Built-in villain with live news legs**: WaPo (>1/3 of APFM "Best of" winners cited for neglect), Senate probe (38–55% of placed families exceed budget), Missouri disclosure bill 2025.
- Every channel below consumes the same weekly asset — one person runs 8 channels with one production loop.

Feasibility confirmed: CMS Health Deficiencies dataset is bulk-downloadable (data.cms.gov r5ix-sfxw); Texas LTCSearch is scrapeable; PIA requests fill gaps.

---

## Channel Playbook (ranked by effort ÷ impact for one person)

### 1. Programmatic SEO + AEO (the compounding asset)
- One page per facility: `[Facility] Violations, Inspections & Real Prices — [City, ST]`. Hub-and-spoke: state → city → facility. 100–200 pages/week cadence.
- AEO layer on every page: 40–60-word self-contained answer up top, question-phrased H2s ("Has X been cited for neglect?"), Schema.org JSON-LD, visible dates, **outbound citations to primary sources** (Perplexity rewards this). Listicle roundups ("10 highest-rated facilities in Phoenix by inspection record") — listicles = 21.9% of AI citations. `/statistics` page = citation magnet.
- Why: AI-search visitors convert 4.4× organic (Semrush 2025); facility-name+"violations" queries are zero-competition, crisis-moment, high-intent.
- Track weekly: ask ChatGPT/Perplexity 20 target queries, log citation share. Feedback loop: Perplexity 2–7 days, ChatGPT 7–21 days.

### 2. Reddit (direct users + #1 LLM-cited domain)
- Subs: r/AgingParents 75K (+58%/yr), r/AlzheimersGroup 123K, r/dementia 61K, r/CaregiverSupport 43K, r/eldercare 9K. **All ban product promotion.**
- Play: **text-only data drops** — "I analyzed every assisted-living inspection in Texas — 3 patterns that predict neglect citations" + "name a facility in comments, I'll pull its record." The comment thread = live product demo, zero links. ElderPath in profile bio only. Mod blessing before ever linking.
- Double payoff: Reddit is #1 cited domain across all LLMs (30M-citation Peec study); threads compound into AI answers for months.

### 3. Data-journalism PR (state-by-state)
- Flagship: "The State of Assisted Living Safety 2026 — every state ranked" + 50 state cut-downs. Localized pitches: "[New Data] 1 in 3 [Ohio] facilities cited for violations."
- Benchmarks: localized every-state studies → 130 placements; single data piece → 170 high-DA backlinks (Shorr). Pitch reporters who covered the WaPo/Senate story. Pegs: Senate actions, state bills, Older Americans Month (May).

### 4. Discharge planners & professionals (highest-leverage single channel)
- Hospital case managers **can't recommend facilities — but CAN hand families a neutral public-records tool.** One planner touches hundreds of crisis families/year.
- ACMA chapters, CMSA (~30K members), NASW newsletters: offer the printable "vet a facility in 20 minutes" one-pager + free chapter talks.
- ALCA's 2,000+ geriatric care managers (public directory): email 50/wk with feedback framing ("free professional access — tell us what's wrong"); ask the 10 warmest for site quotes.
- 622 Area Agencies on Aging (750K caregivers/yr) + libraries: free handouts, free virtual workshops.

### 5. Facebook groups & creators (partner, never post)
- Groups are private + no-promo: pitch **admins** (Working Daughter 11K — runs interview formats; Parenting Aging Parents — ex-TV anchors who do expert segments): guest Q&A + exclusive state lookups for members.
- Creators get exclusive data stories ("We analyzed every inspection in your state — 3 red flags, yours free, we make the graphics"): Lance Slatton/All Home Care Matters (122K YT, tool-friendly — warmest target), Dementia Careblazers (~180K), Adria Thompson (430–700K), Teepa Snow (230K TikTok).

### 6. Podcasts + earned media
- 80 caregiver podcasts (Feedspot list); hook: *"After the Senate probed A Place for Mom, I read every inspection report in America and built the opposite."* 2–4 bookings/month, per-show trackable URLs.
- Next Avenue (PBS, ~800K uniques, 50+ audience, takes contributors): "How to vet a facility yourself using public records."
- Free expert-source pipes: Source of Sources, HARO-by-Featured, Qwoted — answer aging/senior-housing queries with proprietary numbers, 15–30 min/day, 2–4 quotes/month.

### 7. Nextdoor (hyperlocal proof)
- 105M verified users, core demo = homeowners 35–65. Answer "anyone know a good assisted living near here?" threads with the named facility's actual inspection record. "I looked up all 8 facilities in [town]" posts are information, not ads.

### 8. Waitlist referral loop (multiplier on all of the above)
- Crisis buyers don't queue → **invert**: signup instantly delivers value (parent's facility report card emailed); 1 referral = compare 3 facilities; 3 = full city report.
- Built-in share line: "Send this to your brother or sister — you're deciding together." (Sibling dynamics = natural K.)
- Expect K≈0.2–0.4 (realistic range; Dropbox 0.7) → every 100 organic signups become 120–140. Free tiers: GetWaitlist / LaunchList / Waitlister.

### ⚠️ Do NOT touch
- **AgingCare.com forum — APFM-owned.** Intel only (mine question phrasing for SEO topics + complaint threads for copy). AARP's community is the alternative.
- No fake/AI-generated testimonials ever (FTC rule, ~$53K/violation). AI photos stay labeled. Disclose any testimonial incentive.

---

## 시장검증 — 6-Week Ladder with Kill Gates

**Principle (Seniorly's failure): supply and sympathy are not demand. Qualify urgency, measure commitments.**

| Week | Experiment | Gate (continue / kill) |
|---|---|---|
| 1–2 | Publish 5 real report-card artifacts (20 largest facilities, 2–3 metros). Instrument: Clarity + GA4 + PostHog funnel, UTM per channel. Seed 5 caregiver communities. | **≥2% signup from warm community traffic** (<2% = message/segment mismatch; >10% = strong) |
| 2–4 | 20 Mom-Test interviews (10 waitlist, 10 communities). Past-tense only: "Walk me through the last time you compared facilities." "What did you pay vs budget?" End with commitment ask. | **≥60% unprompted convergence** on pricing-opacity/trust pain + ≥5 agree to concierge pilot |
| 3–6 | **Concierge MVP**: 5–10 free hand-run searches (intake call → pull records → call 5–8 facilities for real pricing → 48h comparison report). Premium fake door ($99 concierge button → "10 families this month, book a call"). 20 flat-fee LOI emails to top-decile facilities. | **≥1 family completes a move decision** · **≥3% premium-door CTR** · **≥1 facility LOI** (10%+ cold reply = real supply pull) |

**Benchmarks to read results against:**
- Waitlist pages: ~15% avg conversion, 15–40% well-targeted; >10% from cold = real; community traffic discount to 15–25% expected
- Signup→purchase decay: only 5–15% of waitlist ever pays — divide list by 10
- Fake door: 2–5% CTR typical, >5% strong; min 300 sessions/cohort, 7–14 days
- Precedents: Papa = ONE brokered match → unicorn; CareYaya = 2,000 matches in 18mo, 100% word-of-mouth; APFM itself started as a kitchen-table concierge
- Investor-legible sentence to build: *"X organic signups at Y% from caregiver communities, Z concierge searches completed, N families moved, 2 facility LOIs on flat-fee model — 100% organic, $0 CAC."*

**Form qualifier (implemented on landing page):** "When do you expect to need a community?" now / <3 months / 3–12 months / just researching. Run all commitment tests on the now/<3mo segment only.

---

## Legal Guardrails (free, and on-brand)

- **WA RCW 18.330 / CA SB875 / AZ ARS 36-446.14** regulate referral agencies: written pre-referral disclosure (fees, both-sides relationship, enforcement history), records, licensing (CA). **Information-only = exempt**; never accept facility money in a regulated state before compliance. Strategy: publish a voluntary RCW-modeled disclosure NOW — costs nothing, weaponizes compliance against APFM opacity.
- **FTC Reviews Rule (Oct 2024)**: no fabricated/AI testimonials, disclose material connections, substantiate outcome claims ("saved $800/mo" needs receipts).
- **WA My Health My Data**: parent's dementia status in a form = consumer health data → minimum collection (email, ZIP, timeline), masked analytics inputs (Clarity/PostHog default), separate consent for anything health-related, plain-language privacy note.

---

## Ready-to-Fire Assets

### A. Reddit data drop (template — fill with REAL numbers after the data pull; never fabricate)
> **Title:** I read all [N] assisted-living inspection reports in [State] so you don't have to. Three patterns that predict problem facilities.
> **Body:** Last month the Senate probe into referral sites got me wondering what the actual state records show. So I pulled every [State] inspection from [year range]. What stood out: (1) [real finding]. (2) [real finding]. (3) [real finding]. How to check any facility yourself, free: [state portal walkthrough, links to STATE site only]. Happy to look up any facility — name it in the comments.
> *(No ElderPath link. Profile bio only.)*

### B. Creator/admin pitch (email/DM)
> Subject: Free exclusive: every assisted-living inspection in [State], analyzed
> Hi [Name] — after the Senate's A Place for Mom probe I analyzed all [N] state inspection reports in [State]. Three findings your audience won't see anywhere else: [stat 1], [stat 2], [stat 3]. Yours to publish free, with credit or without — and we'll make the graphics in your style. If useful, I can also build a custom lookup for your audience's most-requested facilities. — [Name], ElderPath (independent, no facility commissions)

### C. Podcast pitch (3 lines)
> Subject: Guest idea: the person who read every assisted-living inspection in America
> The Senate is probing A Place for Mom for steering families to facilities that pay commissions — over a third of its "Best of" winners had neglect citations (WaPo). I analyzed the public inspection data nobody reads and built the family-side alternative. Happy to bring [State]-specific numbers for your audience + a free lookup link for listeners.

### D. Discharge-planner one-pager (copy)
> **How to vet an assisted-living facility in 20 minutes — using public records**
> 1. Pull the state inspection history: [state portal]. Look at 36 months, not the latest visit. 2. Severity beats count: one "serious harm" citation outweighs five paperwork ones. Verify corrections. 3. Ask for staffing ratios in writing; compare to the state average ([X]). 4. Get the REAL monthly cost: base rent + care-level fees + move-in fee, in writing. "Starting at" prices average [Y]% below what families pay. 5. Free lookup of any facility's record: elderpath.example
> *Neutral, public-data-based — appropriate where facility recommendations aren't.*

### E. Mom-Test interview script (10 questions, past-tense only)
1. Walk me through the day you realized your parent needed more care. 2. What did the hospital/discharge planner actually hand you? 3. What did you do in the first 48 hours? 4. Which sites/services did you try — what happened on each? 5. How did you get pricing? How close was the final bill to the first quote? 6. Did you ever look at state inspection records? Why/why not? 7. What almost made you choose a facility you later rejected? 8. Who else in the family was involved, and how did you share research? 9. What did the whole search cost you in time and money? 10. What do you wish had existed? → *Close: "Could I run my next research pass by you?" / "Know another caregiver mid-search I could talk to?" (the commitment IS the data)*

### F. Facility flat-fee LOI email
> Subject: [Facility] scored top-decile on state inspections — verified profile?
> Your last 36 months of [State] inspection records put you in the top 10% we analyzed. We're ElderPath — the family-side referral alternative (flat fee, never a % of rent, rankings can't be bought; the Senate-probe model is the one we're replacing). We're offering 20 top-scoring communities a verified transparent-pricing profile. One-page LOI, no payment until launch: [link].

---

## Weekly Loop (the whole job, ~15–20 hrs)

Mon: pull + analyze next state's data (AI) → report + 3 graphics. Tue: publish pages (SEO/AEO), post Reddit data drop. Wed: 5 journalist pitches + 5 podcast/creator pitches + SOS/Qwoted replies. Thu: professional channel (ACMA/ALCA/AAA emails, LinkedIn). Fri: concierge searches + interviews + metrics doc update (date, channel, visitors, signups, qualified %, interviews, commitments).
