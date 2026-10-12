# Domain Discoverer: 2026 UX, SEO and performance overhaul

**Design revision, October 12, 2026:** The original sage/lime serif direction documented below was superseded after preview feedback. The active `dev` implementation is now a graphite-and-stone, restrained sans-serif interface with the domain checker directly embedded in the homepage hero, an editorial light reading surface, and a no-dependency client-side domain lookup experience. See [design-system-2026.md](design-system-2026.md) for the current specification. Earlier design notes below are preserved as history, not as the current styling contract.

**Development only:** Implemented on `dev`; `main` is intentionally unchanged.

## Product promise
A focused platform where a visitor can (1) check an exact domain, (2) understand domain basics and registration, and (3) use practical research references to make a decision. This is a **domain-learning and lookup** product, not a registrar or domain-investment guarantee.

## Design research and direction
Research reviewed the design approaches of:
- Behance **NSD WEBSITE®** — editorial type, generous negative space, controlled dark layout: https://www.behance.net/gallery/248182567/NSD-WEBSITE
- Behance **Arise | Brand Identity | Web Design** — narrative scroll rhythm and typographic hierarchy: https://www.behance.net/gallery/246168811/Arise-Brand-Identity-Web-Design
- Behance **Professional Service Landing Page** — structured content and dark/light contrast: https://www.behance.net/gallery/249900179/Professional-Service-Landing-Page
- Behance **HENSON.STUDIO — Photographer Portfolio Website** — strict grid and restraint: https://www.behance.net/gallery/139601119/HENSONSTUDIO-Photographer-Portfolio-Website
- Behance **Contractors Direct — Website Redesign** — editorial content journeys and service clarity: https://www.behance.net/gallery/254438987/Contractors-Direct-Website-Redesign

**Translated into our own system, not copied:** deep charcoal, chalk typography, muted sage lines, one restrained lime accent, occasional warm paper surface, no hero images needed, no gradients/shadows/blur, strong large serif display contrasting with precise system sans body. Intentional motion via CSS transitions and one IntersectionObserver, with reduced-motion support. No animation framework, no remote font loading and no external image CDN.

Using system-resident font families rather than shipping WOFF files is an explicit zero-egress compromise. A self-hosted subset font can be evaluated after core web vitals verification if typography is still insufficient.

## Search-intent map (qualitative priorities, not invented keyword volumes)

| Intent group | Primary query themes | Target page | Content job |
| --- | --- | --- | --- |
| Transactional/tool | domain availability checker, free domain checker, check if domain is available | /domain-availability-checker | One manual live query and availability caveats |
| Broad landing | find a domain name, domain name search, domain research | / | Lead with clear lookup and learning paths |
| Foundational | what is a domain name, how domain names work | /blog/what-is-a-domain-name | Teach address, TLD, registrar, DNS and renewals |
| Decision | how to choose a domain name, best domain name for business | /blog/how-to-choose-a-domain-name | Decision checklist and trademark cautions |
| Practical setup | domain name vs hosting, domain vs web hosting | /blog/domain-name-vs-web-hosting | Explain separation and setup steps |
| Extension research | domain extensions explained, .com vs .io vs .ai | /blog/domain-extensions-guide | Extension suitability, restrictions and renewals |
| Cost | cheap domain registrar, domain renewal cost, domain privacy | /blog/cheap-domain-registrars-with-free-whois | Cost comparison framework, avoid fake prices |
| Research | expired domain tools, domain sales comparisons, domain backlink history | /tools and related articles | Clear tool categories and research sequence |
| Brand | brandable domain names, memorable business domains | /blog/brandable-domain-names-guide | Radio test, brand fit and conflicts |

Without Search Console or an independent volume dataset attached, these are **intent clusters rather than quantified keyword forecasts**. Do not claim verified ranking potential or search volume. Revisit using actual GSC queries and pages after production launch.

## Page-by-page implementation
- **Global layout:** semantic header/footer, mobile navigation, skip link, landmark structure, scroll progress, contrast and reduced motion.
- **Homepage:** editorial headline and single lookup action, clear learn/discover journey, curated tool categories, no third-party hero assets.
- **Domain checker:** functional search on its own page and on homepage, client validation + server validation, bounded wait, safe error responses, registration disclaimer.
- **Learn hub:** automatic index of Markdown posts, titles and summaries, keyword-intent organization.
- **Article template:** unique metadata, Article & Breadcrumb JSON-LD, accurate dates, quick checker CTA, related paths.
- **Tools directory:** grouped research links; no autoplay API calls, made-up cost data or dubious fake referral codes.
- **About / Contact / Success / 404:** clear next actions, preserved Netlify form contract, noindex where appropriate.
- **Privacy / Terms / Disclosure:** updated wording aligned with actual service and tracking behavior.
- **/tom admin:** intentionally not redesigned without authenticated staging QA; admin email and storage flows must not be broken by public redesign. Verify it separately before merge.

## Technical SEO
- Astro static pages provide crawlable HTML. Each content page has one focused purpose and unique title/description.
- Canonical URLs point at production site; branch deployments include `noindex,nofollow` when `CONTEXT` is not production.
- Sitemap excludes admin, 404 and form-success pages; robots disallow admin and reference sitemap index.
- Removed catch-all rewrite that could have returned the home page with 200 for nonexistent paths.
- Kept an explicit 301 redirect for legacy long-tail URL to the relevant naming guide.
- Uses `WebSite`, `Organization`, `BlogPosting` and `BreadcrumbList` structured data where relevant. Did not add retired Sitelinks Search Box markup.
- No paid external SEO or keyword service added.

## Performance and egress budget
- Zero extra paid APIs; existing Dynadot Netlify function remains the only live public lookup.
- Static page content; no auto-loaded Supabase client, client-side ads, remote JS libraries, tracking pixels or Google font fetches on public pages.
- Domain lookups are **manual** and **one per submission**, not made on every keystroke.
- No heavy motion libraries, shadow filters, background images or blur effects; observer unobserves after first reveal.
- No public page calls Supabase just to render static research lists.
- Note: no distributed request rate limiter has been implemented; abusive anonymous calls could still consume provider/hosting quota. Decide whether to use a platform-native free-tier protection feature after reviewing traffic.

## Acceptance checklist before production
1. `npm ci && npm run build` on `dev` must pass.
2. Check homepage, checker, guide hub, each article, tools, legal, About, Contact, success and 404 on 320px, tablet and desktop.
3. Submit a valid available name, a taken name, a malformed input, missing Dynadot credential and upstream timeout.
4. Confirm no API key/raw response appears in browser network responses; inspect function logs for secrets.
5. Test keyboard navigation, Escape/menu behavior, voiceover labels, error announcements, reduced motion and touch targets.
6. Verify each title, canonical, metadata, OG preview, sitemap index, robots directives, structured data and proper 404 status.
7. Confirm the Netlify preview context is not indexable.
8. Ensure Netlify environment has the **rotated** Dynadot key; deletion of committed `.env` requires a server-side environment variable.
9. Test Netlify contact form detection and submission.
10. Test authenticated `/tom` admin dashboard/email flows independently before merging.

## Security findings and out-of-scope issues
- **URGENT:** The repository historically committed a populated `.env` containing `DYNADOT_API_KEY`. Removed from `dev` worktree, but history and `main` retain exposure. Rotate/revoke key at Dynadot and store replacement as a Netlify secret. Consider history-rewrite only with a carefully planned coordinated process.
- The shared Supabase General project contains `dd_` domain tables, all with RLS enabled as checked on Oct 12, 2026. No database mutations were necessary for the public redesign.
- Supabase security advisors flagged `public.sn_app_settings` lacking RLS and additional SECURITY DEFINER function warnings in unrelated products. Do not change unrelated shared tables/functions during Domain Discoverer work without isolated approval and policy review.

## External references
- Google Search Central — https://developers.google.com/search/docs/fundamentals/get-started-developers
- JS SEO — https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- People-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Core Web Vitals — https://developers.google.com/search/docs/appearance/core-web-vitals
- ICANN RDAP — https://www.icann.org/rdap/

## Runtime baseline
- Netlify and GitHub Actions use Node.js 22 Maintenance LTS (through April 2027) instead of end-of-life Node.js 20. After any build-runtime change, verify the dev build and Netlify branch deploy independently.
