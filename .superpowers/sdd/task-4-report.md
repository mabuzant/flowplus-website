# Task 4: Homepage AEO FAQ block + FAQPage JSON-LD

## Changes (index.html only)

1. **FAQPage JSON-LD** — added a third `<script type="application/ld+json">` block immediately before `</head>`, after the existing Organization and WebSite blocks. Contains 4 Q&A pairs whose `acceptedAnswer.text` matches the visible FAQ section text verbatim.
2. **Visible FAQ section** — added `<section id="faq" class="section section-alt">` (matches existing section-wrapper convention, e.g. the `#about` section) just before the bottom `<script src="image-slot.js">` tag, after `</body>`'s footer. Contains `<h2>flow+ — Frequently Asked Questions</h2>` and four `.faq-item` blocks each with `<h3>` question + `<p>` answer. No `<h1>` added — page's single `<h1>` (hero brand mark) is untouched.
3. **Nav link `#faq`** — added `<a href="#faq"><span class="lang-en">FAQ</span><span class="lang-ar">الأسئلة</span></a>` to both `.nav-links` (desktop) and `.mobile-menu`, positioned between the `#flowgrid` and `#contact` links, mirroring the existing EN/AR span pattern.

## Verification output

```
$ node -e "...JSON.parse each ld+json block..."
ok

$ grep -c '<h1' index.html
1

$ (node server.js &); sleep 1; curl -s localhost:3000/ | grep -c 'id="faq"'; pkill -f "node server.js"
[flow+] listening on 3000 · admin pin (default) · ip-limit false
1
```

All JSON-LD blocks parse (now 3 blocks: Organization, WebSite, FAQPage), exactly one `<h1>` remains on the page, and `id="faq"` appears exactly once in the served HTML.

## Commit

```
304f196 feat(aeo): add homepage FAQ section with FAQPage schema
```

Branch: `feat/seo-aeo-blog-engine`. 1 file changed (index.html), 36 insertions.
