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

## Imagery

Sourced from `Rent_a_Place_Visual_Pack.zip`. **Every photograph on the site is an
AI-generated illustrative concept.** None of them depict the advertised units,
the real business, or verified Chilliwack locations. The pack's own
`README_FIRST.txt` states this, and the listings section carries a visible
disclosure saying so.

Placed (11 slots, 8 distinct photographs):

| Slot | File | Native size |
| --- | --- | --- |
| Hero background | `hero-valley-street.webp` | 1672x941 |
| The Corner Two | `units/corner-two.webp` | 502x262 |
| Garden Level One | `units/garden-level-one.webp` | 316x190 |
| Vedder Row | `units/vedder-row.webp` | 499x259 |
| The Lookout | `units/the-lookout.webp` | 296x192 |
| The Small Door | `units/the-small-door.webp` | 503x262 |
| Renter Support | `services/renter-support.webp` | 510x260 |
| Honest Listings | `services/honest-listings.webp` | 506x260 |
| Property Care | `services/property-care.webp` | 266x174 |
| Clear Terms | `services/clear-terms.webp` | 312x190 |
| Owner Management | `services/owner-management.webp` | 246x176 |

Deliberately not placed:

- `07_rental_retail.webp` is a residential exterior, not a retail frontage. The
  Young Street Front listing and the Commercial Leasing card both show a flagged
  "photograph pending" plate instead.
- `09_local_area.webp` is not a genuine Chilliwack landmark. The Area section
  keeps its real Google Maps embed rather than implying a fake local photo.
- `11_contact_cta.webp` is 293x199, too small for any slot on the page.

Known problems with the supplied assets:

- Four crops arrived with caption bars and slivers of neighbouring tiles burned
  into the pixels ("04. Bedroom 1", "05. Bedroom 2", "10. Laundry", "Outdoor
  Space"). These were cropped off, which is why their sizes above are smaller
  than the manifest's.
- The pack contains duplicates: `02`/`13` are the same living room, `03`/`10`
  the same bedroom, `06`/`12` the same kitchen. Each pair is assigned to both a
  listing and a service card, so three photographs appear twice on the page.
- `08_owner_property_care.webp` is a backyard patio, not the "maintained
  residential street" the manifest describes.
- Every non-hero image is roughly 250-510px wide against card slots that want
  ~800px at 2x. They are soft on high-density screens.

Needed from the client: real photographs of all six units, a verified Young Road
frontage shot, licensed Chilliwack area photography, and confirmation of every
unit name, specification and availability date.

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
