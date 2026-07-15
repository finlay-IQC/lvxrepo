# LVX Limited — Renovation Call Funnel

A five-page paid-media funnel for cold Google Ads traffic. Vanilla HTML, CSS,
and JavaScript — no frameworks, no build step. Just host the files.

## File tree

```
/
├── conversions.html   Loft conversions landing page
├── extensions.html    Extensions landing page
├── renovations.html   Full house renovations landing page
├── kitchens.html      Kitchen refurbishment landing page
├── thank-you.html     Confirmation page (call/text incoming)
├── privacy.html       Privacy policy placeholder
├── terms.html         Terms of service placeholder
├── styles.css         All styling
└── script.js          UTM handling, sticky CTA, FAQ accordion, scroll-to-form
```

## Funnel flow

Ad → landing page (`conversions` / `extensions` / `renovations` / `kitchens`) →
qualification form → `thank-you.html`.

Every primary CTA scrolls to the on-page form section (`#form`). A phone number
(07711 788515) is present throughout, including a sticky mobile call button.

## Setup checklist before going live

1. **Tracking codes.** Search each HTML file for `TRACKING HEAD CODES`,
   `TRACKING BODY CODES`, `[GTM HEAD]`, and `[GTM BODY]` and paste your GTM /
   GA4 / Meta Pixel snippets. Head codes go in `<head>`; body codes go
   immediately after `<body>`.
2. **Conversion event.** On `thank-you.html`, find `CONVERSION EVENT GOES HERE`
   and add your booked-call conversion (Meta Schedule, Google Ads, GA4). Do NOT
   fire this on the landing pages.
3. **Form redirect.** In GoHighLevel / LeadConnector, set the form's
   on-submit redirect to `thank-you.html` so qualified leads land on the
   confirmation page.
4. **UTM into the form.** UTM and click IDs (`utm_*`, `gclid`, `fbclid`,
   `ttclid`, `msclkid`) are captured to `sessionStorage`, appended to the
   internal link through to `thank-you.html`, and appended to the form iframe
   `src`. Because the iframe is cross-origin, map those URL params to hidden
   fields inside GHL, or switch to a native form with hidden inputs named after
   each key (script.js auto-fills those). See the `UTM NOTE` comment in each
   landing page.
5. **Images.** The pages currently use Unsplash placeholder photography. Drop
   the client's project photos into an `/images` folder and replace the
   `images.unsplash.com` URLs (hero `--hero-img`, mechanism `background-image`,
   gallery `--gal-img`, final CTA `--cta-img`).
6. **Proof.** Testimonial names, project stats, and the review rating are
   placeholders — swap for real, approved proof.
7. **Legal.** `privacy.html` and `terms.html` are placeholders; have them
   reviewed before launch.
