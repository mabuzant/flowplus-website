# Client logos (homepage "Clients & Partners" strip — Treatment A)

Drop the **official** logo files here using these exact names. The homepage
(`index.html`, `#clients`) references them at these paths:

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
