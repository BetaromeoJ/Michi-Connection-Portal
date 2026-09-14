# Michi Connection Portal

A fast, warm, memorable mobile connection page for **Michi Wada** (Michihiro Wada),
educator in Kagoshima, Japan.

Main access path: business card → QR code → smartphone → this page.
Concept: **Remember Michi. Know the story. Stay connected.**

Built on the WADARIN LP Framework v2.0 build rules
(static HTML / CSS / minimal JS / `images/`, GitHub Pages, no Base64, relative paths).

Version 1.1 — English + Japanese, expanded Otsu no Konbo section.

---

## Files

```
index.html      All copy and markup, in both languages. Six sections.
style.css       Mobile first. Section 10 holds the desktop overrides.
script.js       Language switch + one soft reveal for the photos. Nothing else.
favicon.svg
images/
  placeholder-portrait.svg      → replace with michi-portrait.jpg
  placeholder-sakurajima.svg    → replace with sakurajima.jpg
  placeholder-konbo.svg         → replace with otsu-no-konbo.jpg
  og-image.png                  → replace when a real share image exists
```

---

## Language

English is the default. A small **EN / 日本語** switch sits in the top right corner.

Every translatable string exists twice in `index.html`:

```html
<span data-lang="en">English</span><span data-lang="ja">日本語</span>
```

CSS hides whichever one does not match `<html lang="…">`. That means:

- no framework, no build step, no translation files
- with JavaScript disabled the page stays in English and reads completely
- the switch remembers the choice in `localStorage`
- a visitor whose browser is set to Japanese sees Japanese on the first visit;
  everyone else — including every MEL26 visitor — sees English.
  To turn that off, delete the `navigator.language` line in `script.js`.

**When editing Japanese copy**, keep one paragraph on one line in the HTML.
A line break inside Japanese text renders as a visible half-width space.

`document.title` and the meta description also follow the language; both strings
live in the `META` object at the top of `script.js`.

---

## What to replace before publishing

Open `index.html` and search for **`REPLACE_`**. There are seven:

| Token | Where | What |
|---|---|---|
| `REPLACE_SITE_URL` | `<head>` | canonical + `og:url`, e.g. `https://USERNAME.github.io/michi-connection-portal/` |
| `REPLACE_LINKEDIN_URL` | Connect | LinkedIn profile URL |
| `REPLACE_FACEBOOK_URL` | Connect | Facebook profile URL |
| `REPLACE_INSTAGRAM_URL` | Connect | Instagram profile URL |
| `REPLACE_EMAIL` | Connect | email address (becomes `mailto:`) |
| `REPLACE_GITHUB_URL` | Connect | optional — the row is commented out |
| `REPLACE_WEBSITE_URL` | Connect | optional — the row is commented out |

Each URL appears **once**, in the Connect section only.

### Photos

| File | Size | Notes |
|---|---|---|
| `images/michi-portrait.jpg` | square, 600 × 600 | under 150 KB. Cropped to a circle |
| `images/sakurajima.jpg` | 1600 × 1000 (16:10) | under 400 KB |
| `images/otsu-no-konbo.jpg` | square, 800 × 800 | under 200 KB |
| `images/og-image.png` | exactly 1200 × 630 | share image |

**For `otsu-no-konbo.jpg`, a photo with all three colours in it works best** —
red, yellow and white together, shot close, plain background, so the three cards
underneath are read as "the ones Michi had". A single-colour photo also works.

Each is marked `<!-- PLACEHOLDER IMAGE -->` in `index.html`. Update the `src`,
and the `alt` / `data-alt-ja` pair if the photo shows something different.

The portrait uses `object-position: center 40%`. If the face sits high or low in
the frame, adjust that one value in `style.css`.

Optional later: individual photos for each colour card. The markup would take one
`<img>` per `.color` item; ask and it can be added without touching anything else.

### Optional links

To switch on GitHub or Website, delete the `<!--` / `-->` markers around those
two `<li>` blocks in the Connect section and fill in the URL.

---

## Publishing on GitHub Pages

1. Create a repository and push these files to the repository root.
2. Settings → Pages → Source: `main` / `/ (root)`.
3. Open the published URL, put it into `REPLACE_SITE_URL`, push again.

All paths are relative, so the site works from a project subpath such as
`/michi-connection-portal/`. File names are all lowercase — GitHub Pages is
case sensitive.

---

## Notes

- No web fonts, no libraries, no analytics, no cookies, no external requests.
- JavaScript is optional: with it disabled everything still reads and every link
  still works; only the language switch disappears.
- `prefers-reduced-motion` is respected.
