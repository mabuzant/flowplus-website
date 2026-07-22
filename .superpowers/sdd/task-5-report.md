# Task 5 Report: Blog template, index page, posts.json, and blog routes

## Files created
- `blog/posts.json` — manifest, `[]`
- `blog/_template.html` — standalone post skeleton with `__TITLE__`, `__DESCRIPTION__`, `__SLUG__`, `__DATE_ISO__`, `__BODY_HTML__`, `__FAQ_JSONLD__` tokens (kept verbatim per plan)
- `blog/index.html` — blog listing page, fetches `posts.json` client-side
- `blog/posts/` — created via `mkdir -p blog/posts` (empty, ready for Task 6+)

## Files modified
- `server.js` — added `/blog` and `/blog/:slug` routes, placed after the Task 3 `/robots.txt`/`/sitemap.xml` routes and before `express.static` / the catch-all regex route.

## Verification (server on port 3000, node_modules present)
```
blog 200
missing 404
posts.json ok
```
All three expected results matched.

## Commit
`7efa8e461f080cd8aa2dc029d20e4b7381b82b3c` — "feat(blog): add blog index, post template, posts.json manifest, and routes" on branch `feat/seo-aeo-blog-engine`.
