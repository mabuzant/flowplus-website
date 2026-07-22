# Deployment, domains & security

The site runs on **Railway** via `server.js` (Express static host + the workshop
certificate/survey helpers). This document covers the custom-domain and TLS setup.

## Why `flowplus.ae` was unreachable (only `www.flowplus.ae` worked)

`www.flowplus.ae` had a DNS record and was registered as a custom domain in
Railway, so it resolved and got a certificate. The **apex** (`flowplus.ae`,
also called the "root" or "naked" domain) had **neither** — so browsers had
nothing to connect to and TLS could not be issued for it.

Apex domains can't use a plain `CNAME` (DNS rules forbid a CNAME at the zone
root), which is the usual reason the root is left unconfigured.

## Fix — make the apex resolve and get a certificate

Do both halves: register the domain in Railway **and** add the DNS record.

1. **Railway → Service → Settings → Networking → Custom Domains**
   - Add `flowplus.ae` (in addition to the existing `www.flowplus.ae`).
   - Railway shows the exact target host to point DNS at (e.g. a
     `xxxx.up.railway.app` value). Copy it.

2. **DNS (at the domain registrar / DNS provider for flowplus.ae)**
   - Apex `flowplus.ae`: add the record Railway asks for. Because it's the apex,
     use your provider's flattening record type — **ALIAS**, **ANAME**, or
     Cloudflare's **CNAME flattening** — pointing to the Railway target.
     - If the provider only supports plain records at the root, put the domain
       behind **Cloudflare** (proxied) and use CNAME flattening, or use the
       static **A** record IP Railway provides if it offers one.
   - `www.flowplus.ae`: keep the existing `CNAME → <railway target>`.

3. **Certificates** — Railway auto-issues Let's Encrypt certs once each domain
   resolves to it. After DNS propagates (minutes to a couple hours), both
   `flowplus.ae` and `www.flowplus.ae` will be HTTPS.

Once the apex resolves to the app, `server.js` **308-redirects `flowplus.ae`
→ `https://www.flowplus.ae`**, so there is a single canonical, cert-backed
origin. (Prefer the apex as canonical instead? Swap `CANONICAL_HOST` and
`APEX_HOST` in `server.js`.)

## Security hardening (in `server.js`)

Applied to every response:

- **HSTS** — `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  (tells browsers to only ever use HTTPS). Submit the domain at
  <https://hstspreload.org> after both hosts are live on HTTPS to get it baked
  into browsers.
- **HTTPS upgrade** — any `http://` request to a production host is 308-redirected
  to `https://`, and `upgrade-insecure-requests` is set in the CSP.
- **Content-Security-Policy** — locks sources to self + the fonts (Google Fonts)
  and API (Supabase) the site actually uses.
- **X-Content-Type-Options: nosniff**, **X-Frame-Options: SAMEORIGIN** +
  `frame-ancestors 'self'` (clickjacking), **Referrer-Policy**,
  **Permissions-Policy**, **Cross-Origin-Opener-Policy**, and `x-powered-by`
  removed.

The redirect/host logic only fires for the real production hostnames
(`flowplus.ae`, `www.flowplus.ae`), so the Railway healthcheck and local
development are unaffected.

### Verifying after deploy

```bash
curl -sI https://flowplus.ae/        # expect 308 -> https://www.flowplus.ae/
curl -sI https://www.flowplus.ae/    # expect 200 + Strict-Transport-Security, Content-Security-Policy, ...
```

Then check the grade at <https://www.ssllabs.com/ssltest/> and
<https://securityheaders.com>.
