# DevSolentz Portfolio

A traditional multi-page HTML/CSS/JavaScript portfolio. Each main category is a separate HTML file. **Home opens by default through `index.html`.** All content is directly present in its page, with normal page links, browser Back/Forward, and unique page titles.

## Open the website

Extract the ZIP, then double-click **index.html**. It opens Home. Click the navigation to open any other page.

No installation, framework, build output folder, or web server is required for local viewing. The JavaScript is a classic deferred script, so it supports directly opened HTML files. For hosting, upload the seven HTML files and the `css`, `js`, and `assets` folders to your website's document root.

## Website files

- `index.html` — Home, the default entry page.
- `packages.html` — all nine INR packages.
- `work-preview.html` — work gallery and 20+ servers counter.
- `services.html` — all four service categories and 31 services.
- `astralab.html` — AstraLab studio, owners, and links.
- `plugins.html` — all 17 plugin cards.
- `information.html` — profile, experience, and skills.
- `css/style.css` — shared appearance, responsive layouts, and animations.
- `js/main.js` — mobile menu, counters, cubes, parallax, and gallery lightbox.
- `assets/` — five original supplied PNGs, favicon, fonts, and screenshot source references.
- `portfolio-data.json` — full supplied content and screenshot metadata for reference.
- `tools/` — optional development server and validation utilities.

There are no `src`, `dist`, `public`, or `node_modules` folders.

## Optional development commands

Requires Node.js 20+ only if you choose to use these commands. No third-party dependencies are required.

```sh
npm run dev
npm run build
npm test
```

The optional server opens Home at `http://localhost:4173/`. The build command updates the gallery from the actual local image files and checks the existing website in place. It does not create an output folder. Edit any HTML page, CSS, or JavaScript directly.

## Missing screenshot files

The original eleven Discord screenshot URLs returned access errors in the previous version. The five attached PNGs are included locally. **The eleven original gallery JPGs are still missing.** Their exact source URLs are preserved in `assets/work-sources.json`; the gallery reports unavailable files and never substitutes fabricated work.

Add the original images as `assets/work-01.jpg` through `assets/work-11.jpg` in the supplied order, then run `npm run build` to enable those gallery cards. You can also try `node tools/download-screenshots.mjs` to retry the source links. Use `npm run test:complete` for a strict check that fails while any required screenshot is missing.

## Interactions and accessibility

The mobile menu, active page navigation, keyboard focus, skip link, image alt text, animated counters, floating cubes and particles, desktop parallax, reduced-motion support, and image lightbox are implemented. The work-page lightbox supports keyboard controls, previous/next, fullscreen where available, and swipe navigation. All page navigation and portfolio content remain available with JavaScript disabled.

## Content and assets

All names, prices, features, services, plugin descriptions, owners, links, and numerical claims come from the supplied brief. No client names, testimonials, versions, ratings, or download counts were added. Three Astra plugin cards identify their series because no functional descriptions were provided.

The Online indicator is a presentation state as requested; there is no live Discord presence integration. The utilities URL is preserved exactly as supplied: `https://utitlies.astralab.fun`.

The supplied PNG copies have flattened black backgrounds. CSS screen compositing integrates them into the dark environment without altering the originals. Fonts are bundled locally with their SIL Open Font License files.

## Verification

The seven-page structure, correct Home entry page, real page links, internal fragment targets, active navigation, static content inventory, local asset/font references, JavaScript syntax, and production server responses are checked. The build completes successfully. The missing screenshot assets remain a documented limitation. Browser visual and interaction QA was unavailable, so no full browser-tested claim is made.

© DevSolentz. All rights reserved.
