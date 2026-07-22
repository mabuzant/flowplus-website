# flow+ SEO / AEO + Auto-Blog Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the flow+ static site a full technical-SEO + AEO foundation, a file-based `/blog`, a seed hidden post, and a weekly local auto-writing engine that commits and redeploys.

**Architecture:** Static HTML (`index.html`, `founder.html`) served by Express (`server.js`). SEO = meta/OG/JSON-LD injected into pages + new `/robots.txt` and `/sitemap.xml` routes. Blog = `blog/posts/<slug>.html` rendered from a shared template, indexed by `blog/posts.json`. Engine = `.claude/blog-engine/` scripts run headless by the Claude CLI, driven by a weekly local scheduler.

**Tech Stack:** Node 18+, Express 4, vanilla HTML/CSS/JS, JSON-LD schema.org, Claude CLI (headless, subscription — no API keys), git + Railway auto-deploy.

## Global Constraints

- Canonical domain: `https://flowplus.ae` (https, no trailing slash on canonical roots) — copy verbatim into every canonical/OG/sitemap URL.
- No paid API keys anywhere. All automation uses the Claude subscription CLI headless.
- Brand: name is `flow+`; fonts Space Grotesk + Cairo; dark theme via existing `css/flow-plus.css`.
- Bilingual EN/AR; language toggled client-side; `<html lang="en">` stays.
- Organization `sameAs`: `https://instagram.com/itsflowplus`, `https://www.linkedin.com/company/flow-plus-ae/`.
- OG image: `assets/flowplus-og.png` (1200×630).
- Exactly one `<h1>` per page; descriptive `alt` on all images.
- Every commit ends with the Co-Authored-By trailer for Claude.
- Deploy is `git push origin main` → Railway auto-redeploy. Never push without the user's go-ahead during interactive build; the engine pushes autonomously by design.

---

### Task 1: SEO head layer + Organization/WebSite JSON-LD on `index.html`

**Files:**
- Modify: `index.html` (`<head>`, lines ~4–24)

**Interfaces:**
- Produces: canonical head pattern (title/description/canonical/robots/OG/Twitter block + `Organization` and `WebSite` JSON-LD) reused by later tasks.

- [ ] **Step 1: Add the meta + social block** inside `<head>` after the existing `<title>` line. Replace the current `<title>flow+ — Creative Technology Company</title>` and insert immediately after it:

```html
<meta name="description" content="flow+ is a creative technology company blending AI, design, and engineering — running hands-on AI workshops across the UAE and MENA and building AI-driven products for global brands.">
<meta name="keywords" content="creative technology company, AI creative studio, AI workshop Dubai, AI training UAE, generative AI agency MENA">
<link rel="canonical" href="https://flowplus.ae/">
<meta name="robots" content="index, follow, max-image-preview:large">
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="flow+">
<meta property="og:title" content="flow+ — Creative Technology Company">
<meta property="og:description" content="AI, design, and engineering under one roof. Hands-on AI workshops across the UAE & MENA, plus AI-driven products for global brands.">
<meta property="og:url" content="https://flowplus.ae/">
<meta property="og:image" content="https://flowplus.ae/assets/flowplus-og.png">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="ar_AR">
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="flow+ — Creative Technology Company">
<meta name="twitter:description" content="AI, design, and engineering under one roof. Hands-on AI workshops across the UAE & MENA.">
<meta name="twitter:image" content="https://flowplus.ae/assets/flowplus-og.png">
```

- [ ] **Step 2: Add JSON-LD** immediately before `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "flow+",
  "alternateName": "flowplus",
  "url": "https://flowplus.ae/",
  "logo": "https://flowplus.ae/assets/logo.png",
  "description": "Creative technology company blending AI, design, and engineering. AI workshops across the UAE & MENA and AI-driven products for global brands.",
  "areaServed": ["AE", "SA", "Middle East", "Worldwide"],
  "sameAs": [
    "https://instagram.com/itsflowplus",
    "https://www.linkedin.com/company/flow-plus-ae/"
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "flow+",
  "url": "https://flowplus.ae/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://flowplus.ae/blog/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

- [ ] **Step 3: Verify the head parses.** Run:

```bash
node -e "const h=require('fs').readFileSync('index.html','utf8'); const m=[...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)]; m.forEach(x=>JSON.parse(x[1])); console.log('OK', m.length, 'blocks')"
```

Expected: `OK 2 blocks`

- [ ] **Step 4: Verify single h1.** Run: `grep -c '<h1' index.html` — Expected: `1`. If not 1, demote extra `<h1>` tags to `<h2>` (record which in the commit body).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(seo): add meta, OG, Twitter, Organization + WebSite JSON-LD to homepage

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: SEO head layer + Person/BreadcrumbList JSON-LD on `founder.html`

**Files:**
- Modify: `founder.html` (`<head>`)

**Interfaces:**
- Consumes: head pattern from Task 1.
- Produces: `Person` node (founder) that Task 1's Organization can reference via `founder` in a future pass; breadcrumb pattern reused by blog.

- [ ] **Step 1: Read the current founder head.** Run: `sed -n '1,20p' founder.html` and note the existing `<title>` text and the founder's real name/role from the page body (`grep -i -m3 'founder\|<h1' founder.html`).

- [ ] **Step 2: Add meta block** after the `<title>` in `founder.html` (mirror Task 1, adjust copy):

```html
<meta name="description" content="Meet the founder of flow+ — the creative technologist behind flow+'s AI workshops and AI-driven products across the UAE and MENA.">
<link rel="canonical" href="https://flowplus.ae/founder">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="flow+">
<meta property="og:title" content="flow+ — Founder">
<meta property="og:description" content="The creative technologist behind flow+'s AI workshops and products.">
<meta property="og:url" content="https://flowplus.ae/founder">
<meta property="og:image" content="https://flowplus.ae/assets/flowplus-og.png">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="flow+ — Founder">
<meta name="twitter:image" content="https://flowplus.ae/assets/flowplus-og.png">
```

- [ ] **Step 3: Add JSON-LD** before `</head>`. Replace `FOUNDER_NAME` / `FOUNDER_ROLE` with the real values found in Step 1 (do not leave placeholders):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "FOUNDER_NAME",
  "jobTitle": "FOUNDER_ROLE",
  "worksFor": { "@type": "Organization", "name": "flow+", "url": "https://flowplus.ae/" },
  "url": "https://flowplus.ae/founder"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://flowplus.ae/" },
    { "@type": "ListItem", "position": 2, "name": "Founder", "item": "https://flowplus.ae/founder" }
  ]
}
</script>
```

- [ ] **Step 4: Verify parse + single h1.** Run:

```bash
node -e "const h=require('fs').readFileSync('founder.html','utf8'); [...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)].forEach(x=>JSON.parse(x[1])); console.log('json ok')" && grep -c '<h1' founder.html
```

Expected: `json ok` then `1`. Confirm no literal `FOUNDER_NAME` remains: `grep -c FOUNDER_NAME founder.html` → Expected `0`.

- [ ] **Step 5: Commit**

```bash
git add founder.html
git commit -m "feat(seo): add meta, OG, Person + Breadcrumb JSON-LD to founder page

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: `robots.txt`, `sitemap.xml`, and Express routes

**Files:**
- Create: `robots.txt`
- Create: `sitemap.xml`
- Modify: `server.js` (add routes before the static + catch-all handlers, i.e. before line ~190)

**Interfaces:**
- Consumes: nothing.
- Produces: `/robots.txt` and `/sitemap.xml` served with correct content types; `sitemap.xml` is the file the blog engine (Task 8) rewrites.

- [ ] **Step 1: Create `robots.txt`:**

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: Applebot-Extended
Allow: /

Sitemap: https://flowplus.ae/sitemap.xml
```

- [ ] **Step 2: Create `sitemap.xml`** (initial — home, founder, blog index):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://flowplus.ae/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://flowplus.ae/founder</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://flowplus.ae/blog</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
</urlset>
```

- [ ] **Step 3: Add routes to `server.js`** immediately before `app.use(express.static(ROOT, ...))` (~line 190):

```js
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').sendFile(path.join(ROOT, 'robots.txt'));
});
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').sendFile(path.join(ROOT, 'sitemap.xml'));
});
```

If `path` is not already required at the top of `server.js`, add `const path = require('path');` (check first: `grep -n "require('path')" server.js`). Confirm `ROOT` is defined (`grep -n "ROOT" server.js`); reuse the existing constant.

- [ ] **Step 4: Start server and verify.** Run:

```bash
(node server.js &) ; sleep 1 ; \
curl -s -o /dev/null -w "robots %{http_code} %{content_type}\n" localhost:3000/robots.txt ; \
curl -s -o /dev/null -w "sitemap %{http_code} %{content_type}\n" localhost:3000/sitemap.xml ; \
pkill -f "node server.js"
```

Expected: `robots 200 text/plain...` and `sitemap 200 application/xml...`. (If the port isn't 3000, check `grep -n PORT server.js` and adjust.)

- [ ] **Step 5: Commit**

```bash
git add robots.txt sitemap.xml server.js
git commit -m "feat(seo): serve robots.txt and sitemap.xml with correct content types

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Homepage AEO FAQ block + FAQPage JSON-LD

**Files:**
- Modify: `index.html` (add a FAQ `<section>` near the end of `<body>` before `<script>`s; add FAQPage JSON-LD in `<head>`)

**Interfaces:**
- Consumes: head pattern (Task 1).
- Produces: quotable answer content + `FAQPage` schema for AEO.

- [ ] **Step 1: Find the insertion point.** Run: `grep -n 'id="contact"\|</body>\|<script' index.html | tail -8` and choose the location just before the contact section's closing or before the first bottom `<script>`.

- [ ] **Step 2: Add the visible FAQ section** (brand classes; reuse an existing section wrapper class seen in the file — check `grep -n 'class="section' index.html | head`):

```html
<section id="faq" class="section section-alt">
  <div class="container">
    <h2>flow+ — Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>What is flow+?</h3>
      <p>flow+ is a creative technology company that blends AI, design, and engineering. We run hands-on AI workshops across the UAE and MENA and build AI-driven products for global brands.</p>
    </div>
    <div class="faq-item">
      <h3>Where is flow+ based?</h3>
      <p>flow+ is based in the UAE and works with clients across MENA and worldwide.</p>
    </div>
    <div class="faq-item">
      <h3>What happens in a flow+ AI workshop?</h3>
      <p>flow+ AI workshops are hands-on sessions where teams learn to use generative AI for real work — writing, design, automation, and product ideas — and leave with practical workflows they can apply the next day.</p>
    </div>
    <div class="faq-item">
      <h3>Is an AI workshop worth it for my team?</h3>
      <p>Yes, if your team wants to move from experimenting with AI to using it reliably. flow+ workshops focus on repeatable workflows and measurable output rather than hype.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add FAQPage JSON-LD** before `</head>` (answers must match the visible text verbatim):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"What is flow+?","acceptedAnswer":{"@type":"Answer","text":"flow+ is a creative technology company that blends AI, design, and engineering. We run hands-on AI workshops across the UAE and MENA and build AI-driven products for global brands."}},
    {"@type":"Question","name":"Where is flow+ based?","acceptedAnswer":{"@type":"Answer","text":"flow+ is based in the UAE and works with clients across MENA and worldwide."}},
    {"@type":"Question","name":"What happens in a flow+ AI workshop?","acceptedAnswer":{"@type":"Answer","text":"flow+ AI workshops are hands-on sessions where teams learn to use generative AI for real work — writing, design, automation, and product ideas — and leave with practical workflows they can apply the next day."}},
    {"@type":"Question","name":"Is an AI workshop worth it for my team?","acceptedAnswer":{"@type":"Answer","text":"Yes, if your team wants to move from experimenting with AI to using it reliably. flow+ workshops focus on repeatable workflows and measurable output rather than hype."}}
  ]
}
</script>
```

- [ ] **Step 4: Add a nav link** to `#faq` in both the desktop `.nav-links` and `.mobile-menu` (mirror the existing `<a href="#contact">` pattern with EN/AR spans: `FAQ` / `الأسئلة`).

- [ ] **Step 5: Verify.** Run: `node -e "const h=require('fs').readFileSync('index.html','utf8'); [...h.matchAll(/application\/ld\+json\">([\s\S]*?)<\/script>/g)].forEach(x=>JSON.parse(x[1])); console.log('ok')"` → Expected `ok`. Then visually load: `(node server.js &) ; sleep 1 ; curl -s localhost:3000/ | grep -c 'id="faq"' ; pkill -f "node server.js"` → Expected `1`.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(aeo): add homepage FAQ section with FAQPage schema

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Blog template, index page, `posts.json`, and blog routes

**Files:**
- Create: `blog/index.html` (blog listing)
- Create: `blog/posts.json` (manifest, starts as `[]`)
- Create: `blog/_template.html` (reference template for the engine and Task 6)
- Modify: `server.js` (add `/blog` and `/blog/:slug` routes before static/catch-all)

**Interfaces:**
- Consumes: head pattern (Task 1), routes location (Task 3).
- Produces: `blog/posts.json` schema `[{slug,title,date,excerpt,tags,lang}]`; `/blog` route serving `blog/index.html`; `/blog/:slug` route serving `blog/posts/<slug>.html`; `blog/_template.html` consumed by Task 6 and Task 8.

- [ ] **Step 1: Create `blog/posts.json`:**

```json
[]
```

- [ ] **Step 2: Create `blog/_template.html`** — a full standalone post skeleton with `__PLACEHOLDER__` tokens the engine fills. Include: the same fonts + `../css/flow-plus.css` link, meta/OG/canonical using `https://flowplus.ae/blog/__SLUG__`, and `BlogPosting` + `FAQPage` + `BreadcrumbList` JSON-LD. Tokens: `__TITLE__`, `__DESCRIPTION__`, `__SLUG__`, `__DATE_ISO__`, `__BODY_HTML__`, `__FAQ_JSONLD__`. Body wrapper:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__ — flow+</title>
  <meta name="description" content="__DESCRIPTION__">
  <link rel="canonical" href="https://flowplus.ae/blog/__SLUG__">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="article">
  <meta property="og:title" content="__TITLE__">
  <meta property="og:description" content="__DESCRIPTION__">
  <meta property="og:url" content="https://flowplus.ae/blog/__SLUG__">
  <meta property="og:image" content="https://flowplus.ae/assets/flowplus-og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/flow-plus.css?v=8">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BlogPosting","headline":"__TITLE__","description":"__DESCRIPTION__","datePublished":"__DATE_ISO__","dateModified":"__DATE_ISO__","author":{"@type":"Organization","name":"flow+"},"publisher":{"@type":"Organization","name":"flow+","logo":{"@type":"ImageObject","url":"https://flowplus.ae/assets/logo.png"}},"mainEntityOfPage":"https://flowplus.ae/blog/__SLUG__","image":"https://flowplus.ae/assets/flowplus-og.png"}
  </script>
  __FAQ_JSONLD__
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://flowplus.ae/"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://flowplus.ae/blog"},{"@type":"ListItem","position":3,"name":"__TITLE__","item":"https://flowplus.ae/blog/__SLUG__"}]}
  </script>
</head>
<body>
  <nav class="nav"><div class="nav-inner"><a href="../" class="nav-logo"><span class="brand"><span class="b-flow">flow</span><span class="b-plus">+</span></span></a><a href="./" style="color:#fff;text-decoration:none">Blog</a></div></nav>
  <article class="container" style="max-width:760px;margin:0 auto;padding:6rem 1.5rem">
    <h1>__TITLE__</h1>
    <p style="opacity:.6"><time datetime="__DATE_ISO__">__DATE_ISO__</time></p>
    __BODY_HTML__
  </article>
</body>
</html>
```

- [ ] **Step 3: Create `blog/index.html`** — listing page with the flow+ head (title "flow+ Blog — AI, Creative Technology & Workshops", description, canonical `https://flowplus.ae/blog`, `Blog` JSON-LD) and a client script that fetches `posts.json` and renders cards:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>flow+ Blog — AI, Creative Technology & Workshops</title>
  <meta name="description" content="Insights on AI, creative technology, and hands-on AI workshops from flow+ — for teams across the UAE, MENA, and beyond.">
  <link rel="canonical" href="https://flowplus.ae/blog">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website"><meta property="og:title" content="flow+ Blog">
  <meta property="og:url" content="https://flowplus.ae/blog"><meta property="og:image" content="https://flowplus.ae/assets/flowplus-og.png">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/flow-plus.css?v=8">
</head>
<body>
  <nav class="nav"><div class="nav-inner"><a href="../" class="nav-logo"><span class="brand"><span class="b-flow">flow</span><span class="b-plus">+</span></span></a></div></nav>
  <main class="container" style="max-width:900px;margin:0 auto;padding:6rem 1.5rem">
    <h1>flow+ Blog</h1>
    <p style="opacity:.7">AI, creative technology, and workshop insights.</p>
    <div id="post-list"></div>
  </main>
  <script>
    fetch('posts.json').then(r=>r.json()).then(posts=>{
      const el=document.getElementById('post-list');
      if(!posts.length){el.innerHTML='<p style="opacity:.5">Posts coming soon.</p>';return;}
      el.innerHTML=posts.sort((a,b)=>b.date.localeCompare(a.date)).map(p=>
        `<a href="./${p.slug}" style="display:block;padding:1.5rem 0;border-bottom:1px solid rgba(255,255,255,.1);text-decoration:none;color:inherit">
          <h2 style="margin:0 0 .3rem">${p.title}</h2>
          <p style="opacity:.6;margin:0">${p.excerpt}</p>
          <small style="opacity:.4">${p.date}</small></a>`).join('');
    });
  </script>
</body>
</html>
```

- [ ] **Step 4: Add routes to `server.js`** before the static handler (after the Task 3 routes):

```js
app.get('/blog', (req, res) => res.sendFile(path.join(ROOT, 'blog', 'index.html')));
app.get('/blog/:slug', (req, res) => {
  const slug = req.params.slug.replace(/[^a-z0-9-]/gi, '');
  const file = path.join(ROOT, 'blog', 'posts', slug + '.html');
  res.sendFile(file, err => { if (err) res.status(404).sendFile(path.join(ROOT, 'blog', 'index.html')); });
});
```

Create the posts dir so the route never 500s on an empty blog: `mkdir -p blog/posts`.

- [ ] **Step 5: Verify.** Run:

```bash
mkdir -p blog/posts ; (node server.js &) ; sleep 1 ; \
curl -s -o /dev/null -w "blog %{http_code}\n" localhost:3000/blog ; \
curl -s -o /dev/null -w "missing %{http_code}\n" localhost:3000/blog/nope ; \
node -e "JSON.parse(require('fs').readFileSync('blog/posts.json'));console.log('posts.json ok')" ; \
pkill -f "node server.js"
```

Expected: `blog 200`, `missing 404`, `posts.json ok`.

- [ ] **Step 6: Commit**

```bash
git add blog server.js
git commit -m "feat(blog): add blog index, post template, posts.json manifest, and routes

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Seed hidden post + sitemap entry

**Files:**
- Create: `blog/posts/ai-workshops-uae-guide.html`
- Modify: `blog/posts.json`, `sitemap.xml`

**Interfaces:**
- Consumes: `blog/_template.html` tokens (Task 5), `posts.json` schema (Task 5), `sitemap.xml` (Task 3).
- Produces: one live, indexable, un-navigated post proving the pipeline.

- [ ] **Step 1: Generate the post from the template.** Copy `blog/_template.html` → `blog/posts/ai-workshops-uae-guide.html` and fill every token. Title: "Are AI Workshops Worth It? A UAE Team's Practical Guide (2026)". Slug: `ai-workshops-uae-guide`. Date: today's ISO date. Write ~700–900 words of genuine, brand-voice content answering Reddit-style questions (is it worth it, what to expect, how to pick a provider, in-house vs. flow+). Build `__FAQ_JSONLD__` as a real `FAQPage` block whose Q/A match on-page text.

- [ ] **Step 2: Confirm no tokens remain.** Run: `grep -c '__' blog/posts/ai-workshops-uae-guide.html` → Expected `0`.

- [ ] **Step 3: Append to `posts.json`:**

```json
[
  {"slug":"ai-workshops-uae-guide","title":"Are AI Workshops Worth It? A UAE Team's Practical Guide (2026)","date":"2026-07-22","excerpt":"What actually happens in an AI workshop, whether it's worth it, and how UAE teams should choose a provider.","tags":["AI workshops","UAE","training"],"lang":"en"}
]
```

- [ ] **Step 4: Add the sitemap URL** — insert before `</urlset>` in `sitemap.xml`:

```xml
  <url><loc>https://flowplus.ae/blog/ai-workshops-uae-guide</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
```

- [ ] **Step 5: Verify end to end.** Run:

```bash
(node server.js &) ; sleep 1 ; \
curl -s -o /dev/null -w "post %{http_code}\n" localhost:3000/blog/ai-workshops-uae-guide ; \
curl -s localhost:3000/blog | grep -qi blog && echo "index ok" ; \
node -e "const h=require('fs').readFileSync('blog/posts/ai-workshops-uae-guide.html','utf8');[...h.matchAll(/application\/ld\+json\">([\s\S]*?)<\/script>/g)].forEach(x=>JSON.parse(x[1]));console.log('schema ok')" ; \
pkill -f "node server.js"
```

Expected: `post 200`, `index ok`, `schema ok`. Confirm it's NOT linked in nav: `grep -c 'ai-workshops-uae-guide' index.html` → Expected `0`.

- [ ] **Step 6: Commit**

```bash
git add blog/posts/ai-workshops-uae-guide.html blog/posts.json sitemap.xml
git commit -m "feat(blog): add seed hidden post (unlisted, indexable) + sitemap entry

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: flow+ OG image asset

**Files:**
- Create: `assets/flowplus-og.png` (1200×630)

**Interfaces:**
- Consumes: nothing.
- Produces: the OG image every page references.

- [ ] **Step 1: Check for an existing source.** Run: `ls -la assets/ && file assets/logo.png`. If a usable flow+ logo/brand asset exists, compose the OG on a dark background with the `flow+` wordmark + tagline "Creative Technology Company".

- [ ] **Step 2: Generate the image.** Prefer a local, no-API-key path: an HTML→PNG render. Create a temporary `assets/_og.html` (1200×630, dark bg `#0a0a0a`, `flow+` wordmark, tagline) and screenshot it at exactly 1200×630 via the browser preview tool, saving to `assets/flowplus-og.png`. (If a headless screenshot path isn't available, use the design/canvas skill to output a 1200×630 PNG — never a paid API.)

- [ ] **Step 3: Verify dimensions.** Run: `file assets/flowplus-og.png` — Expected: `PNG image data, 1200 x 630`. Remove the temp file: `rm -f assets/_og.html`.

- [ ] **Step 4: Commit**

```bash
git add assets/flowplus-og.png
git commit -m "feat(seo): add flow+ branded 1200x630 Open Graph image

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: Blog engine — topics backlog, write-next-post workflow, sitemap regen

**Files:**
- Create: `.claude/blog-engine/topics.json`
- Create: `.claude/blog-engine/write-next-post.md`
- Create: `.claude/blog-engine/gen-sitemap.js`
- Create: `.claude/blog-engine/run.sh`
- Create: `.claude/blog-engine/logs/.gitkeep`

**Interfaces:**
- Consumes: `blog/_template.html`, `blog/posts.json`, `sitemap.xml`.
- Produces: `run.sh` (the scheduler's entry point, Task 9); `gen-sitemap.js` that rebuilds `sitemap.xml` from `posts.json` + static routes.

- [ ] **Step 1: Create `topics.json`** with ~20 researched titles covering both audiences (regional workshops + global studio) and Reddit-style intent. Shape `[{title, slug, keyword, question, audience, used:false}]`. Example first entries (fill all 20 with real, non-duplicate topics):

```json
[
  {"title":"How Agencies Actually Use AI in 2026 (Not the Hype)","slug":"how-agencies-use-ai-2026","keyword":"how agencies use AI","question":"how do agencies actually use AI","audience":"global","used":false},
  {"title":"AI Workshop vs. Online Course: What UAE Teams Should Pick","slug":"ai-workshop-vs-online-course","keyword":"AI workshop vs course","question":"is an AI workshop better than an online course","audience":"regional","used":false}
]
```

- [ ] **Step 2: Create `gen-sitemap.js`** — reads `blog/posts.json`, writes `sitemap.xml` with the three static URLs + one entry per post:

```js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'blog', 'posts.json'), 'utf8'));
const base = 'https://flowplus.ae';
const urls = [
  `  <url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  `  <url><loc>${base}/founder</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
  `  <url><loc>${base}/blog</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
  ...posts.map(p => `  <url><loc>${base}/blog/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`)
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log('sitemap regenerated with', posts.length, 'posts');
```

- [ ] **Step 3: Verify `gen-sitemap.js`.** Run: `node .claude/blog-engine/gen-sitemap.js` — Expected: `sitemap regenerated with 1 posts` and `git diff --stat sitemap.xml` shows it still contains the seed post. Restore if needed: `git checkout sitemap.xml` only if the diff is wrong.

- [ ] **Step 4: Create `write-next-post.md`** — the headless instruction the CLI runs. It must, in order: (1) read `.claude/blog-engine/topics.json`, pick the first `used:false` topic; if none, exit 0 with a log line; (2) copy `blog/_template.html`, fill all tokens, write 700–1000 words brand-voice content + a real `FAQPage` block; (3) write `blog/posts/<slug>.html`; (4) prepend the post to `blog/posts.json`; (5) set that topic `used:true`; (6) run `node .claude/blog-engine/gen-sitemap.js`; (7) `git add -A && git commit` (Co-Authored-By trailer) `&& git push origin main`. Include the exact brand-voice rules and the "no leftover `__` tokens" check. State explicitly: no paid APIs; use only the local files.

- [ ] **Step 5: Create `run.sh`:**

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
TS="$(date +%Y-%m-%d_%H-%M-%S)"
LOG=".claude/blog-engine/logs/${TS}.log"
echo "== blog-engine run ${TS} ==" | tee -a "$LOG"
claude -p "$(cat .claude/blog-engine/write-next-post.md)" --permission-mode acceptEdits >> "$LOG" 2>&1
echo "== done ${TS} ==" | tee -a "$LOG"
```

Make executable: `chmod +x .claude/blog-engine/run.sh`. (Confirm the CLI invocation flag with `claude --help | grep -i print` and adjust `-p` if the installed version differs; the intent is non-interactive headless run.)

- [ ] **Step 6: Dry-run guard test.** Temporarily set all topics `used:true` and run `bash .claude/blog-engine/run.sh`; confirm it logs "no unused topics" and makes no commit (`git status --porcelain` clean). Then revert topics.json (`git checkout .claude/blog-engine/topics.json`).

- [ ] **Step 7: Commit**

```bash
git add .claude/blog-engine
git commit -m "feat(engine): add topic backlog, write-next-post workflow, sitemap regen, run.sh

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9: Weekly local scheduler

**Files:**
- Create: `.claude/blog-engine/com.flowplus.blog.plist` (launchd, macOS — user confirmed local laptop)
- Create: `.claude/blog-engine/SCHEDULER.md` (install/uninstall instructions)

**Interfaces:**
- Consumes: `run.sh` (Task 8).
- Produces: a weekly local trigger.

- [ ] **Step 1: Create the launchd plist** (runs Mondays 09:00; absolute path to `run.sh`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.flowplus.blog</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>/Users/mabuzant/Claude Code/Flowplus Online/flow-plus-website/.claude/blog-engine/run.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict><key>Weekday</key><integer>1</integer><key>Hour</key><integer>9</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>/tmp/flowplus-blog.out</string>
  <key>StandardErrorPath</key><string>/tmp/flowplus-blog.err</string>
</dict>
</plist>
```

- [ ] **Step 2: Create `SCHEDULER.md`** documenting: copy plist to `~/Library/LaunchAgents/com.flowplus.blog.plist`, `launchctl load` it, verify with `launchctl list | grep flowplus`, run once now with `launchctl start com.flowplus.blog`, and how to `unload`. Note the dependency: `claude` CLI in PATH and working `git push` creds (SSH or cached HTTPS) so the engine can publish. Alternative noted: the `scheduled-tasks` MCP `create_scheduled_task` for users who prefer it over launchd.

- [ ] **Step 3: Verify plist is well-formed.** Run: `plutil -lint ".claude/blog-engine/com.flowplus.blog.plist"` — Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add .claude/blog-engine/com.flowplus.blog.plist .claude/blog-engine/SCHEDULER.md
git commit -m "feat(engine): add weekly launchd scheduler plist + install docs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

- [ ] **Step 5 (manual, with user):** Install and load the launchd agent, run once to confirm a real post publishes end-to-end, then confirm Railway redeploys. This step is done together since it needs the user's machine + push creds.

---

## Final verification (after all tasks)

- [ ] Start server; `curl` `/`, `/founder`, `/blog`, `/blog/ai-workshops-uae-guide`, `/robots.txt`, `/sitemap.xml` — all expected codes.
- [ ] Paste homepage + seed-post source into Google Rich Results Test (or `node` JSON-LD parse) — Organization, WebSite, FAQPage, BlogPosting all valid.
- [ ] Confirm seed post not linked from `index.html` nav but present in `sitemap.xml`.
- [ ] `bash .claude/blog-engine/run.sh` with one unused topic produces a committed, pushed, deployed post.
- [ ] `plutil -lint` passes; scheduler documented.
