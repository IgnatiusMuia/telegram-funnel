# AryanXclusive — Telegram Funnel (X Ads Landing)

Single-purpose landing page for converting X (Twitter) ad traffic into `t.me/Aryan_XCLUSIVE`
joins. Static HTML/CSS/JS — no build step, loads in well under a second.

## Live URLs

- **Netlify:** https://aryanxclusive-funnel.netlify.app
- **GitHub Pages:** https://ignatiusmuia.github.io/telegram-funnel/

## Point X ads at

```
https://aryanxclusive-funnel.netlify.app/?utm_source=x&utm_medium=paid&utm_campaign=<campaign>&utm_content=<variant>
```

UTM values are captured on every event (`page_view`, `telegram_join_click`,
`telegram_confirm`, `telegram_join_blocked_18`, `sticky_cta_view`, `faq_open`,
`countdown_zero`) and pushed to `window.dataLayer`. Use a distinct
`utm_campaign` + `utm_content` per ad set so the dataLayer shows which creative
drove joins. Create a **separate Telegram invite link per campaign** in the
channel settings (Invite Links → per-link member stats) to measure joins per ad.

## Structure

- `index.html` — all copy (headlines, benefits, testimonials, FAQ)
- `styles.css` — design system, phone mockup, sticky bar
- `script.js` — t.me links, 18+ gate, countdown, UTM capture, dataLayer events
- `assets/og.jpg` — link-card image (1200×630, rendered from `og.svg`)

The 18+ confirmation gate on every CTA is the compliance hook — keep it. The
page is `noindex` by design: it exists to convert paid traffic, the main site
owns organic search.

## Regenerate the OG image

Edit `assets/og.svg`, then render at 2x and crop the center band to 1200×630
(the source is 1200×630 centered in a square render):

```sh
qlmanage -t -s 2400 -o /tmp assets/og.svg
sips -c 1260 2400 /tmp/og.svg.png --out /tmp/og-2x.png
sips -Z 1200 /tmp/og-2x.png --out /tmp/og.png
sips -s format jpeg -s formatOptions 85 /tmp/og.png --out assets/og.jpg
```

## Deploy

- **GitHub Pages:** enabled in repo settings (Pages → Deploy from a branch, `main` root).
  Any push to `main` goes live automatically at the URL above.
- **Netlify:** `netlify deploy --prod --dir .` from this folder (netlify.toml sets
  cache + security headers, applied on the live site). Site: aryanxclusive-funnel.

## Compliance

Russia, 18+. Responsible-gambling footer, no-guarantees disclaimer, transparency
note, affiliate disclosure, 18+ gate on every CTA. Keep these if you edit copy.
