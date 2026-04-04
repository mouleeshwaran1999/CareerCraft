# CareerCraft — Build. Optimize. Get Hired.

A fully client-side, offline-capable resume builder with multiple templates, rich editing, ATS score checking, and PDF export. Built with React + TypeScript + Vite + TailwindCSS.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (HMR) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | TypeScript type checking |

---

## Features

### 🎨 Template Gallery (5 Templates)
- **Modern** — Bold header with accent bar. Clean professional layout.
- **Classic** — Traditional serif-based, formal / academic style.
- **Minimal** — Ultra-clean with generous whitespace and left-aligned timeline.
- **Tech** — Developer-focused with dark header, code-style accents, tech tag pills.
- **Elegant** — Sophisticated two-tone design with gradient sidebar accent.

Search templates by name or tag. Filter by category. Live preview directly from the gallery.

### ✏️ Resume Editor
- **Contact / Header** — Name, title, email, phone, location, LinkedIn, GitHub, website
- **Professional Summary** — Textarea with word count
- **Work Experience** — Add/remove entries, bullet points, current job flag
- **Education** — Degree, institution, GPA, honors
- **Skills** — Grouped by category (comma-separated)
- **Projects** — Name, tech stack, description, URL, bullet points
- **Section reordering** — Drag and drop (`@dnd-kit`)
- **Experience & project item reordering** — Drag and drop
- **Section visibility toggle** — Show/hide any section
- **Undo / Redo** — Full history stack (up to 50 states)
- **Autosave** — Debounced 500ms write to `localStorage`

### 🎨 Style Customization
- Font family (Inter, Georgia, Roboto, Raleway, Lato)
- Font size slider (11px – 16px)
- Primary & accent color pickers + preset swatches
- Spacing scale: Compact / Normal / Relaxed
- 1-column / 2-column toggle (template-dependent)

### 📊 ATS Score Checker (100% client-side, no API calls)
- Paste any job description → click **Analyze**
- **Scoring breakdown (0–100):**
  - Keyword match (45%) — tokenization, bigrams, stopword removal
  - Section completeness (25%) — header fields, section presence
  - Readability (20%) — action verbs, bullet length, metrics
  - Formatting (10%) — symbols, 2-column warning, summary length
- **Missing keywords** list (top 15)
- **Matched keywords** list
- **Improvement suggestions** — rewrite bullets, add metrics, add keywords
- **Apply / Reject** buttons — changes go through undo/redo stack (never auto-applied)
- **Disclaimer** shown prominently in UI

### 📤 Export & Import
- **Export PDF** — via `react-to-print` (browser print dialog → Save as PDF)
- **Export JSON** — Download full resume state as `.json`
- **Import JSON** — Load from a previously exported file
- **Reset to Sample** — Restore the built-in example resume

### 💾 Persistence
- All data stored under `localStorage` key: `careercraft_v1` (migrates automatically from legacy `resume_builder_v2` and `resume_builder_v1` keys)
- Schema version check with safe fallback on parse failure
- Autosave with 500ms debounce on every change

---

## Project Structure

```
src/
├── types/
│   └── resume.ts               # All TypeScript types / interfaces
├── data/
│   ├── templates.ts            # 5 template definitions
│   └── sampleResume.ts         # Sample resume + sample job description
├── store/
│   └── resumeStore.ts          # Zustand store + localStorage persistence
├── features/
│   └── ats/
│       └── atsAnalyzer.ts      # Rule-based ATS scoring engine
├── components/
│   ├── layout/
│   │   └── Navbar.tsx
│   ├── gallery/
│   │   └── TemplateGallery.tsx
│   ├── editor/
│   │   ├── HeaderEditor.tsx
│   │   ├── SummaryEditor.tsx
│   │   ├── ExperienceEditor.tsx
│   │   ├── EducationEditor.tsx
│   │   ├── SkillsEditor.tsx
│   │   ├── ProjectsEditor.tsx
│   │   ├── SectionManager.tsx  # DnD section reordering + tab shell
│   │   └── StylePanel.tsx
│   ├── preview/
│   │   ├── ResumePreview.tsx   # Template router
│   │   ├── templateUtils.ts    # Shared helpers (date formatting, styles)
│   │   └── templates/
│   │       ├── ModernTemplate.tsx
│   │       ├── ClassicTemplate.tsx
│   │       ├── MinimalTemplate.tsx
│   │       ├── TechTemplate.tsx
│   │       └── ElegantTemplate.tsx
│   ├── ats/
│   │   └── ATSChecker.tsx
│   └── export/
│       └── ExportPage.tsx
├── pages/
│   └── EditorPage.tsx          # Split-pane editor + live preview
├── App.tsx
├── main.tsx
└── index.css
```

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.4 | Type safety |
| Vite | 5.2 | Build tool + HMR |
| TailwindCSS | 3.4 | Utility CSS |
| Zustand | 4.5 | State management |
| @dnd-kit | 6.x / 8.x | Drag-and-drop |
| react-hook-form + zod | 7.x / 3.x | (available, used for future form validation) |
| react-to-print | 2.x | PDF print via browser |
| uuid | 9.x | Unique IDs for sections/items |

---

## ATS Disclaimer

> ATS scores produced by this tool are **estimates only**. Different Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo, iCIMS, etc.) parse and weight resumes differently. The score is intended as a qualitative guide to identify common weaknesses, not a guarantee of how any specific ATS will rank your resume. Always tailor your resume to each specific job description.

---

## Build for Production

```bash
npm run build
npm run preview
```

The production bundle will be in `dist/`. No server required — serve as static files.
