# Lightbank rebuild — notes

Plain HTML/CSS/JS, no build step. Open `index.html` directly or serve the folder with any static file server.

v3: bold layout & motion, using the real logo file and the real hero photo (the frosted bison/buffalo shot) pulled directly from Lightbank's own asset CDN, plus a new orange accent color.

## Structure
- `index.html` — full-bleed bison photo hero (the same one on the live site), then a huge type headline, an infinite-scroll marquee of portfolio names, and a stripped-back index linking to the other pages
- `team.html` — full-bleed hover rows (name inverts to dark on hover) instead of a static 3-column list
- `companies.html` — 128 portfolio companies as a bordered "wall" grid, each tile inverts to brand-brown on hover
- `blog.html` — editorial-style list with bold uppercase headlines and real external source links for all 10 posts
- `jobs.html` — big bold CTA hero linking out to the existing Getro-powered job board (`jobs.lightbank.com`) instead of statically rebuilding 600+ live listings
- `css/styles.css` — type scale, motion (scroll-reveal, marquee, hover transforms), brand tokens as CSS variables
- `js/nav.js` — mobile nav toggle + IntersectionObserver scroll reveals + marquee loop setup

## Logo & hero photo
Both are referenced directly from Lightbank's live Squarespace asset CDN (`images.squarespace-cdn.com/.../logo-dark...png` and `.../buffalo2+2.png`) — these are Lightbank's own current files, so the logo is now pixel-exact rather than a text approximation. For a real handoff you'll want to download both and self-host them (drop into `assets/` and update the two `src` attributes) rather than hotlinking a CDN you don't control long-term.

## Orange accent
Added `--color-orange: #e08a3e` as a CSS variable, sampled by eye from the swatch you sent — worth double-checking against your actual brand hex if you have one on file. Used sparingly: section eyebrow labels, nav underline on hover/active, the marquee band's top/bottom border, blog post dates, and CTA links/underlines. Kept off the big structural surfaces (backgrounds, headings) so it reads as an accent, not a repaint.

## Placeholder copy — needs your review
The live homepage has no body copy at all (just logo + nav + the bison photo). I wrote placeholder headline/subhead copy ("We back builders who break things," the "what we do" blurb, footer CTA) to fill out the page. Founding year (2010) and portfolio count (128, matching what's listed on lightbank.com/companies) are verified — the rest is marketing copy for you to keep, edit, or replace outright.

## Brand tokens
- Font: **Barlow** (Google Fonts), weights 400/600/700/800
- Brown (logo/nav/hover-invert): `#3f2b21`
- Headings: `#282d30`
- Orange accent: `#e08a3e`
- Alt section background: `#efefef`

## Motion notes
- Sections fade/slide in on scroll (`.reveal`, `.reveal-stagger` — respects `prefers-reduced-motion`)
- Home page has an infinite CSS marquee of portfolio company names, bordered in orange
- Team rows and company tiles invert color on hover
- Header is sticky with a frosted-glass (blurred, translucent) background so it stays legible over both the photo and plain sections

## External links
All external links (Investor Login, blog "Read", jobs board) use a shared `.ext-link` style — small arrow glyph that nudges on hover — so they read as distinct from internal navigation, per your direction to restyle (not re-target) external links.
