# Task 3 Report: robots.txt, sitemap.xml, Express routes

## Port used
3000 (from `PORT = process.env.PORT || 3000` in server.js, no `PORT` env var set)

## Curl verification results
```
robots 200 text/plain; charset=utf-8
sitemap 200 application/xml
```

## Files
- Created `robots.txt` (repo root) — AI crawler allowlist + `Sitemap: https://flowplus.ae/sitemap.xml`
- Created `sitemap.xml` (repo root) — home, /founder, /blog entries
- Modified `server.js` — added `/robots.txt` and `/sitemap.xml` GET routes immediately before `app.use(express.static(ROOT, ...))` (was line 190), reusing the existing `path` require and `ROOT` constant (`const ROOT = __dirname;`, line 14). No new `require('path')` was needed — it was already present at line 12.

Note: `npm install` had to be run first (`node_modules` was absent), otherwise `node server.js` failed with `Cannot find module 'express'`.

## Commit
657832f4934fed522298260aa2b4f371b58ce491
