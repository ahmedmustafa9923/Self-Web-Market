# Code Rendering Studio

Premium digital agency website — Lombard, IL.

## Project Structure

```
crs-project/
├── index.html              # Main HTML — all pages live here (SPA)
├── css/
│   ├── base.css            # CSS variables, reset, root styles
│   ├── layout.css          # Burgers, sidebars, overlay, float CTA, page animations
│   ├── home.css            # Hero section, stats bar, shared section styles
│   ├── components.css      # Models, pricing, AI chat, calendar, testimonials, contact
│   ├── payments.css        # Payment QR card styles
│   ├── about.css           # About/team, inquiry & booking flow, confirmation
│   └── creative.css        # Creative studio, creative models, creative pricing + all responsive breakpoints
├── js/
│   ├── utils.js            # Helpers (g, on, cls), custom cursor — opens the IIFE
│   ├── navigation.js       # Sidebar open/close, page routing, left & right nav dropdowns
│   ├── pricing.js          # Pricing tabs, monthly/annual toggle, creative pricing toggle
│   ├── ai.js               # AI chat widget — messages, typing indicator, quick buttons
│   ├── calendar.js         # Main booking calendar — date/time pick, confirm, cancel, reset
│   ├── contact.js          # Video player, contact form submit, about page links
│   ├── inquiry.js          # Full inquiry flow — questionnaire, appointment, payment, contract
│   ├── payments.js         # QR code generation via qrcode.js, copy-link feature
│   └── init.js             # renderCal() init call — closes the IIFE
└── assets/                 # Images, icons, fonts (add as needed)
```

## How It Works

This is a **single-page application** (SPA) — all sections live in `index.html` as `<div class="page">` blocks. JavaScript swaps the `.on` class to show/hide pages with no server routing needed.

## Running Locally

No build step required. Just open `index.html` in a browser:

```bash
# Option 1 — Direct open
open index.html

# Option 2 — Local server (recommended, avoids CORS on some browsers)
npx serve .
# or
python3 -m http.server 3000
```

Then visit `http://localhost:3000`

## Testing on Devices

| Device | How to test |
|---|---|
| iPhone / iPad | Use Safari → File → Open, or run local server and visit on device |
| Apple Watch | Pair with iPhone, open Safari on watch and navigate to local IP |
| Chrome DevTools | F12 → Toggle device toolbar → select iPhone 14, iPad, etc. |
| BrowserStack | Upload and test live across 3000+ real devices |

## Deploying to GitHub Pages

```bash
# 1. Create repo on github.com first, then:
git init
git add .
git commit -m "Initial commit — Code Rendering Studio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/code-rendering-studio.git
git push -u origin main

# 2. Enable GitHub Pages:
# GitHub repo → Settings → Pages → Source: Deploy from branch → main → / (root)
# Your site will be live at: https://YOUR_USERNAME.github.io/code-rendering-studio/
```

## Before Going Live

- [ ] Replace Stripe `cs_live_` session IDs with real ones from your Stripe dashboard
- [ ] Register Zelle merchant account for a verified deep-link
- [ ] Set up a real domain (Namecheap / Google Domains) and point DNS to your host
- [ ] Add SSL certificate (free via Cloudflare or Let's Encrypt)
- [ ] Set up a backend (Node.js / Supabase) to actually store form submissions and bookings
- [ ] Connect email via SendGrid or Resend to send booking confirmations

## Tech Stack

- Pure HTML5 / CSS3 / Vanilla JS — zero frameworks, zero build tools
- [QRCode.js](https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js) — QR code generation
- [Google Fonts](https://fonts.google.com) — Bebas Neue + Outfit
- Fluid responsive — iPhone SE through iPad Pro 13", Apple Watch minimal mode

## Contact

**Code Rendering Studio**  
616 South Edson Ave, Lombard, IL 60148  
+1 (630) 335-3342  
coderenderingstudio@gmail.com
