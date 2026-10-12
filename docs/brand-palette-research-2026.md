# Domain Discoverer — new visual identity and domain-platform research
Date: 2026-10-12
Branch: `dev` only; no changes to production `main`.

## Objective
Preserve the approved information architecture while making Domain Discoverer immediately recognizable and visually premium. Use colour, flat geometric layering and very subtle motion to create spatial depth **without** gradients, glass blur, shadows, WebGL, image files or remote font downloads.

## Comparative references (inspiration, not assets to copy)
These observations are qualitative visual/UX references, not a pixel-perfect audit or endorsements.

| Reference | Useful lesson | Avoid copying |
| --- | --- | --- |
| Dynadot — https://www.dynadot.com/domain/search | Highly prominent domain entry; useful extension information; strongly recognizable blue family | Its blue-gradient layout and transactional pricing claims |
| Spaceship — https://www.spaceship.com/ | Confident dark surroundings and large abstract visual treatment; search immediately legible | Spaceship's blue circular gradient/orb or brand graphics |
| Atom — https://www.atom.com/ | Expressive but disciplined headline hierarchy, bold contrast, prominent search | Its violet identity and premium-marketplace product claims |
| GoDaddy — https://www.godaddy.com/domains | Single clear domain search action, straightforward domain selection | GoDaddy's trademark teal and sales-promotional interface |
| Namecheap — https://www.namecheap.com/ | Contrast between a strong search action and navigable domain services | Namecheap's orange promotions and crowded sales widgets |
| NameMaxi — https://www.namepros.com/threads/namemaxi-expert-domain-investor-platform-official-thread.1343571/ | Practitioner-oriented information density; dark utility panels; effective categorization | Their dark/yellow data cards and commercial domain metrics. The official site could not be reliably inspected, so this comparison uses a publicly available community screenshot. |
| dotDB — https://dotdb.com/news/2024-12-21/exciting-new-features-now-available-on-dotdb-keyword-insights-and-word-analyze | Practical table hierarchy and crisp result distinctions for researching domains | Its white/green dashboard pattern and third-party metrics |

The seven references reviewed are Dynadot, Spaceship, Atom, GoDaddy, Namecheap, NameMaxi and dotDB.

## Active palette — Midnight Iris / Sea Glass
This is an **original combination**, not any company's palette.

| Role | HEX | Usage |
| --- | --- | --- |
| Midnight ink | `#11172A` | Overall dark canvas, navigation |
| Hero iris | `#15213C` | Homepage hero, deep contrast |
| Ocean surface | `#1D2844` | Content surfaces and links |
| Edge slate | `#3D4B67` | Delicate lines, borders |
| Paper pearl | `#EFF5F9` | Long-form content and light sections |
| Text white | `#F3F8FF` | High-contrast text on dark |
| Muted silver blue | `#BDCADB` | Secondary text |
| Sea-glass | `#A8EEE4` | Main focus/CTA accents, navigational interest |
| Deeper teal | `#247991` | Interactive context and light-theme links |
| Iris lilac | `#B4BAF4` | Secondary geometric highlights |
| Faceted cobalt | `#354977` | Background geometric relief |
| Faceted turquoise | `#237586` | Background dimensional relief |

No gradient interpolation or image-processing filters are needed. The shapes are carefully separated solid fills with thin transparent contour strokes. The geometry is entirely inline SVG, assembled in `src/components/HeroGeometry.astro` and reused on the homepage and checker.

## Hero design
- Search is still the primary action within the hero and remains readable in front of decorative shapes.
- Large abstract faceted sculpture sits mainly at the far-right, offset from the text and search.
- Solid-colour angular polygons, nested facets, and precise outline guides produce an architectural 2.5D impression. No external images or canvas.
- Slow transform-only movement is optional eye candy, CSS-driven; no timers, JS loops, requestAnimationFrame or layout-changing transitions. Motion is disabled when users prefer reduced motion.
- At tablet/mobile widths the SVG is repositioned and softened to protect copy and form legibility.
- Search container is a light pearl surface with a refined sea-glass top edge. CTA uses a deep-on-bright colour contrast and meaningful focus states.

## Acceptance notes
- GitHub CI checks npm install, function CommonJS scope, domain normalization tests, article links and Astro build.
- A passing build is **not** a live visual review. Open the actual Netlify `dev` branch preview and inspect 320/375/768/1440 px widths, plus Firefox/Safari if available.
- Verify search API with correct Dynadot environment secret, a known taken domain and a candidate free name. Do not infer live availability from build success.
- Confirm responsive legibility, scroll, mobile menu, article navigation, no unexpected horizontal overflow, and no bad contrast on the warm-light reading surface.
- Existing historical Dynadot key exposure still requires revocation/rotation before production release.
