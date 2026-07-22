# Client logos (homepage "Clients & Partners" strip — Treatment A)

The strip is **data-driven**. Source of truth is `clients.json`; the homepage
markup is generated between the `CLIENTS:START/END` markers in `index.html`.

## Add a logo (the fast path)
1. `python3 scripts/process_logo.py <raw_file> <slug>` → writes
   `assets/clients/<slug>.png` (trimmed, padded, transparent).
2. Add an entry to `clients.json` (order = display order).
3. `python3 scripts/build_clients.py` → regenerates the strip.
4. Commit and deploy.

This is packaged as the **`add-client-logo`** skill (`.claude/skills/`) — just
drop a logo and ask to add it; the skill runs all of the above and ships it live.

Current entries (see `clients.json`):

| File | Client |
|------|--------|
| `aurak.png` | American University of Ras Al Khaimah (AURAK) |
| `federal-youth-authority.png` | Federal Youth Authority — الهيئة الاتحادية للشباب |
| `youth-councils.png` | مجالس الشباب — UAE Youth Councils |

## Format
- **SVG preferred** (crisp at any size). High-res **PNG with transparent
  background** also works — if you send PNG, keep the same base name
  (`aurak.png`, etc.) and I'll update the `src` extension in `index.html`.
- Logos are tinted **white** in CSS (`filter: brightness(0) invert(1)`) and
  shown directly on the dark strip at **48px height** (38px mobile), no chips.
  Transparent-background files are required for the white tint to work.
- Until a file is present, the chip gracefully shows the client's **name as
  text** (via the `onerror` fallback in the markup), so the strip is never
  broken.

Only add logos you have permission to display (these are flow+ clients).
