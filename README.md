# Michi Connection Portal

A fast, warm, memorable mobile connection page for **Michi Wada** (Michihiro Wada),
educator in Kagoshima, Japan.

Main access path: business card → QR code → smartphone → this page.
Concept: **Remember Michi. Know the story. Stay connected.**

Built on the WADARIN LP Framework v2.0 build rules
(static HTML / CSS / minimal JS / `images/`, GitHub Pages, no Base64, relative paths).

Version 1.3 — English + Japanese, real photos, Sakurajima time-lapse, live links.

---

## Files

```
index.html      All copy and markup, in both languages. Six sections.
style.css       Mobile first. Section 10 holds the desktop overrides.
script.js       Language switch, the time-lapse, one soft reveal. Nothing else.
favicon.svg
images/
  michi-portrait.jpg     600 × 600      45 KB
  sakurajima.mp4       1024 × 688     1.45 MB   18.5s silent loop, no audio track
  sakurajima.jpg       1024 × 688       78 KB   poster frame for the video
  otsu-no-konbo.jpg    1200 × 800       49 KB
  og-image.png         1200 × 630      149 KB   share image
```

First screen weighs **86 KB** (HTML + CSS + JS + portrait). Nothing else is
fetched until the visitor scrolls.

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

One thing: search `index.html` for **`REPLACE_SITE_URL`**. It appears twice, in
`<head>` — the canonical link and `og:url`. Put the published address there,
e.g. `https://USERNAME.github.io/michi-connection-portal/`.

### Connect section — live

| | |
|---|---|
| Facebook | `https://www.facebook.com/wowwdarling` |
| Instagram | `https://www.instagram.com/wowwdarling/` |
| Email | `michihirowadarin@gmail.com` |

The Instagram link deliberately drops the `?hl=ja` parameter; it would force the
Japanese Instagram interface on every visitor.

### Connect section — ready but switched off

LinkedIn, GitHub and Website sit in a commented-out block at the end of the
Connect list. To switch one on, delete the `<!--` / `-->` markers around its
`<li>` and replace the `REPLACE_…_URL` token. LinkedIn is kept there because it
is the planned primary connection for the international educator network.

Each URL appears **once**, in the Connect section only.

All photos are in place; nothing else is required before publishing.

### The Sakurajima time-lapse

`images/sakurajima.mp4` is an 18.5-second silent loop cut from the original
51-second clip, with the black side bars removed and the end cross-faded back
into the beginning so the loop has no visible jump.

How it behaves:

- `preload="none"` — the file is not requested at all until the section scrolls
  into view. The first screen never waits for it.
- `muted loop playsinline`, no controls. It pauses when scrolled away.
- `prefers-reduced-motion: reduce` → it never plays; the poster frame stands in
  as a still photo.
- If the browser refuses to autoplay (iOS Low Power Mode, data saver), a small
  play button appears over the poster.
- With JavaScript disabled the poster is simply shown as a photo.

**To go back to a still photo instead**, replace the `<video>` block in
`index.html` with
`<img class="figure__media" src="images/sakurajima.jpg" alt="…" loading="lazy">`.
Nothing in the CSS needs to change.

To re-cut the clip from a new source:

```sh
ffmpeg -i source.mp4 -vf "crop=1072:720:104:0,scale=1024:-2,fps=20" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 29 \
  -preset slower -movflags +faststart -an images/sakurajima.mp4
ffmpeg -i images/sakurajima.mp4 -frames:v 1 -q:v 3 images/sakurajima.jpg
```

### Replacing a photo later

Update the `src` in `index.html`, and the `alt` / `data-alt-ja` pair if the new
photo shows something different. The portrait uses
`object-position: center 40%`; if a new face sits high or low in the frame,
adjust that one value in `style.css`.

Optional: individual photos for each colour card. The markup would take one
`<img>` per `.color` item; ask and it can be added without touching anything else.

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
