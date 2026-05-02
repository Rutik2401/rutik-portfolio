# Prompt Template for Generating a New Book

Copy everything below the `---` line into ChatGPT, Gemini, Claude.ai, or any
LLM. Replace `{TOPIC}` and `{LEVEL}` with your real values. Save the reply
into `src/assets/notes/<slug>/notes.md` (overwriting the placeholder created
by `scaffold.js`).

The template is engineered to produce content that the existing PDF generator
renders correctly: gradient h2 banners, blue h3 callouts, syntax-highlighted
code, follow-up Qs, and the cover/TOC structure.

---

You are writing a premium interview-prep book on **{TOPIC}** for the
**{LEVEL}** experience window (e.g. "0 – 3 years"). The output is a single
Markdown file that will be rendered into a PDF and an HTML preview.

## Output requirements

1. **Cover page** — preserve the `<div class="cover-page" …>…</div>` block
   that's already at the top of the file (don't change the CSS variables,
   only update the title, subtitle, tagline, chips, and stats).
2. **TOC page** — a `<div class="toc-page">…</div>` block listing every topic
   with its questions (one bullet per Q). Format:
   ```
   **Topic N — Topic Name**
   - Q1. Question title
   - Q2. Question title
   ```
3. **Body** — for each topic:
   - `## Topic N — Topic Name`     (rendered as a gradient banner)
   - `### QN: Full question?`       (rendered as a blue callout)
   - **A:** Direct, opinionated answer paragraph.
   - More paragraphs / bulleted lists / code blocks as needed.
   - `**Follow-up:**` line at the end with 1–2 italic sub-questions and
     short answers.
   - End the question with a `---` separator.

## Tone and voice

- **Senior-style answers**, but tuned to the {LEVEL} window. No corporate
  fluff, no cargo-cult advice.
- Use first-person sparingly ("In a real project I…").
- Bold the **key terms** in each answer (the renderer styles bold words
  with a colored background — make this work for you).
- Where there's a common mistake, call it out under a **"Common
  mistakes:"** mini-section.
- Always include at least one short, real code example per question.
- End every Q with **Follow-up:** italic sub-questions — interviewers love
  these and they double the perceived depth.

## Coverage requirements

Pick ~10 topics, each with 2–4 questions, for ~25–35 total questions. Cover
the full breadth a {LEVEL} candidate is expected to know:

- Fundamentals
- Core API / language features
- Performance / internals
- Tooling / ecosystem
- Real-world tricky questions and gotchas

## Tightness rules

- Skip throat-clearing intros like "Great question…"
- No bulleted answers when prose works.
- Don't repeat the question in the answer.
- Code blocks must declare a language: ` ```js `, ` ```python `, etc.

## Formatting checklist (copy-paste your final output through this)

- [ ] Cover page block present and unchanged at top
- [ ] TOC page block present, all topics listed
- [ ] Every topic uses `## Topic N — Name`
- [ ] Every question uses `### QN: Question?`
- [ ] Every answer starts with `**A:**`
- [ ] Every question ends with a `**Follow-up:**` line and a `---` separator
- [ ] Code blocks have language tags
- [ ] No HTML beyond the cover / TOC blocks

Now produce the entire `notes.md` for **{TOPIC}** at the **{LEVEL}** level.
