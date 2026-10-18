# Rent a Place - Easy Rentals (Chilliwack, BC)

Static one-page marketing site. No build step, no dependencies to install.
Serve the folder and it runs.

```bash
python -m http.server 5173
```

Then visit http://localhost:5173

## Design system

Structure and layout carried over from the Hosted Havens build, recoloured to a
green and blue palette.

- **Palette:** green and blue only. Misted page (`--page #e9f1ee`), near-white
  cards (`--snow #f7fbf9`), moss and sky washes, forest green accent
  (`--green #2f8468`, `--green-deep #1f6350`, `--green-ink #14503f`), steel blue
  secondary (`--blue #4a8cb4`, `--blue-deep #2d6a90`, `--blue-ink #1d4e6c`),
  green-black ink (`--ink #0f211c`).
- **Hue split:** green carries action (buttons, ticks, confirmations, the italic
  headline phrase); blue carries labelling (eyebrows, section rules, stat
  figures, locations, secondary tags).
- **Type:** Cormorant Garamond for headings (italic green for the emphasis
  phrase), Inter for everything else.
- **Shape:** large radii (18 / 28 / 32 / 40px), floating glass panels, soft cool
  shadows, no hard borders.
- **Patterns:** floating pill header, hero with glass cards over a photo plate,
  eyebrow with rules, chip clouds, service cards with mini UI mockups, numbered
  process circles on a connecting line, listing cards with tag pills.

Every token lives in `:root` at the top of `assets/css/styles.css`. Section
modifiers are `.section--snow` (near-white) and `.section--wash` (moss to sky
gradient); the accent button is `.btn--accent`.

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

1. **Listings are placeholders.** The six cards in `#rentals` use green and blue
   gradient plates instead of photos. Replace each `.unit__media` div with a real
   `<img src="assets/img/unit-x.jpg" alt="...">`, and confirm the unit names,
   specs and availability tags. Rents are deliberately absent; add a price line
   once they are confirmed. Photos are being supplied, so the gradient plates
   come out when they land.

2. **Service cards use placeholder plates too.** Same treatment in `#services`
   (`.svc__media`), plus the hero plate (`.hero__photo`). The little glass
   mockups sitting on them are decorative and can stay once photos are in.

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
