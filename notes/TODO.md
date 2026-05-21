# TODO — Sterling Steffen Site

Prioritized by impact on real users and booking conversions.

---

## 🔴 CRITICAL — Must Do Before Going Live

- [ ] **Replace booking link**
  `index.html` → find `https://example.com/booking` → replace with real URL

- [ ] **Replace email address**
  `index.html` → find `mailto:booking@example.com` → replace with real email

- [ ] **Add social links**
  `index.html` → find `href="#"` on each `.social` anchor → add real URLs:
  - Bandcamp artist page
  - Tidal artist page
  - Mixcloud profile

- [ ] **Add press photo (og:image)**
  1. Save the press photo from dart-collective.com/djs/sterling-s/ to `assets/og-image.jpg`
  2. Crop/resize to 1200×630px
  3. The meta tags in `index.html` already reference `/assets/og-image.jpg` — just drop the file in.
  Without this, social shares (iMessage, Instagram DMs, Slack) show no preview image.

- [ ] **Set real domain in canonical URL, sitemap, and JSON-LD**
  `index.html` → `<link rel="canonical">` → confirm/update to your actual domain
  `robots.txt` → update `Sitemap:` line
  `sitemap.xml` → update `<loc>` URL

---

## 🟡 HIGH — Do Within 2 Weeks of Launch

- [ ] **Submit to Google Search Console**
  1. https://search.google.com/search-console
  2. Add property → verify via DNS TXT record
  3. Sitemaps → submit `https://sterlingsteffen.com/sitemap.xml`
  This is the single highest-leverage SEO action — it's how Google discovers the site.

- [ ] **Add Bandcamp track IDs to easter egg spots**
  `js/main.js` → replace `playDrift / playPing / playKick / playStatic / playArp`
  with Bandcamp embed iframe logic. Track IDs: Bandcamp → track → Share/Embed → Embed tab
  → copy number after `track=`. Add one per egg spot + the spacebar pool.

- [ ] **Add JSON-LD sameAs links** (once social URLs are real)
  `index.html` → JSON-LD block → add:
  ```json
  "sameAs": [
    "https://sterlingsteffen.bandcamp.com",
    "https://tidal.com/browse/artist/...",
    "https://www.mixcloud.com/sterlingsteffen/"
  ]
  ```

- [ ] **Request a Google Business Profile**
  https://business.google.com → "Sterling Steffen DJ"
  Enables Google Knowledge Panel + appearance in "wedding DJ Austin" map results.

- [ ] **Set up analytics**
  [Plausible](https://plausible.io) — $9/mo, privacy-first, no cookie banner needed.
  Or Google Analytics 4 (free, more setup, requires cookie consent in some regions).

---

## 🎨 DESIGN — Implement These for a Truly Bespoke Feel

*Reference: Skrillex, Four Tet, Actress, Burial have minimal sites where the nav,
typography, and negative space do all the work. No photos on the hero. Text IS the UI.*

### ✅ Done
- [x] Film grain overlay (animated, grain-shift steps)
- [x] Vignette (body::after radial gradient)
- [x] Scan lines layered into vignette (repeating-linear-gradient, 4% opacity)
- [x] Warm background tint (#0c0b09 vs pure black)
- [x] Text scramble on artist name (decodes on load, re-scrambles on glitch cycle)
- [x] Soft blur-fade-up reveal on hero name (fadeUpName, 1.3s, blur 8px → 0)
- [x] Lowercase-only scramble chars (typographic, not harsh)
- [x] Periodic RGB chromatic aberration on the name (JS + Web Animations API)
- [x] Full-page glitch flash (body-glitch 19s animation, 3 rapid filter bursts)
- [x] Given-name letter-spacing + color glitch (17s cycle)
- [x] Tag-line skew + opacity glitch (23s cycle)
- [x] Social icon hue-rotate flash synced to 19s body-glitch cycle
- [x] Booking button border-color glitch (29s cycle, red → cyan flash)
- [x] Staggered load animations (fadeUp, all elements in document order)
- [x] Footer separator line (1px, 6% white)
- [x] Social icon micro-lift (translateY -2px on hover)
- [x] Thin horizontal rule between name and tag (3.5rem wide, editorial)
- [x] ~~Genre tagline~~ — removed. "available" broke the register; silence is cleaner.
- [x] Cursor trail (ring dots, pointer:fine only)
- [x] ASCII art flash (every 18–24s, random position, 12-piece pool)
- [x] ASCII flash + name scramble + body filter burst on window resize
- [x] Grain intensity boost when audio is active (body.audio-active)
- [x] Press photo background layer (fixed, 7% opacity, grayscale — shows when assets/og-image.jpg exists)

### Next Up

### "Text IS the UI" — Design Thread

*The type weight, spacing, position, and silence carry the entire composition.
No decorative chrome. Negative space is intentional. Glitches are typographic.*

- [x] **Left-align layout (lower-left)**
  Break the centered symmetry. Anchor content `bottom-left` with generous
  left padding: `align-items: flex-start`, `text-align: left`, body `align-items: flex-start`.
  Upper-right quadrant becomes pure darkness — confidence, not emptiness.
  Reference: Hyperdub, Warp, Actress, Burial. The single highest-impact layout move.

- [x] **Booking CTA as pure type**
  Remove the pill border. Style as spaced uppercase text with a
  2px underline on hover only (`text-decoration: underline`).
  A border pill says "web app." A bare text link says "artist."
  Keep `display: inline-flex` + `height: 3rem` for hit-area; just remove the border/bg.

- [x] **Typographic left rule**
  A 1px vertical line anchoring the left edge of the content block.
  Runs from the top of the artist name to the bottom of the booking CTA.
  Pure composition — no imagery, just structure. CSS `::before` on `main`.

- [x] **Large monogram watermark**
  A huge "SS" in the background at 1.5% opacity — barely there, adds depth.
  Use the same Instrument Serif italic. Pure CSS, no image needed.
  CSS: `position: fixed; font-size: 65vw; color: rgba(255,255,255,0.015)`.

- [x] **Variable font weight animation on hover** over the name
  Syne supports weight 400–800. On hover over the artist-anchor, animate
  `font-variation-settings: 'wght' 500` → `800` over 300ms. Feels alive.
  (Requires Syne variable font version — update the Google Fonts URL.)

- [x] **Glitch-reactive social icons** — hue-rotate flash on `.social svg`, synced to 29s body-glitch cycle.

- [x] **"Konami code" hint mode** — 30s idle → egg spots pulse to ~30% opacity for 1.1s, then gone. Resets on any interaction.

- [x] **Apple Touch Icon**
  Create 180×180px PNG of the "S" monogram → `assets/apple-touch-icon.png`
  Add `<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />` to `<head>`.

- [x] **Real favicon**
  Generated 16/32/48px ICO with PIL (Georgia Italic S on #0c0b09).
  `favicon.ico` in root + SVG favicon already in `<head>` for modern browsers.

### CSS-only polish (quick wins, each < 30min)

- [x] **`::selection` color**
  `::selection { background: rgba(255, 140, 30, 0.35); color: #0c0b09; }`
  Brand-amber highlight when text is selected. Noticed by designers, free to do.

- [x] **STEFFEN flush-left**
  Remove `text-indent: 0.6em` from `.artist-name__family`.
  Currently the "S" of STEFFEN drifts right of Sterling's left edge — inconsistent optical baseline.
  Letter-spacing still works without the indent.

- [x] **Custom focus-visible ring**
  Replace browser-default blue rectangle: `outline: 2px solid rgba(255, 140, 30, 0.55); outline-offset: 4px`
  on `:focus-visible`. Amber glow matches the glitch palette. Accessibility + brand.

- [ ] **Skip-to-content link**
  `<a href="#main" class="skip-link">Skip to content</a>` — visually hidden until focused,
  jumps past fixed chrome to `<main id="main">`. One element, 3 CSS rules. Standard a11y.

- [ ] **Print stylesheet**
  `@media print` block: white background, all animations/overlays off, name + contact + bio visible,
  all decorative chrome hidden. Makes a clean press-kit printout from the browser.

- [x] **Name gradient shimmer on hover**
  Set `background-size: 200%` on `.artist-name__given`, transition `background-position` from
  `0%` → `100%` on `.artist-anchor:hover`. Foil-tape catching light, zero JS.

### Interactive effects (JS + CSS, each < 2hr)

- [x] **Mouse-tracking depth parallax**
  `mousemove` listener sets two CSS custom properties. `.artist-name__given` translates ±4px,
  `.artist-name__family` translates ±8px in the opposite direction. 3D depth with no library.
  Pointer:fine only (same guard as cursor trail).

- [x] **Ambient cursor spotlight**
  A 380px radial gradient element follows `mousemove` at ~5.5% opacity — a stage light on a dark floor.
  Separate layer from the cursor trail; both coexist. Pointer:fine only.

- [x] **"Now playing" waveform bars**
  When `body.audio-active`: 3 short vertical bars in the footer animate with staggered
  `scaleY(0.2–1)` loops. CSS class toggled by the existing `setAudioActive()` in main.js.
  No new JS state. Disappears when audio stops.

- [x] **Time-of-day warmth shift**
  On load, `new Date().getHours()`: 9pm–5am shifts `--color-bg` to `#0a0b0e` (cooler/night);
  11am–4pm shifts to `#0e0c08` (warmer/afternoon). CSS variable update with a 3s transition.
  Automatic, imperceptible to most, alive.

- [ ] **Tap tempo `T` key**
  Pressing `T` repeatedly calculates BPM from inter-keypress intervals (rolling average of last 4 taps).
  Flashes result via existing `showASCII()` with a custom block: `♩ = 124 BPM`. Resets after 3s idle.

---

## 🧩 INTERACTIVITY / EASTER EGGS — Next Tier

- [ ] **`?` keyboard shortcut overlay**
  Pressing `?` (while nothing is focused) opens a full-screen terminal overlay listing:
  all 6 egg spots with locations, keyboard shortcuts (Space, T, Esc), and sound tray tip.
  VT323 font, same dark bg, `backdrop-filter: blur`. Closes on `?` or `Esc`.
  Zero visual weight when not open — purely discoverable.

- [ ] **Haptic feedback on egg tap**
  `navigator.vibrate(8)` fires when any egg button is clicked on mobile (where supported).
  One line per egg. Progressive enhancement — no effect on unsupported devices.

- [ ] **Glitch kill-switch in sound tray**
  Add `[ glitch: on ]` as a toggle line in the sound tray.
  Clicking it adds `body.no-glitch` → CSS sets all periodic glitch `animation-play-state: paused`.
  Supplements `prefers-reduced-motion` (which users may not have set in OS preferences).

- [ ] **BPM-synced cursor trail density**
  When `kick` or `drift` tune is playing, halve `MIN_DIST` in the cursor trail (4 → 2px).
  Trail becomes denser, more reactive — feels like it's responding to the beat.
  Restore `MIN_DIST` when the tune ends.

- [ ] **Seasonal ASCII pool — February**
  During February (`new Date().getMonth() === 1`), inject 3–4 wedding-specific ASCII pieces
  into the pool at runtime: a table seating diagram, a first-dance cue card, a champagne tower.
  Auto-reverts in March. Peak wedding inquiry season is Jan–Feb.

---

---

## 🙋 USER-FACING FEATURES

- [ ] **Contact form**
  The single highest-conversion change available. Replace or supplement the `mailto:` link with
  a `<form netlify>` (Netlify Forms — free tier, zero backend, zero JS required).
  Fields: Name · Email · Event Type (wedding / private / other) · Event Date · Message.
  On submit, swap form innerHTML to `[ message received · we'll be in touch ]`.
  Same dark styling as the rest of the site.

- [ ] **Booking status line**
  One line between `[ bands ]` and the footer. Sterling updates it manually when needed:
  `[ booking 2026 ]` or `[ fully booked through oct · inquire for 2026 ]`
  VT323 font, ~10% opacity by default. High signal for couples scoping availability.

- [ ] **Testimonials**
  A `[ testimonials ]` disclosure below `[ bands ]` — same `<details>` pattern.
  Inside: 2–3 `<blockquote>` elements styled as terminal output (serif quote, VT323 attribution).
  Biggest trust signal for booking conversions. Structure is ready to build; Sterling provides quotes.

- [ ] **Web Share API button**
  A `⤴` glyph in the footer. On click: `navigator.share()` on mobile (native share sheet),
  `clipboard.writeText(url)` on desktop with a brief `[ link copied ]` confirmation.
  Only renders when API is available. Zero visual noise otherwise.

- [ ] **Venue name-drops (hidden SEO)**
  A `.seo-bio`-style hidden block listing Austin venues Sterling has played:
  The Driskill · Commodore Perry Estate · Mercury Hall · The Oasis · Cedar Door.
  Invisible to sighted users; Google associates these venue names with his name.
  Sterling confirms the list — structure is trivial to add.

---

## 🟢 GROWTH — Wedding SEO & Booking Pipeline

- [ ] **Get listed on wedding directories** (each = a backlink = better ranking):
  - The Knot: theknot.com/marketplace/vendors
  - WeddingWire: weddingwire.com/vendors
  - Zola: zola.com/wedding-vendors
  - GigSalad: gigsalad.com
  - Bark: bark.com

- [x] **Wedding landing page** (`weddings.html`) — sidebar layout, dark-soft palette, placeholder bio/testimonials/venues, CTA to booking site. Linked via `[ weddings ]` in footer of main site.

- [ ] **Add a mixes / press kit page** (`mixes.html`)
  Same dark aesthetic, full-width. Sections: embedded Mixcloud sets, streaming links
  (Bandcamp, Tidal), downloadable EPK PDF. More indexed content = stronger SEO.
  Doubles as a booking pitch — couples hear the music before reaching out.

- [ ] **Add an FAQ page** (`faq.html`)
  Single-column, same type system. Answers: "How far in advance?", "Do you take requests?",
  "Do you travel?", "Do you play live instruments at events?", "What equipment do you use?"
  Ranks for long-tail queries. Removes friction from the inquiry process.

- [ ] **Venue name-drops in SEO bio**
  Add 4–5 Austin venue names to the existing `.seo-bio` paragraph in `index.html`.
  Google associates venue names with Sterling's name — improves "wedding DJ at The Driskill" searches.
  Sterling confirms which venues to include.

- [ ] **Update `sitemap.xml` `<lastmod>`** after any significant content changes.
  Signals freshness to Google crawlers.

---

## ♿ ACCESSIBILITY

- [ ] **Focus trap in sound tray**
  When `#info-tray` is open, `Tab` should cycle within it (not escape to background content).
  Standard implementation: capture `Tab` keydown, wrap last focusable → first focusable.

- [ ] **`aria-live` region for audio**
  A `.visually-hidden` `<div aria-live="polite" id="audio-announce">` that JS updates when
  a tune starts: "Now playing: Drift." Screen reader users stay informed of audio state.

- [x] **Descriptive egg `aria-label`s**
  Change `aria-label="Play"` to specific labels: `aria-label="Play Drift"`, `aria-label="Play Chord"`,
  etc. on each egg button. More meaningful to screen reader users than a generic "Play."

---

## ⚡ PERFORMANCE

- [ ] **Self-host Google Fonts**
  Download Instrument Serif, Syne variable, and VT323 (woff2 files, ~150KB total).
  Serve from `/assets/fonts/`. Replace `<link>` tags with `@font-face` in `styles.css`.
  Eliminates third-party DNS lookup + CDN dependency. Faster, more private, works fully offline.

- [ ] **Inline critical CSS**
  Above-the-fold styles (body background, artist-name font-size, main layout flex) inlined
  in `<head>`. Rest of `styles.css` loads normally. Measurable LCP improvement on slow connections.

- [ ] **`font-display: optional` for VT323**
  VT323 is decorative — used only for the pixel-font labels and tags.
  `font-display: optional` means it won't delay layout or cause CLS if not yet cached.
  Change from the default `swap` in the Google Fonts URL.

---

## ⚪ LOW — Stretch Goals

- [x] **Service worker** for offline caching (trivial for single-page, fast repeat loads)
- [ ] **Video loop background** — short autoplay-muted clip behind the name. Cinematic.
- [ ] **Inline SVG path animation** — the name "draws" in like a signature on load.
  Requires tracing Instrument Serif italic letterforms as `<path>` data (Figma or opentype.js).
  High effort, very high impact.
- [ ] **WebGL audio-reactive background** — GLSL shader replacing the CSS sine wave.
  Driven by `AnalyserNode` frequency data from whichever egg tune is playing. Three.js or raw WebGL.
- [ ] **Mixcloud "now playing"** — fetch Sterling's most recent track via Mixcloud API.
  Display as a live ASCII block in the flash pool. Adds an always-current quality to the page.
- [ ] **Venue-specific landing pages** — `/austin-wedding-dj.html`, `/san-antonio-wedding-dj.html`.
  City-specific copy + structured data. Multiplies Google ranking surface significantly.
