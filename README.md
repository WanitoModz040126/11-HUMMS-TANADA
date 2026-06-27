# 11 - HUMSS (TAÑADA) · S.Y. 2026-2027

A class page built with Next.js. It introduces the adviser, the officers,
the girls and boys of the section, a Queen of the Room, a Palaban na
Pinay, and a gallery for class photos and videos. It has two separate
"like/heart" systems, explained below, and a background music player
that pauses automatically while a video with sound is playing.

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Next.js API routes (`app/api/*`) + Upstash Redis (for the site-wide like counter, the per-profile/per-photo heart counts, and rate limiting)
- **Hosting:** Vercel

All visual elements (buttons, layout, animation) live in `components/`.
All logic that needs to be trusted — counting likes and hearts, rate
limiting — lives in `app/api/` and `lib/`, and runs on the server, not
in the browser.

## 1. Install

```bash
npm install
```

This also runs `scripts/generate-manifest.js` automatically (via the
`predev`/`prebuild` hooks), which scans your photo folders and writes
`public/manifest.json`.

## 2. Add your real names

Open `data/members.json` and fill in:

- `adviser.name` / `adviser.title`
- `officers` — 10 entries (position + name)
- `girls` — list of female students
- `boys` — list of male students
- `queenOfTheRoom.name`
- `palabanNaPinay.name`

The **order** of each array matches the photo numbering described
below (the 1st girl in the list uses `girl/1.png`, the 2nd uses
`girl/2.png`, and so on). Add, remove, or reorder entries freely — just
remember that doing so shifts which photo number belongs to which
person, so update the matching photo folder whenever you change a list.

## 3. Add your real photos

Photos go directly into `public/`, no code changes needed:

| Folder | What goes there | Naming |
|---|---|---|
| `public/adviser/` | 1 photo | `1.png` |
| `public/officer/` | one photo per officer in the list | `1.png` … `10.png` |
| `public/girl/` | one photo per entry in `girls` | `1.png` … `9.png` |
| `public/boy/` | one photo per entry in `boys` | `1.png` … `14.png` |
| `public/queen/` | 1 photo | `1.png` |
| `public/palaban/` | 1 photo | `1.png` |
| `public/assets/` | gallery photos & videos, any amount | `1.png`, `2.png`, `3.mp4`, `4.png`, … up to `400+` |

`.jpg`, `.jpeg`, `.webp` and `.gif` also work for photos; `.mp4`,
`.webm` and `.mov` work for gallery videos.

**The gallery only shows what is actually in `public/assets`.** Drop in
as many numbered files as you want — 35, 200, 400+ — in any mix of
photos and videos, with any gaps in the numbering. Run `npm run
manifest` (or just redeploy, since this runs automatically before every
build) and every file that is physically present shows up. Nothing is
padded with placeholders.

If a numbered photo is missing for anyone (adviser, officer, girl, boy,
queen, palaban), their card automatically falls back to a colored
initial badge instead of a broken image, so nothing looks broken while
you're still collecting photos.

To keep the gallery smooth with very large libraries, it renders 60
items at a time with a "Load more" button instead of mounting all 400+
at once.

## 4. Add background music

Drop an MP3 at `public/music/bgm.mp3` (see `public/music/README.txt`).
No audio file is bundled in this template — use a track you have the
right to use.

A quick note on autoplay: browsers do not allow a page to play sound the
instant it loads without the visitor doing something first — this is a
browser rule, not something a website can override. That's what the
"Open the page" screen on load is for: it's the one tap that starts the
music, and it doubles as a nice entrance instead of feeling like a
workaround. Once started, the music loops continuously and automatically
pauses for the duration of any video that has sound, then resumes right
where it left off when the video ends or is paused.

## 5. Connect the database (Upstash Redis)

The site-wide like counter and the per-profile/per-photo hearts both need
somewhere to store their counts outside the browser.

1. Create a free account at [upstash.com](https://upstash.com) and create a Redis database.
2. Copy the **REST URL** and **REST Token** from the database dashboard.
3. Locally, copy `.env.example` to `.env.local` and paste them in.
4. On Vercel, add the same two values under **Project Settings → Environment Variables**.

Without these set, the site still runs — both counters just fall back to
an in-memory value that resets whenever the server restarts, which is
fine for local testing but not for production.

## 6. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 7. Deploy to Vercel

```bash
git init
git add .
git commit -m "Class website"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Then on [vercel.com](https://vercel.com): **New Project → Import** your
GitHub repo → add the two Upstash environment variables → **Deploy**.
Vercel detects Next.js automatically; no extra configuration is needed.

## Two heart/like counters, both shared across every visitor

This site has two separate reaction systems. Both are stored on the
server (Redis) and both are shared totals that every visitor sees and
contributes to — neither one is private to a single browser:

1. **Site-wide like counter** (floating heart, bottom-right corner of
   every page) — one shared number for "how many people liked this site
   overall." Backed by `/api/like`.
2. **Per-profile and per-photo hearts** — the small heart-with-a-number
   on every officer/adviser/student/queen/palaban card and every gallery
   photo or video. Each one has its own running total: if one visitor
   hearts a photo, it shows 1; when a second, different visitor hearts
   that same photo, it becomes 2; and so on — the same way a reaction
   count works on a social post. Backed by `/api/hearts`.

Both systems recognize "the same visitor" the same way: the first time
someone's browser hits either feature, it's given a random id that gets
saved in that browser's `localStorage`. The server remembers which ids
have already acted on which item, so refreshing the page never double
counts your own heart, and your heart total never disappears on refresh
— but a *different* visitor (different browser or device) always adds
their own, separate +1 on top of whatever the count already is. The
heart on a card or photo can be toggled on and off freely, like a
reaction button — tapping it again removes your heart and the total
goes back down by one.

Because the count lives on the server rather than in one browser, it is
correctly shared: 50 different people hearting the same class photo
shows "50," not "1" repeated 50 times in 50 separate browsers.

## Anti-abuse notes (read this — it's an honest explanation, not a sales pitch)

- **Rate limiting:** `/api/like` and `/api/hearts` are both throttled (a
  handful of requests per 10 seconds per IP) using Upstash's rate
  limiter, so a script can't spam either counter. Vercel's network
  already absorbs most large-scale traffic floods before they even reach
  these functions — this app-level limit is the second layer, protecting
  the API logic itself.
- **Right-click / view-source blocking:** this is included as a mild
  deterrent (`components/AntiCopyGuard.tsx`) against the laziest ways of
  grabbing the page. To be straightforward about it: **no website can
  fully prevent its code from being viewed.** Anything sent to a browser
  — HTML, CSS, JavaScript, images — can always be read through the
  browser's built-in developer tools or network panel. That is true for
  every site on the internet, not a flaw specific to this one. Treat
  this feature as a "please don't" sign, not a lock.
- Production builds are already minified by Next.js, which makes casual
  reading of the code harder without making it impossible.

## Project structure

```
app/
  layout.tsx          root layout, fonts, providers (music, hearts)
  page.tsx             assembles all sections
  globals.css
  api/
    like/route.ts      backend logic for the site-wide like counter
    hearts/route.ts     backend logic for per-profile/per-photo hearts
    health/route.ts
components/            all UI — sections, cards, buttons, gallery, music, hearts
lib/
  redis.ts             Upstash Redis client
  ratelimit.ts          rate limiter used by the API routes
  manifest.ts            typed wrapper around public/manifest.json
  visitorId.ts            shared per-browser visitor id, used by likes and hearts
data/
  members.json          section name, adviser, officers, girls, boys, queen, palaban
scripts/
  generate-manifest.js  scans public/ folders, writes public/manifest.json
public/
  adviser/ officer/ girl/ boy/ queen/ palaban/ assets/ music/
```

## Customizing the look

Colors, type, and spacing tokens live in `tailwind.config.js`
(`ink` = dark background shades, `marigold` / `coral` / `teal` = the
three accent colors used across officers / students / gallery). Fonts
are loaded in `app/layout.tsx` via `next/font/google`.
