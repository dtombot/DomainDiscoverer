# Domain Discoverer / UI design system, October 12, 2026

Status: Development-only implementation on `dev`. The production `main` branch remains unchanged.

**October 12 refinement:** The graphite and warm-stone palette described in the historical section below was superseded by an original *Midnight Iris / Sea Glass* palette. The hero now contains a self-hosted inline SVG of crisp, overlapping, subtly animated geometric facets, with no gradients, shadows, blur filters or image fetches. The geometry is decorative, excluded from accessibility reading order, automatically muted on small screens, and stationary under reduced-motion preferences. See `docs/brand-palette-research-2026.md` for current exact tokens and design rationale.

## Design intent
Domain Discoverer is a **domain checking and educational resource**, not an AI generator or a speculative domain marketplace. Put the useful action before marketing. The visitor should immediately recognize where to enter a domain and what will happen next.

The current design was rebuilt in response to feedback that the old pages appeared generic and AI-generated. We deliberately removed oversized serif/italic display text, bright green accents, numerical decorative labels, generic marketing-card grids, unnecessary scroll effects, and the separation between the homepage hero and the domain checker.

### Original visual tokens (superseded by latest palette)

The section below records the previous design iteration and is not the active palette. The current palette and decisions are documented in `docs/brand-palette-research-2026.md`.
- Graphite foundation: `#181b20`, with darker header/footer and `#1e2227` content surfaces.
- Light reading/learning surface: warm `#f1efeb`, dark text `#25282c`.
- Accent: muted warm stone `#e4c8a4`. It appears mainly in interactive controls, navigation and subtle information labels, never as an arbitrary coloured word inside a headline.
- System-first sans-serif typography. No third-party font downloads, external hero images, gradients, decorative blur or shadows.
- Soft 4–7 px radii only on practical controls; editorial sections use fine dividing rules, generous whitespace and straightforward alignment.
- Responsive layouts at 950 / 900 / 750 / 700 / 580 px.
- Hover and focus changes are subtle and functional; reduced-motion preferences are respected.

### Homepage hierarchy
1. Direct, concise heading that identifies the product.
2. One full-width interactive domain search surface **inside the hero**.
3. Manually selectable common domain extensions. Selection only updates the field, never triggers a background API call.
4. Small disclaimer that availability and pricing must be confirmed at registrar checkout.
5. Light-background learning library with three linked editorial rows.
6. Dark research directory with clear actions, not repeated marketing cards.
7. Minimal next-step reading recommendations.

### Domain search behaviour
- The existing Dynadot-backed Netlify function remains the only API connection for public availability.
- Client form validates before it requests; one request per explicit submission, never per keystroke.
- A new domain input or extension selection cancels any in-flight fetch; requests have a 10-second client timeout and 8-second server timeout.
- Status states: loading, likely available, taken, invalid input, unavailable service. Avoid misrepresenting a lookup as a guaranteed reservation.
- On an available result, visitor can review a registrar checkout or copy the name. On a taken result, extension switching and educational guidance remain available.
- Pasted HTTPS URLs are normalized locally. No localStorage tracking or visitor domain-history DB was added.
- Pure domain helpers are covered by `npm run test:domain`, and the workflow runs them before building.
- React is intentionally **not** added for this interaction. Astro processes a small bundled client script, avoiding additional framework hydration and JavaScript delivery. React can be added later when a truly state-heavy feature justifies it.

### Educational pages
- The blog listing uses clear categories, titles and descriptions in a continuous scan-friendly list.
- Article text renders on warm light paper for long-form reading. The article template constructs a section index from `h2` elements, without loading a framework.
- Existing SEO metadata, structured data, canonical URLs, published dates, sitemap behaviour and the nine educational Markdown articles are preserved.
- Tools directory is categorized; all third-party research tools are outbound links, not automatic browser requests.

### Release acceptance checklist
- [ ] Open Netlify `dev` preview at desktop width: search fully visible within hero, typography and spacing balanced.
- [ ] Check at 375 px and 320 px: no horizontal overflow, navigation expands, search button remains visible, FAQ controls work.
- [ ] Type and submit `example.com`, verify one request, status and error handling; test a domain whose live availability is known.
- [ ] Paste `https://www.example.com/path` and confirm local normalization; try `.org` and `.app` chips and verify **no request until submit**.
- [ ] Disable JavaScript and confirm core navigation, content and forms remain understandable, acknowledging that live checker requires JS.
- [ ] Verify Netlify functions package successfully and the rotated Dynadot key is available in the branch deployment environment.
- [ ] Test contact form, outbound checkout, mobile menu, article section links, admin `/tom`, privacy and legal links.
- [ ] Audit Lighthouse performance, contrast and accessibility in the actual Netlify deployment.
- [ ] Compare branch screenshot against current `main` before considering promotion.

## Scope boundaries
Do not change `main` without authorization. Do not modify shared Supabase tables or the admin email system as part of this public design overhaul. The Dynadot API key committed in historical Git remains a separate mandatory key-rotation task; deleting the working-tree .env did not revoke it.
