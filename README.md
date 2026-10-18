# Rent a Place - Easy Rentals (Chilliwack, BC)

Static one-page marketing site. No build step, no dependencies to install.
Serve the folder and it runs.

```bash
python -m http.server 5173
```

Then visit http://localhost:5173

## Design system

Carried over from the Hosted Havens build so the two sites read as one studio:

- **Palette:** warm cream page (`--cream-page #f4e5d0`), cream cards (`--cream #fdf4e8`),
  blush / peach / pink-soft washes, coral accent (`--coral #ff8c72`,
  `--coral-deep #e5664a`, `--coral-ink #b8452c`), gold and sage as secondary,
  brown-black ink (`--ink #2a1f1a`).
- **Type:** Cormorant Garamond for headings (italic coral for the emphasis phrase),
  Inter for everything else.
- **Shape:** large radii (18 / 28 / 32 / 40px), floating glass panels, soft warm
  shadows, no hard borders.
- **Patterns:** floating pill header, hero with glass cards over a photo plate,
  eyebrow with rules, chip clouds, service cards with mini UI mockups, numbered
  process circles on a connecting line, listing cards with tag pills.

Every token lives in `:root` at the top of `assets/css/styles.css` and matches the
Hosted Havens variable names, so values transfer between the two projects.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole page: header, hero, services, offer, stats, process, rentals, area, contact, footer |
| `assets/css/styles.css` | Design system and layout, tokens at the top |
| `assets/js/main.js` | Sticky header, mobile menu, scroll reveals, card tilt, form guard |
| `assets/img/favicon.svg` | Favicon |
| `assets/js/hero3d.js` | **Unused.** The WebGL block-city hero from the first draft, kept in case you want it back. Nothing loads it |
| `.claude/launch.json` | Local preview config for the Claude Code browser pane |

## Before this goes live

1. **Listings are placeholders.** The six cards in `#rentals` use warm gradient
   plates instead of photos. Replace each `.unit__media` div with a real
   `<img src="assets/img/unit-x.jpg" alt="...">`, and confirm the unit names,
   specs and availability tags. Rents are deliberately absent; add a price line
   once they are confirmed.

2. **Service cards use placeholder plates too.** Same treatment in `#services`
   (`.svc__media`). The little glass mockups sitting on them are decorative and
   can stay.

3. **The contact form has no backend.** `action="#"` is a placeholder. Until an
   endpoint is wired (Formspree, Netlify Forms, or a Vercel function), the
   submit handler in `main.js` blocks the post and shows the phone number
   instead. Point the form at a real handler and delete that fallback.

4. **Confirm the contact details.** The page currently uses:
   - Phone `778-312-1408` (matches the Google Business Profile)
   - Email `office@ratzlaffco.ca` (as supplied; that domain belongs to
     Ratzlaff & Co. in Abbotsford, so confirm it is the right inbox)

   Both appear in `index.html` and in the JSON-LD block in `<head>`.

5. **No street address is published.** The Google listing does not show one
   either. If there is a public office address, add it to the JSON-LD `address`
   block and the contact section for local SEO.

6. **Add an OG image.** `<meta property="og:image">` points at
   `assets/img/og-cover.jpg`, which does not exist yet. 1200x630.

7. **Add the website to the Google Business Profile** once deployed. The listing
   has no website link at all right now.

## Notes

- Tested at 1280px and 375px wide. No console errors.
- Scroll reveals, card tilt and the hero float stack all respect
  `prefers-reduced-motion`.
- The hero "I'm renting / I own a property" pills are anchor links to `#rentals`
  and `#services`, not a JS toggle.
