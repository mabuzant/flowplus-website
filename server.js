/* flow+ site server — static hosting + a tiny workshop-certificate API.
 *
 * Storage is a single JSON file (no external database). On Railway, mount a
 * volume and point DATA_DIR at it (e.g. DATA_DIR=/data) so workshops and
 * registration counts survive redeploys. Without a volume it still works,
 * but the data resets on each deploy.
 */
'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = String(process.env.ADMIN_PIN || '144700');
// Optional strict per-IP limit (default off — attendees often share venue WiFi).
const ENFORCE_IP_LIMIT = String(process.env.ENFORCE_IP_LIMIT || 'false') === 'true';

/* ---------- data store ---------- */
function resolveDataDir() {
  const candidates = [process.env.DATA_DIR, '/data', path.join(ROOT, 'data')].filter(Boolean);
  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.accessSync(dir, fs.constants.W_OK);
      return dir;
    } catch (e) { /* try next */ }
  }
  return path.join(ROOT, 'data');
}
const DATA_DIR = resolveDataDir();
const STORE_PATH = path.join(DATA_DIR, 'store.json');

function seedStore() {
  return {
    workshops: [
      {
        id: 'ws_seed_ai_language',
        code: '256008',
        nameEn: 'Artificial Intelligence, the Language of the Future',
        nameAr: 'الذكاء الاصطناعي، لغة المستقبل',
        date: '2026-07-16',
        createdAt: Date.now()
      }
    ],
    registrations: []
  };
}

let store;
function loadStore() {
  try {
    store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    if (!store.workshops) store.workshops = [];
    if (!store.registrations) store.registrations = [];
  } catch (e) {
    store = seedStore();
    saveStore();
  }
}
function saveStore() {
  const tmp = STORE_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
  fs.renameSync(tmp, STORE_PATH); // atomic replace
}
loadStore();
console.log('[flow+] data store:', STORE_PATH);

/* ---------- helpers ---------- */
function genId(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function genCode() {
  const used = new Set(store.workshops.map(w => w.code));
  let code;
  do { code = String(Math.floor(100000 + Math.random() * 900000)); } while (used.has(code));
  return code;
}
function findByCode(code) {
  const c = String(code || '').trim();
  return store.workshops.find(w => w.code === c) || null;
}
function publicWorkshop(w) {
  return { id: w.id, nameEn: w.nameEn, nameAr: w.nameAr, date: w.date };
}
function clean(s, max) {
  return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, max || 160);
}

/* ---------- app ---------- */
const app = express();
app.set('trust proxy', true); // Railway is behind a proxy — get the real client IP
app.use(express.json({ limit: '64kb' }));

/* ===== public API ===== */

// Validate a code and return the workshop it unlocks.
app.get('/api/workshops/:code', (req, res) => {
  const w = findByCode(req.params.code);
  if (!w) return res.status(404).json({ ok: false, error: 'invalid_code' });
  res.json({ ok: true, workshop: publicWorkshop(w) });
});

// Record a certificate generation (the PDF itself is built client-side).
app.post('/api/register', (req, res) => {
  const w = findByCode(req.body && req.body.code);
  if (!w) return res.status(404).json({ ok: false, error: 'invalid_code' });

  const nameEn = clean(req.body.nameEn, 120);
  const nameAr = clean(req.body.nameAr, 120);
  if (nameEn.length < 2) return res.status(400).json({ ok: false, error: 'name_required' });

  const ip = req.ip || '';
  if (ENFORCE_IP_LIMIT) {
    const dup = store.registrations.find(r => r.workshopId === w.id && r.ip === ip);
    if (dup) return res.json({ ok: true, already: true, workshop: publicWorkshop(w) });
  }

  store.registrations.push({
    id: genId('reg'), workshopId: w.id, code: w.code,
    nameEn, nameAr, ip, ts: Date.now()
  });
  saveStore();
  res.json({ ok: true, workshop: publicWorkshop(w) });
});

/* ===== admin API (PIN via x-admin-pin header) ===== */
function requireAdmin(req, res, next) {
  const pin = String(req.get('x-admin-pin') || (req.body && req.body.pin) || '');
  if (pin !== ADMIN_PIN) return res.status(401).json({ ok: false, error: 'unauthorized' });
  next();
}

app.post('/api/admin/verify', requireAdmin, (req, res) => res.json({ ok: true }));

// Full summary: every workshop with its generated count and registrant names.
app.get('/api/admin/summary', requireAdmin, (req, res) => {
  const workshops = store.workshops
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(w => {
      const regs = store.registrations
        .filter(r => r.workshopId === w.id)
        .sort((a, b) => b.ts - a.ts);
      return {
        id: w.id, code: w.code, nameEn: w.nameEn, nameAr: w.nameAr, date: w.date,
        count: regs.length,
        registrations: regs.map(r => ({ nameEn: r.nameEn, nameAr: r.nameAr, ts: r.ts }))
      };
    });
  res.json({ ok: true, workshops });
});

// Create a workshop (auto-generates a unique code).
app.post('/api/admin/workshop', requireAdmin, (req, res) => {
  const nameEn = clean(req.body.nameEn, 160);
  const nameAr = clean(req.body.nameAr, 160);
  const date = clean(req.body.date, 40);
  if (nameEn.length < 2) return res.status(400).json({ ok: false, error: 'nameEn_required' });
  const w = { id: genId('ws'), code: genCode(), nameEn, nameAr, date, createdAt: Date.now() };
  store.workshops.push(w);
  saveStore();
  res.json({ ok: true, workshop: w });
});

// Edit a workshop (code stays fixed).
app.put('/api/admin/workshop/:id', requireAdmin, (req, res) => {
  const w = store.workshops.find(x => x.id === req.params.id);
  if (!w) return res.status(404).json({ ok: false, error: 'not_found' });
  if (req.body.nameEn != null) w.nameEn = clean(req.body.nameEn, 160);
  if (req.body.nameAr != null) w.nameAr = clean(req.body.nameAr, 160);
  if (req.body.date != null) w.date = clean(req.body.date, 40);
  if (w.nameEn.length < 2) return res.status(400).json({ ok: false, error: 'nameEn_required' });
  saveStore();
  res.json({ ok: true, workshop: w });
});

// Delete a workshop (and its registrations).
app.delete('/api/admin/workshop/:id', requireAdmin, (req, res) => {
  const before = store.workshops.length;
  store.workshops = store.workshops.filter(w => w.id !== req.params.id);
  if (store.workshops.length === before) return res.status(404).json({ ok: false, error: 'not_found' });
  store.registrations = store.registrations.filter(r => r.workshopId !== req.params.id);
  saveStore();
  res.json({ ok: true });
});

/* ===== static site ===== */
app.use(express.static(ROOT, { extensions: ['html'] }));

// SPA-ish fallback for unknown non-API GETs → home page.
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[flow+] listening on ${PORT} · admin pin ${ADMIN_PIN === '144700' ? '(default)' : '(custom)'} · ip-limit ${ENFORCE_IP_LIMIT}`);
});
