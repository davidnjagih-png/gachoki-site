# Hon. Gachoki Gitari: portfolio site

A portfolio in the person's own words: Profile, Selected work, Career, Vision, Press and Gallery,
with a private dashboard at `/admin` for updating work, press and photos. No CV page.

## Run it
```
npm install
npm run dev        # http://localhost:5173
npm run build      # output in dist/
```
Without Firebase the site shows sample content, so every page can be previewed.

## 1. Connect the dashboard (Firebase, free plan)
1. console.firebase.google.com: Add project. Build > Firestore Database > Create (production mode).
2. Build > Authentication > Get started > Email/Password > enable. Users tab: Add user (the owner's email and a password).
3. Project settings > General > Your apps > Web (`</>`). Copy `apiKey`, `authDomain`, `projectId`, `appId` into `firebase` in `site.config.js`.
4. Firestore > Rules: paste the contents of `firestore.rules`, Publish.
5. Firestore > Start collection `admins`. Document ID = the user's UID (Authentication > Users > User UID). Add any field, e.g. `ok = true`.
6. Open `/admin`, sign in.

## 2. What the dashboard edits
- **Selected work**: title, category, year, place, one headline result, photo, optional link. Arrows reorder; top four show on Profile.
- **Press**: headline, type, outlet, date, link to the original, image.
- **Gallery**: "Upload several photos" adds many at once; then add captions and albums. Albums become filters.
- **Profile and career**: name, title, current position, opening sentence, portrait, wide photo and quote, headline numbers, career, education, committees, vision, contact, colours.
- **Messages**: contact form submissions.

**Import from file** (Selected work and Press): load many records at once from a `.json` or `.csv` file.
`content/gachoki-content.json` holds researched projects and press coverage with source links; import it on each screen.
For your own lists, click **CSV template**, fill it in Excel (one row per item, dates as 2025-09-15 or 15/09/2025),
save as "CSV UTF-8" and import. Items whose title is already listed are skipped, so importing twice is safe.

Photos are shrunk in the browser and stored in the database (no paid storage needed).

## 3. Before going live
- Set `siteUrl` in `site.config.js` to the real domain.
- Search engines read the built pages, so if the **current position** or **opening sentence** changes, update `role` in `site.config.js` and `intro` in `src/data/defaults.js`, then redeploy.
- Hosting: any static host (Cloudflare Pages, Netlify, Firebase Hosting). Build command `npm run build`, output `dist`. Set the SPA fallback to `/index.html` if the host does not do it by default.

## Facts used
Parliament of Kenya member page and Mzalendo: Kirinyaga Central, UDA, elected 2022 with 34,074 votes, current Lands and Regional Integration committees,
BSc Surveying (University of Nairobi, 1992 to 1997), KCSE Kamuiru Boys, GEO Acre Surveys Ltd (Chief Surveyor 1998 to 2011, CEO 2018 to 2022),
first elected at the February 2011 by-election, MP 2011 to 2017 with earlier committees, professional bodies, areas of interest. X handle @mp_gitari.
The office line "NG-CDF Office, Kerugoya" should be confirmed. Quote, vision, phone and email are blank until he adds them in /admin.
