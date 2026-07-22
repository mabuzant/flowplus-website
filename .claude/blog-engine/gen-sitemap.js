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
