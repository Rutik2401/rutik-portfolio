#!/usr/bin/env node
/**
 * Premium Notes Generator (in-portfolio)
 *
 * Reads a note's source markdown and config, then writes a styled HTML
 * preview and a print-ready PDF back into the same folder. Each note lives
 * at: portfolio/src/assets/notes/<slug>/
 *
 *   notes.md      — editable source (you change this)
 *   config.json   — title + header/footer branding
 *   notes.html    — generated HTML preview (also bundled as a website asset)
 *   notes.pdf     — generated print-ready PDF
 *
 * Usage:
 *   node tools/notes-generator/generate.js <slug>
 *   node tools/notes-generator/generate.js angular
 *   node tools/notes-generator/generate.js --all       # regenerate all
 */

const fs = require('fs');
const path = require('path');

let marked, hljs, puppeteer;
try {
  marked = require('marked').marked;
  hljs = require('highlight.js');
  puppeteer = require('puppeteer');
} catch (e) {
  console.error(`\n  ✗  Missing dependencies. Run this once:\n`);
  console.error(`     cd tools/notes-generator && npm install\n`);
  process.exit(1);
}

const NOTES_ROOT = path.resolve(__dirname, '..', '..', 'src', 'assets', 'notes');
const CSS_PATH = path.resolve(__dirname, 'styles.css');

// ---------- args ----------
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(`\n  Usage:`);
  console.error(`     node generate.js <slug>      # generate one note`);
  console.error(`     node generate.js --all       # generate every note\n`);
  process.exit(1);
}

const slugs = args[0] === '--all'
  ? fs.readdirSync(NOTES_ROOT).filter((d) => {
      const stat = fs.statSync(path.join(NOTES_ROOT, d));
      return stat.isDirectory() && fs.existsSync(path.join(NOTES_ROOT, d, 'notes.md'));
    })
  : [args[0]];

// ---------- marked setup ----------
marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });

const slugify = (s) =>
  s.toLowerCase()
   .replace(/\*\(important\)\*/g, '')
   .replace(/[*`_~]/g, '')
   .replace(/[^\w\s-]/g, '')
   .trim()
   .replace(/\s+/g, '-')
   .replace(/-+/g, '-');

const renderer = new marked.Renderer();
renderer.code = (code, lang) => {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  let highlighted;
  try {
    highlighted = hljs.highlight(code, { language, ignoreIllegals: true }).value;
  } catch (_) {
    highlighted = hljs.highlightAuto(code).value;
  }
  return `<pre class="hljs"><code class="language-${language}">${highlighted}</code></pre>`;
};
renderer.heading = (text, level, raw) => {
  const id = slugify(raw);
  return `<h${level} id="${id}">${text}</h${level}>\n`;
};

const cleanTitle = (t) =>
  t.replace(/\*\(important\)\*/gi, '')
   .replace(/\*\*/g, '')
   .replace(/\*/g, '')
   .trim();

// ---------- TOC builder ----------
function buildToc(md) {
  const lines = md.split(/\r?\n/);
  const topics = [];
  let current = null;
  for (const ln of lines) {
    const h2 = ln.match(/^##\s+(.+?)\s*$/);
    const h3 = ln.match(/^###\s+(.+?)\s*$/);
    if (h2) {
      current = { title: cleanTitle(h2[1]), slug: slugify(h2[1]), questions: [] };
      topics.push(current);
    } else if (h3 && current) {
      current.questions.push({
        title: cleanTitle(h3[1]),
        slug: slugify(h3[1]),
        important: /\(important\)/i.test(h3[1]),
      });
    }
  }
  return `<div class="toc-page">
    <div class="toc-head">
      <div class="toc-kicker">Navigation</div>
      <h1 class="toc-title">Table of Contents</h1>
      <div class="toc-rule"></div>
      <p class="toc-sub">Click any entry to jump to the section</p>
    </div>
    <div class="toc-grid">
      ${topics.map((t, i) => {
        const num = String(i + 1).padStart(2, '0');
        return `<div class="toc-card">
          <a class="toc-topic" href="#${t.slug}">
            <span class="toc-num">${num}</span>
            <span class="toc-topic-title">${t.title}</span>
          </a>
          <ul class="toc-qs">
            ${t.questions.map((q) =>
              `<li><a href="#${q.slug}"><span class="toc-dot"></span><span class="toc-q-text">${q.title}</span>${q.important ? '<span class="toc-imp">★</span>' : ''}</a></li>`
            ).join('\n            ')}
          </ul>
        </div>`;
      }).join('\n      ')}
    </div>
  </div>`;
}

// ---------- per-note generation ----------
async function generate(slug) {
  const dir = path.join(NOTES_ROOT, slug);
  const mdPath = path.join(dir, 'notes.md');
  const cfgPath = path.join(dir, 'config.json');
  const htmlOut = path.join(dir, 'notes.html');
  const pdfOut = path.join(dir, 'notes.pdf');

  if (!fs.existsSync(mdPath)) {
    console.error(`  ✗  ${slug}: notes.md not found at ${mdPath}`);
    return false;
  }
  if (!fs.existsSync(cfgPath)) {
    console.error(`  ✗  ${slug}: config.json not found at ${cfgPath}`);
    return false;
  }

  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const md = fs.readFileSync(mdPath, 'utf8');
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  const tocHtml = buildToc(md);
  const mdWithToc = md.replace(/<div class="toc-page">[\s\S]*?<\/div>\s*<\/div>/, tocHtml);
  const bodyHtml = marked.parse(mdWithToc, { renderer });

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${cfg.title || 'Premium Notes'}</title>
<style>${css}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

  fs.writeFileSync(htmlOut, html, 'utf8');
  console.log(`  ✓  ${slug}: notes.html written (${(fs.statSync(htmlOut).size / 1024).toFixed(1)} KB)`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
      '--disable-font-subpixel-positioning',
      '--force-color-profile=srgb',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
  await page.evaluateHandle('document.fonts.ready');

  const headerLeft = cfg.headerLeft || cfg.title || 'Premium Notes';
  const headerRight = cfg.headerRight || 'Premium Edition';
  const footerName = cfg.author || 'Rutik Pimpale';

  await page.pdf({
    path: pdfOut,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    scale: 1,
    headerTemplate: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:8pt;color:#1E3A8A;width:100%;padding:6px 15mm 0 15mm;display:flex;justify-content:space-between;align-items:center;-webkit-print-color-adjust:exact;">
        <span style="font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#DC2626;">${escapeHtml(headerLeft)}</span>
        <span style="color:#1E3A8A;font-weight:600;">${escapeHtml(headerRight)}</span>
      </div>`,
    footerTemplate: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:8.5pt;color:#0F172A;width:100%;padding:4px 15mm 6px 15mm;border-top:1px solid #CBD5E1;display:flex;justify-content:space-between;align-items:center;-webkit-print-color-adjust:exact;">
        <span style="font-weight:700;letter-spacing:0.3px;"><span style="color:#DC2626;">@</span><span style="color:#1E3A8A;">${escapeHtml(footerName)}</span></span>
        <span style="font-weight:700;color:#0F172A;">Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>`,
    margin: { top: '20mm', bottom: '22mm', left: '15mm', right: '15mm' },
  });

  await browser.close();
  console.log(`  ✓  ${slug}: notes.pdf written (${(fs.statSync(pdfOut).size / 1024).toFixed(1)} KB)`);
  return true;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]),
  );
}

// ---------- run ----------
(async () => {
  console.log(`\n  PREMIUM NOTES GENERATOR\n  ${'─'.repeat(28)}`);
  let ok = true;
  for (const slug of slugs) {
    const result = await generate(slug);
    if (!result) ok = false;
  }
  console.log(`\n  ${ok ? '✓ Done.' : '⚠ Completed with errors.'}\n`);
  process.exit(ok ? 0 : 1);
})().catch((err) => {
  console.error('\n  ✗ Generation failed:', err);
  process.exit(1);
});
