# Task 6 Report — Seed hidden post + sitemap entry

## Token check
`grep -c '__' blog/posts/ai-workshops-uae-guide.html` → `0` (all `__TOKEN__` placeholders filled).

## Word count
Article body ≈ 800 words (target 700–900), covering: is it worth it, what happens in a good workshop, in-house vs. flow+, how to choose a provider, and what "worth it" looks like a month later.

## FAQPage JSON-LD
Built a real `FAQPage` block with 4 Q/A pairs, each matching an on-page `<h2>` and its paragraph verbatim in substance:
1. Are AI workshops actually worth it, or just hype?
2. What actually happens in a good AI workshop?
3. In-house training vs. bringing in flow+ — which is right?
4. How do you choose an AI workshop provider in the UAE?

## posts.json
Prepended (array was empty) the post entry with slug `ai-workshops-uae-guide`, date `2026-07-22`, matching the plan's exact schema/content.

## sitemap.xml
Added before `</urlset>`:
`<url><loc>https://flowplus.ae/blog/ai-workshops-uae-guide</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`

## End-to-end verification (port 3000, node_modules present)
- `curl .../blog/ai-workshops-uae-guide` → `post 200`
- `curl .../blog` contains "blog" → `index ok`
- Node JSON.parse over all `application/ld+json` blocks (BlogPosting, FAQPage, BreadcrumbList) → `schema ok`

## Not-in-nav check
`grep -c 'ai-workshops-uae-guide' index.html` → `0` (post is live/indexable but not linked from the homepage).

## Commit
`b13d367022521ca544e1208a52c7617ace4dd1db` — "feat(blog): add seed hidden post (unlisted, indexable) + sitemap entry" on branch `feat/seo-aeo-blog-engine`, with Co-Authored-By trailer.
