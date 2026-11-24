# WUFBON website

Static website: open `index.html` in a browser, or upload the whole folder to any web host (cPanel, Netlify, GitHub Pages).

## Pages
- index.html: Home
- temba-emeeza-movement.html: Program 1
- caren-mccormack-facility.html: Program 2
- green-schools.html: Program 3
- quaker-financial-services.html: Program 4
- conservation-and-ecotourism.html: Programs 5 & 6 (#nsinde, #elephants)
- projects-and-track-record.html: Track record, policy milestones, partnership archive
- sustainability-test.html: Five-Question Financial Exit Test
- resources.html: Resources & Publications (JISRA Religious Dialogue News 2024)
- learning-hub.html: Learning Hub (Faith & Culture newsletter, June 2022)
- donate.html, contact.html

The program pages are grouped in the "Programs & menu" (hamburger) button at the top right of every page.

## Photos
All photos live in `assets/img/`. To swap one, replace the file with a new photo of the same name, or change the `src="assets/img/..."` in the page and update its `alt` text (a short description of the photo).
To add a photo to a gallery, copy one of the `<img ...>` lines inside a `<div class="gallery">` block. Add `class="wide"` to make it span two columns.

## Logo
The official WUFBON logo is at `assets/img/wufbon-logo.png` (favicon: `assets/img/favicon.png`).

## Contact form (Formspree)
The form already sends to Formspree in the background and shows a success or error message on the page. You only need your form ID:
1. Sign up free at https://formspree.io and click **New form** (use the inbox that should receive messages, e.g. ugandafbonetwork@gmail.com).
2. Copy the form ID: the code after `/f/` in the endpoint, e.g. `https://formspree.io/f/xyzabcd` gives `xyzabcd`.
3. In `contact.html`, search for `YOUR_FORM_ID` and replace it with your ID.
4. Upload the site and send one test message. Formspree asks you to confirm the first one by email.

Until step 3 is done, the form tells visitors to email the Secretariat directly.

## Animation
Animations live at the end of `assets/css/style.css` (Motion section) and in `assets/js/main.js`. They switch off automatically for visitors who have "reduce motion" turned on in their device settings.

## Hospital donations
Every "Donate to the Hospital" button links to the Every.org fundraiser for the Caren McNelly McCormack facility:
https://www.every.org/western-uganda-fbo-network/f/caren-mcnelly-mccormack
The orange "Donate" button in the top bar still opens donate.html, which covers every way to give.

## Adding publications
1. Put the PDF in `assets/docs/` and a cover image (page 1 as a JPG) in `assets/img/covers/`.
2. In resources.html or learning-hub.html, copy an `<article class="pub">` block and change the title, text, image and PDF links, or replace one of the "Add publication" placeholders.
