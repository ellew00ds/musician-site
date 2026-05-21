# Sterling Steffen — Official Site

Minimal portfolio site for Sterling Steffen, Austin-based DJ and musician.  
Pure static HTML/CSS/JS — no framework, no build step, no dependencies.

---

## File Structure

```
sterling-site/
├── index.html        Main page (only page — this is a single-page site)
├── css/
│   └── styles.css    All visual styles, design tokens, animations
├── js/
│   └── main.js       Audio easter eggs, cursor trail, ASCII flash, and all interactive effects
├── .gitignore        Tells Git which files to ignore
└── README.md         You are here
```

---

## Getting Started

No install, no build. Just open the file.

```bash
# Option 1 — double-click index.html in Finder

# Option 2 — open from the terminal
open index.html

# Option 3 — local dev server (avoids any browser file:// quirks)
npx serve .
# or
python3 -m http.server 8080
```

---

## Before Going Live — Fill In the Placeholders

Search for the strings below in the project and replace each one with real values.

| What | File | Placeholder to replace | How to find the real value |
|---|---|---|---|
| Booking link | `index.html` | `https://example.com/booking` | The URL of your booking form or contact page |
| Bandcamp social link | `index.html` | `href="#"` (first `.social` anchor) | Your Bandcamp artist page URL |
| Tidal social link | `index.html` | `href="#"` (second `.social` anchor) | Your Tidal artist page URL |
| Mixcloud social link | `index.html` | `href="#"` (third `.social` anchor) | Your Mixcloud profile URL |
| Booking email | `index.html` | `mailto:booking@example.com` | Your real booking email |
| Canonical URL | `index.html` | `https://sterlingsteffen.com/` | Your actual domain (already correct if domain is live) |
| OG image | `index.html` | *(the `og:image` meta tag is missing)* | Add a press photo URL for social sharing previews |
| JSON-LD sameAs | `index.html` | *(see JSON-LD block at bottom of file)* | Add real social URLs once live |

---

## Easter Eggs & Sound System

The site has seven hidden interactive spots that each play a different synthesized sound (Web Audio API — no external files needed):

| Spot | How to find it | Sound |
|---|---|---|
| Artist name | Click the name "Sterling" | Drift — ambient arpeggio in A minor |
| "·" separator | Click the dot between "Austin · TX" | Ping — bright crystal sequence |
| Bottom-right ○ | Click the faint ○ in the corner | Kick — four-on-the-floor drum + bass |
| Top-left invisible | Click the top-left corner | Static — filtered noise burst |
| Booking CTA | **Triple-click** the Book button | Arp — fast pentatonic run |
| Thin rule | Click the horizontal line under the name | Chord — sustained Am9 |
| Footer ✦ | Click the faint star after the social icons | Bell — resonant bell tone |

**Sound tray:** The `∿` glyph in the bottom-left opens a menu where you can play any sound directly.

**Keyboard:** Pressing Space (when no input is focused) plays a random sound.

**Idle hint:** After 30 seconds of inactivity, all egg spots briefly pulse once — a whisper that secrets exist.

---

## Deploying

### Netlify (easiest)
Drag the `sterling-site` folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Done.

### Vercel
```bash
npx vercel
```

### GitHub Pages
Push to a repo, then go to **Settings → Pages → Deploy from branch → main / (root)**.

---

## Design Notes

The aesthetic is intentional: dark, minimal, typographic. Key decisions:

- **Syne** (sans-serif) for UI text — wide, geometric, slightly odd. Good for headers.
- **Instrument Serif italic** for the last name — elegant contrast to Syne.
- **Film grain overlay** — a `body::before` pseudo-element with an SVG noise filter. No image file needed. Adds texture and depth without breaking the minimal vibe.
- **Warm gradient** on the name — cream/ivory tones instead of pure silver; feels warmer and more organic.
- **CSS custom properties** — all colors and spacing live in `:root` at the top of `styles.css`. Change a few variables to retheme the whole site.
