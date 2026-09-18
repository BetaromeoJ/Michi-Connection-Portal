# Michi Connection Portal

A fast, warm, memorable mobile connection page for **Michi Wada** (Michihiro Wada),
educator in Kagoshima, Japan.

Main access path: business card → QR code → smartphone → this page.
Concept: **Remember Michi. Know the story. Stay connected.**

Built on the WADARIN LP Framework v2.0 build rules
(static HTML / CSS / minimal JS / `images/`, GitHub Pages, no Base64, relative paths).

Version 2.5 — WhatsApp added to the Connect section.

---

## Files

```
index.html      All copy and markup, in both languages. Six sections.
style.css       Mobile first. Section 10 holds the desktop overrides.
script.js       WHATSAPP_NUMBER, language switch, the time-lapse, one reveal.
favicon.svg
images/
  michi-portrait.jpg        600 × 600      45 KB
  sakurajima.mp4          1024 × 688     1.45 MB  18.5s silent loop, no audio track
  sakurajima.jpg          1024 × 688       78 KB  poster frame for the video
  sakurajima-eruption.jpg 1200 × 900      142 KB  ATTRIBUTION REQUIRED — see below
  otsu-no-konbo.jpg       1200 × 800       49 KB
  og-image.png            1200 × 630      149 KB  share image
```

### ⚠ sakurajima-eruption.jpg — credit must stay visible

The photographer allows this photo **only on the condition that
`©ken.n.miffy.752` is displayed with it.** The credit is the `<span class="credit">`
inside that figure's `<figcaption>` in `index.html`.

Do not remove it, do not hide it with CSS, and do not reuse the file anywhere
else (social posts, slides, the business card) without carrying the same credit.

The first screen paints from **86 KB** (HTML + CSS + JS + portrait). The
Sakurajima clip loads in the background so it is always ready to play — it does
not block anything, but it is part of the page's total weight.

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

**Every page load starts in English.** There is no browser-language guess and
nothing is remembered between visits — a phone set to Japanese still lands on the
English page, and so does a return visitor who switched to Japanese last time.
This is deliberate: the MEL26 visitor scanning the QR code must always see
English first. The switch is one tap away for anyone who wants Japanese.

(If you ever want the choice remembered again, it is the `applyLang('en')` call
near the end of the language block in `script.js`.)

**When editing Japanese copy**, keep one paragraph on one line in the HTML.
A line break inside Japanese text renders as a visible half-width space.

`document.title` and the meta description also follow the language; both strings
live in the `META` object at the top of `script.js`.

---

## What to replace before publishing

One thing: search `index.html` for **`REPLACE_SITE_URL`**. It appears twice, in
`<head>` — the canonical link and `og:url`. Put the published address there,
e.g. `https://USERNAME.github.io/michi-connection-portal/`.

### Connect section — in display order

| | |
|---|---|
| WhatsApp | built in `script.js` from `WHATSAPP_NUMBER` — see below |
| LinkedIn | placeholder, "coming soon / 準備中" |
| Instagram | `https://www.instagram.com/wowwdarling/` |
| Facebook | `https://www.facebook.com/wowwdarling` |
| Email | `michihirowadarin@gmail.com` |

### WhatsApp — set the number in one place

Open **`script.js`** and edit the first constant at the top of the file:

```js
var WHATSAPP_NUMBER = 'REPLACE_WITH_YOUR_NUMBER';
```

Use international format — **drop the leading 0, put Japan's country code
81 in front, digits only** (no `+`, no hyphens, no spaces). A number written
`0XX-XXXX-XXXX` becomes `81XXXXXXXXXX`.

That is the only place the number appears. The script builds the standard
Click-to-Chat link (`https://wa.me/<number>?text=…`) and puts it on the
WhatsApp row, with the first message prefilled:

> Hi Michi! We met at MEL26.

(English in both language views — the visitors are the educators from MEL26.)
The message is escaped with `encodeURIComponent`, so punctuation cannot break
the URL. To change the wording, edit `WHATSAPP_MESSAGE` next to the number.

**Until the number is filled in**, the WhatsApp row is displayed but opens
nothing, and a warning appears in the browser console. No broken `wa.me` link
is ever opened, and nothing technical is shown to visitors.

**On privacy:** the number is never printed as text on the page. But WhatsApp's
Click-to-Chat link necessarily contains it, so anyone who inspects or
long-presses the link can read it. It is not a secret — treat it as a number
you are willing to publish.

The Instagram link deliberately drops the `?hl=ja` parameter; it would force the
Japanese Instagram interface on every visitor.

### Connect section — LinkedIn is a placeholder

LinkedIn sits directly under WhatsApp because it is the primary international
connection, but there is no URL yet, so the row currently renders as a dashed,
non-clickable "coming soon" placeholder.

**Before publishing, do one of these two things:**

1. Replace that `<li>` with the working LinkedIn row — it is right there in the
   commented-out block below the list — and put the real profile URL in
   `REPLACE_LINKEDIN_URL`; or
2. Delete the placeholder `<li>` so the row does not appear at all.

Do not publish with the row still saying "coming soon".

GitHub and Website are also commented out at the end of the list; delete the
`<!--` / `-->` markers and add the URL to switch either on.

Each URL appears **once**, in the Connect section only.

All photos are in place; nothing else is required before publishing.

### The Sakurajima time-lapse

`images/sakurajima.mp4` is an 18.5-second silent loop cut from the original
51-second clip, with the black side bars removed and the end cross-faded back
into the beginning so the loop has no visible jump.

How it behaves:

- `autoplay muted loop playsinline` — the combination every mobile browser
  allows silently. It starts on its own and never stops; nothing in the code
  pauses it.
- `script.js` retries if a browser refuses: when the file becomes playable, when
  the section scrolls into view, when the tab comes back to the front, and once
  on the visitor's first tap anywhere on the page.
- Only if all of that fails does a small play button appear over the poster.
- `prefers-reduced-motion: reduce` → it never plays; the poster frame stands in
  as a still photo.
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
