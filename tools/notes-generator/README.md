# Notes Generator

Builds `notes.html` and `notes.pdf` from `notes.md` for every entry in
`src/assets/notes/<slug>/`. Lives inside the portfolio so updates never
require leaving the repo.

## Setup (once)

```bash
cd tools/notes-generator
npm install
```

This installs `marked`, `highlight.js`, and `puppeteer` (downloads Chromium).

## Updating a note

1. Edit the markdown:
   ```
   src/assets/notes/<slug>/notes.md
   ```
2. From the **portfolio root**:
   ```bash
   npm run notes:generate -- <slug>
   ```
   Examples:
   ```bash
   npm run notes:generate -- angular
   npm run notes:generate -- dotnet-senior
   npm run notes:generate -- dotnet-fresher
   npm run notes:generate -- --all
   ```
3. The generator writes `notes.html` and `notes.pdf` back into the same
   folder. Refresh the browser — the website serves the new files.

## Adding a new note

1. Create a folder: `src/assets/notes/<new-slug>/`
2. Add two files:
   - `notes.md` — your markdown source (with the `<div class="cover-page">` block at the top)
   - `config.json` — branding for the header/footer:
     ```json
     {
       "title": "My New Note",
       "headerLeft": "MY NEW NOTE",
       "headerRight": "Edition Tagline · Premium",
       "author": "Rutik Pimpale"
     }
     ```
3. Run `npm run notes:generate -- <new-slug>`
4. Add the new slug to the `RESOURCES` map in
   `src/app/components/resource-viewer/resource-viewer.component.ts`
   and to `resources` in `src/app/components/resources/resources.component.ts`.

## Files at a glance

```
tools/notes-generator/
├── generate.js     # CLI: reads notes.md, writes notes.html + notes.pdf
├── styles.css      # premium print styles (cover, TOC, headings, code blocks)
├── package.json    # marked + highlight.js + puppeteer
└── README.md
```
