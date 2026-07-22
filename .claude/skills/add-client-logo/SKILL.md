---
name: add-client-logo
description: >-
  Add a new client/entity logo to the flow+ homepage "Clients & Partners"
  moving strip and ship it live. Use whenever the user drops, attaches, or
  points at a logo image for a new client/partner and wants it on the strip.
  Triggers on "add this client logo", "new client logo", "put this logo on the
  site", "add <entity> to clients", "أضف شعار العميل". Applies the same
  treatment as the existing logos (trim → transparent white-tint → strip) and
  deploys to production.
---

# Add a client logo to the homepage strip (and deploy)

Adds one (or several) client/entity logos to the `#clients` moving strip on the
flow+ site, treated identically to the existing logos, then deploys live.

## How the strip works

- The strip is **data-driven**: `assets/clients/clients.json` is the source of
  truth. `scripts/build_clients.py` regenerates the HTML between the
  `<!-- CLIENTS:START -->` / `<!-- CLIENTS:END -->` markers in `index.html`
  (each logo twice — set A + an `aria-hidden` set B — for a seamless loop).
- Logos are **tinted white in CSS** (`filter: brightness(0) invert(1)`,
  Treatment A) and shown directly on the dark strip. So each logo file **must
  have a transparent background** or it renders as a white block.
- Processed logos live at `assets/clients/<slug>.png`.

## Steps

1. **Get the file locally.** If the user attached it, it's under
   `/root/.claude/uploads/.../<name>`. If they gave a URL, try to download it;
   if the egress proxy returns 403 (`curl -sS "$HTTPS_PROXY/__agentproxy/status"`
   shows blocked hosts), ask them to attach the file directly — do not route
   around a policy denial.

2. **Pick a slug + names.** Kebab-case `slug` (e.g. `dubai-culture`). Decide:
   - `alt` — full accessible name (EN, or the primary name).
   - `fallback` — short text shown only if the image 404s.
   - `ar` — `true` if the fallback text is Arabic (adds RTL + Cairo font).

3. **Treat the image:**
   ```bash
   python3 scripts/process_logo.py <input_file> <slug>
   ```
   - **Background removal is automatic.** If the logo arrives on a solid
     background (no transparency), the script flood-fills from the edges to key
     it out — so only the border-connected background is removed, not
     same-coloured areas inside the logo. Tune with `--bg-tol N` (default 36)
     if it takes too much/too little; `--no-remove-bg` disables it.
   - If it's a **composite** and the user wants only part of it, first find the
     crop rows (inspect with Pillow, like the youth-councils case) and pass
     `--crop-rows A-B`.
   - If the script still **warns it's opaque** (logo colour ≈ background, so the
     flood-fill bailed for safety), ask the user for a transparent PNG/SVG or
     adjust `--bg-tol`.

4. **Register it** — add an object to `assets/clients/clients.json`
   (order = display order):
   ```json
   { "slug": "dubai-culture", "file": "dubai-culture.png",
     "alt": "Dubai Culture", "fallback": "Dubai Culture", "ar": false }
   ```

5. **Rebuild the strip:**
   ```bash
   python3 scripts/build_clients.py
   ```

6. **(Optional) preview.** If the user wants to see it first, build a
   self-contained preview (base64-embed the PNGs into a small HTML mimicking the
   strip) and send it with SendUserFile. If they said "put it up right away",
   skip this.

7. **Commit + deploy live.** No CSS change, so no cache bump needed.
   ```bash
   git add -A && git commit -m "Add <entity> logo to clients strip"
   git push origin claude/homepage-updates-website-fixes-fqsjf9
   git fetch origin main && git checkout -B main origin/main
   git merge --ff-only claude/homepage-updates-website-fixes-fqsjf9
   git push origin main            # Railway auto-builds from main
   git checkout claude/homepage-updates-website-fixes-fqsjf9
   ```
   Use the branch that is current for the session if it differs from the one
   above. Then tell the user it's live and to hard-refresh.

## Notes

- Only add logos the user is authorised to display (these are flow+ clients).
- To **remove or reorder**, edit `clients.json` and re-run `build_clients.py`.
- Requires Pillow: `pip install Pillow` (already used in this repo).
