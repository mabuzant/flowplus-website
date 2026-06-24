# flow+ — Creative Technology Company

The flow+ brand website. Static HTML/CSS/JS, bilingual EN/AR, dark frosted-mesh design system.

## Pages

- `index.html` — main landing page (hero, services card-stack, work, Flow Grid, founder teaser, contact)
- `founder.html` — standalone founder page with scroll progress
- `brand-guidelines.html` — full brand system documentation

## Run locally

Any static server. For example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Structure

```
index.html
founder.html
brand-guidelines.html
image-slot.js         # custom element for drop-in photo placeholders
css/flow-plus.css     # design system (frosted mesh gradients, glass, brand lock)
js/flow-plus.js       # language toggle, scroll reveal, card stack, parallax
assets/logo.png       # brand wordmark
```

## Design system

- **5 frosted-mesh palettes** (`mesh-1` … `mesh-5`) — radial + conic gradients only, never linear, with a noise overlay
- **Brand weight lock** — `flow` is always `font-weight: 300`, `+` is `700`, wrapped in `.brand` with bidi isolation so it never flips in RTL
- **Cairo** for Arabic, **Space Grotesk** for English
- **WhatsApp:** `+971 55 846 1197` · **Instagram:** `@itsflowplus` · **Email:** `hello@flowplus.ae`

See `brand-guidelines.html` for the full system.

## Deploy

The repo is static. Drop it on Vercel, Netlify, GitHub Pages, or any object store. The Railway config (`railway.toml`) serves the directory via a tiny static server.
