# flow+ blog engine — write next post

You are running headless (non-interactive, `claude -p`) as the flow+ auto-blog engine. Follow these steps **in order**. Do not ask questions — decide and proceed. No paid APIs, no external services, no API keys: use only the files already in this repo and your own writing.

## 1. Pick a topic

Read `.claude/blog-engine/topics.json`. Find the **first** entry with `"used": false`.

- If there is **no** unused topic, print the line `no unused topics` to stdout and exit 0. Do not touch any other file. Do not commit. Do not push.
- Otherwise, keep that topic object in memory as `TOPIC` (its `title`, `slug`, `keyword`, `question`, `audience`).

## 2. Draft the post

Read `blog/_template.html` — this is the shared post shell. Copy it (in memory, not on disk yet) and fill **every** token:

- `__TITLE__` → `TOPIC.title` (used verbatim in `<title>`, OG tags, JSON-LD headline, breadcrumb, and the visible `<h1>`)
- `__DESCRIPTION__` → a single-sentence meta description (≤160 chars) that naturally includes `TOPIC.keyword`
- `__SLUG__` → `TOPIC.slug`
- `__DATE_ISO__` → today's date, `YYYY-MM-DD`
- `__FAQ_JSONLD__` → a real `<script type="application/ld+json">` block, `@type: FAQPage`, with 3–5 genuine `Question`/`Answer` pairs. The first question should closely match (or directly answer) `TOPIC.question`. Every answer must be a real, useful, specific answer — not a stub.
- `__BODY_HTML__` → the article body as semantic HTML (`<p>`, `<h2>`, `<h3>`, `<ul>`/`<li>` where useful). 700–1000 words. Do **not** duplicate the `<h1>` inside the body — the template already renders one `<h1>` for the title.

### Content requirements

- Ground the post in `TOPIC.keyword` and `TOPIC.question` — write it like a genuinely useful answer to that Reddit-style question, not keyword-stuffed filler.
- If `TOPIC.audience` is `"regional"`, write with UAE/MENA context (Abu Dhabi/Dubai references, local business norms) and reference flow+'s hands-on in-person workshops.
- If `TOPIC.audience` is `"global"`, write with a global creative-tech/AI-studio audience in mind, and reference flow+ as an AI-native creative studio.
- End the body with one short, natural paragraph inviting the reader to work with or learn from flow+ (no hard sell, no fake urgency, no invented stats or client names).

### Brand voice rules (non-negotiable)

- Confident, concise, technical-but-human. No hype, no "revolutionary," no "game-changing," no exclamation-mark energy, no emoji.
- Short paragraphs (2–4 sentences). Prefer concrete specifics over vague claims.
- Never invent client names, numbers, testimonials, or case-study results that aren't already established in this repo.
- Brand name is always `flow+` (lowercase, with the plus), never "Flow+", "FlowPlus", or "Flow Plus".
- Write in English only (the site's language toggle is client-side; do not create a separate Arabic file).

## 3. Write the post file

Write the fully-substituted HTML to `blog/posts/<TOPIC.slug>.html` (create the file; do not overwrite an existing file with the same name — if one already exists, treat this as a data error, log it, exit 1, and make no other changes).

**Before writing, verify there are zero leftover `__..__` tokens anywhere in the final HTML.** Search the fully-rendered content for the pattern `__` followed by uppercase letters/underscores followed by `__` (e.g. `__TITLE__`, `__ANYTHING__`). If any remain, you missed a substitution — fix it and re-check before writing the file. Do not write a file that still contains template tokens.

## 4. Update `blog/posts.json`

Read `blog/posts.json`. Prepend (add to the **front** of the array, so newest posts sort first) a new entry:

```json
{"slug":"<TOPIC.slug>","title":"<TOPIC.title>","date":"<today's YYYY-MM-DD>","excerpt":"<the meta description you wrote>","tags":["<2-4 relevant tags>"],"lang":"en"}
```

Write the updated array back to `blog/posts.json`, valid JSON, same formatting style as the existing file.

## 5. Mark the topic used

In `.claude/blog-engine/topics.json`, set `"used": true` on the topic object you picked in step 1. Leave every other entry untouched. Write the file back as valid JSON.

## 6. Regenerate the sitemap

Run:

```bash
node .claude/blog-engine/gen-sitemap.js
```

Confirm it prints `sitemap regenerated with N posts` where `N` matches the new length of `blog/posts.json`.

## 7. Commit and push

```bash
git add -A
git commit -m "feat(blog): publish \"<TOPIC.title>\"

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push origin main
```

Only run this step if steps 1–6 completed without error. If any earlier step failed, stop, log the failure clearly, and exit non-zero instead of committing partial/broken content.

## Constraints (recap)

- No paid API keys, ever. This workflow only uses local repo files and your own generation via the Claude subscription CLI.
- Never touch `blog/_template.html` itself — only read it.
- Never modify topics other than the one just used.
- Never push if step 1 exited early on "no unused topics."
