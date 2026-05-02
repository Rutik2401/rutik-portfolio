#!/usr/bin/env node
/**
 * Note Scaffolder
 *
 * Generates the boilerplate for a new interview-notes book and registers it
 * automatically in both Angular components, so the only thing you have to
 * write by hand is `notes.md` (or paste it in from an LLM).
 *
 * Usage:
 *   node tools/notes-generator/scaffold.js <slug> [accentHex]
 *
 * Example:
 *   node tools/notes-generator/scaffold.js react
 *   node tools/notes-generator/scaffold.js system-design "#22d3ee"
 *
 * After scaffolding:
 *   1. Edit src/assets/notes/<slug>/notes.md   ← paste your content here
 *   2. node tools/notes-generator/generate.js <slug>
 *   3. npm start  (verify locally)
 *   4. vercel --prod --yes
 */

const fs = require('fs');
const path = require('path');

// ---------- args ----------
const slug = process.argv[2];
const accent = process.argv[3] || '#22d3ee';

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('\n  Usage:  node scaffold.js <slug> [accentHex]');
  console.error('  slug must be lowercase, digits, and dashes only.\n');
  process.exit(1);
}

// ---------- paths ----------
const ROOT = path.resolve(__dirname, '..', '..');
const NOTES_DIR = path.join(ROOT, 'src', 'assets', 'notes', slug);
const VIEWER_TS = path.join(ROOT, 'src', 'app', 'components', 'resource-viewer', 'resource-viewer.component.ts');
const LISTING_TS = path.join(ROOT, 'src', 'app', 'components', 'resources', 'resources.component.ts');

if (fs.existsSync(NOTES_DIR)) {
  console.error(`\n  ✗ A book already exists at: ${NOTES_DIR}`);
  console.error(`    Pick a different slug, or delete that folder first.\n`);
  process.exit(1);
}

// ---------- title-case helpers ----------
const titleFromSlug = slug
  .split('-')
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(' ');
const camelSlug = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// ---------- 1. notes folder + config.json + skeleton notes.md ----------
fs.mkdirSync(NOTES_DIR, { recursive: true });

const config = {
  title: `${titleFromSlug} Interview Roadmap`,
  headerLeft: `${titleFromSlug} Interview Roadmap`,
  headerRight: '0 – 3 Years',
  author: 'Rutik Pimpale',
  accent,
};
fs.writeFileSync(
  path.join(NOTES_DIR, 'config.json'),
  JSON.stringify(config, null, 2) + '\n',
);

const notesMd = `<div class="cover-page" style="
  --cv-bg-a:#0a0510; --cv-bg-b:#1a0a2e; --cv-bg-c:#2e1850; --cv-bg-d:#0c0530;
  --cv-glow-pri:rgba(124,58,237,0.55);
  --cv-glow-sec:rgba(67,56,202,0.55);
  --cv-foil-color:${accent};
  --cv-accent-light:${accent};
  --cv-accent-mid:${accent};
  --cv-accent-dark:#0891b2;
  --cv-glow-shadow-1:rgba(8,145,178,0.45);
  --cv-glow-shadow-2:rgba(34,211,238,0.22);
">
  <div class="cv-foil"></div>
  <div class="cv-grid"></div>
  <div class="cv-grain"></div>
  <div class="cv-shell">
    <div class="cv-header">
      <div class="cv-mark">
        <div class="cv-badge">#</div>
        <span class="cv-initials">${titleFromSlug.toUpperCase().slice(0, 6)}</span>
        <span class="cv-series">RP // Interview Series</span>
      </div>
      <span class="cv-level">0 – 3 Years</span>
    </div>
    <div class="cv-rail">
      <span class="cv-rail-line"></span>
      <span class="cv-rail-text">Vol XX · Interview</span>
    </div>
    <h1 class="cv-title">${titleFromSlug}<br/><span class="cv-title-accent">Interview</span><br/>Roadmap.</h1>
    <p class="cv-subtitle">0 – 3 Years Experience</p>
    <p class="cv-tagline">Add your tagline here.</p>
    <div class="cv-topics">
      <span class="cv-chip">Topic A</span>
      <span class="cv-chip">Topic B</span>
      <span class="cv-chip">Topic C</span>
    </div>
    <div class="cv-spacer"></div>
    <div class="cv-stats">
      <div class="cv-stat"><div class="cv-stat-num">XXX</div><div class="cv-stat-label">Pages</div></div>
      <div class="cv-stat-divider"></div>
      <div class="cv-stat"><div class="cv-stat-num">XX+</div><div class="cv-stat-label">Questions</div></div>
      <div class="cv-stat-divider"></div>
      <div class="cv-stat"><div class="cv-stat-num">X.X MB</div><div class="cv-stat-label">PDF Size</div></div>
    </div>
    <div class="cv-foot">
      <div class="cv-foot-block">
        <p class="cv-foot-label">Authored by</p>
        <p class="cv-foot-value">Rutik Pimpale</p>
      </div>
      <div class="cv-foot-block right">
        <p class="cv-foot-label">Updated</p>
        <p class="cv-foot-value">${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
      </div>
    </div>
  </div>
</div>

<div class="toc-page">

# Table of Contents

<div class="toc">

**Topic 1 — Replace Me**
- Q1. First question

</div>

</div>

---

## Topic 1 — Replace Me

### Q1: First question?

**A:** Replace this whole file with your real content. Either write it yourself
or paste a prompt into ChatGPT / Claude / Gemini using the template at
\`tools/notes-generator/PROMPT-TEMPLATE.md\`.

The format the renderer expects:

- One \`<div class="cover-page">…</div>\` block at the top (already provided).
- One \`<div class="toc-page">…</div>\` block with a TOC.
- Then your topics as \`## Topic N — Topic Name\` (h2 → gradient banner).
- Each question as \`### QN: Question?\` (h3 → blue callout).
- **A:** answer text, **bold keywords**, code blocks with language tags, and
  \`**Follow-up:**\` lines for sub-questions.

\`\`\`js
// Code blocks render with syntax highlighting
const x = 1;
\`\`\`

**Follow-up:** *Sub-question?* — Sub-answer.

---
`;
fs.writeFileSync(path.join(NOTES_DIR, 'notes.md'), notesMd);

// ---------- 2. patch resource-viewer.component.ts ----------
const VIEWER_ENTRY = `  ${camelSlug}: {
    slug: '${slug}',
    title: '${titleFromSlug} Interview Roadmap',
    shortName: '${slug}',
    category: '${slug.toUpperCase()} · 0 – 3 YRS',
    mdPath: 'assets/notes/${slug}/notes.md',
    pdfPath: 'assets/notes/${slug}/notes.pdf',
    htmlPath: 'assets/notes/${slug}/notes.html',
    accentColor: '${accent}',
    icon: '#',
  },
};`;

let viewerSrc = fs.readFileSync(VIEWER_TS, 'utf8');
const viewerClosingMatch = viewerSrc.match(/(\n};\s*\n)(\s*@Component)/);
if (!viewerClosingMatch) {
  console.error('\n  ✗ Could not locate the RESOURCES dict closing brace in resource-viewer.component.ts');
  console.error('    The file may have been refactored — patch it manually.\n');
  process.exit(1);
}
viewerSrc = viewerSrc.replace(
  /(\n};\s*\n)(\s*@Component)/,
  `\n${VIEWER_ENTRY}\n$2`,
);
fs.writeFileSync(VIEWER_TS, viewerSrc);

// ---------- 3. patch resources.component.ts ----------
const LISTING_ENTRY = `    {
      slug: '${slug}',
      title: '${titleFromSlug} Interview Roadmap',
      shortName: '${slug}',
      badge: 'NEW',
      badgeTone: 'new',
      level: '0 – 3 years experience',
      audience: 'Add your audience tagline here.',
      description:
        'Add a longer description here that shows on the listing card.',
      topics: ['Topic A', 'Topic B', 'Topic C'],
      pages: 'XXX',
      questions: 'XX+',
      updated: '${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}',
      pdfPath: 'assets/notes/${slug}/notes.pdf',
      pdfSize: 'X.X MB',
      cover: {
        icon: '#',
        initials: '${titleFromSlug.toUpperCase().slice(0, 4)}',
        gradientFrom: '${accent}',
        gradientTo: '#0a0a0a',
        accent: '${accent}',
      },
    },
  ];`;

let listingSrc = fs.readFileSync(LISTING_TS, 'utf8');
if (!/\n  \];\s*\n/.test(listingSrc)) {
  console.error('\n  ✗ Could not locate the resources array closing in resources.component.ts');
  console.error('    The file may have been refactored — patch it manually.\n');
  process.exit(1);
}
listingSrc = listingSrc.replace(/\n  \];\s*\n/, `\n${LISTING_ENTRY}\n`);
fs.writeFileSync(LISTING_TS, listingSrc);

// ---------- done ----------
console.log(`
  ✓ Scaffolded "${slug}"
  ────────────────────────────
  • src/assets/notes/${slug}/config.json
  • src/assets/notes/${slug}/notes.md           ← edit me
  • Registered in resource-viewer.component.ts
  • Registered in resources.component.ts

  Next steps:
    1. Edit src/assets/notes/${slug}/notes.md (paste content from your LLM
       using tools/notes-generator/PROMPT-TEMPLATE.md as the prompt).
    2. node tools/notes-generator/generate.js ${slug}
    3. npm start                  ← verify at /resources
    4. vercel --prod --yes        ← ship
`);
