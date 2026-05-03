# Blood Money

## What This Is

Blood Money is a static website that lets visitors browse a curated list of movies and TV shows with Saudi Arabian financial backing. The goal is transparency -- making it easy for anyone to see which films and shows have ties to Saudi money.

The site will live on GitHub Pages, so everything must be built with plain HTML, CSS, and JavaScript only. No backend, no server, no build tools required.

---

## Project Goals

- Show a browsable, searchable list of Saudi-backed films and TV shows
- Pull data from a public API (see Data Source section below)
- Make it easy to embed as a page on an existing website
- Keep it fast, simple, and dependency-light

---

## Data Source

Use the TMDB API (The Movie Database) as the primary data source for film and show metadata (titles, posters, descriptions, release dates).

Saudi backing information will be maintained in a local `data/titles.json` file. This JSON file is the source of truth for which titles are flagged and why. Each entry should include:

- Title name
- TMDB ID (so we can fetch poster/metadata from the API)
- Type: movie or tv
- Saudi connection: a brief plain-English note explaining the funding link (e.g. "Produced by MBC Studios, owned by Saudi state media")
- Source URL: a link to a credible news article or report documenting the connection

The app fetches metadata from TMDB using the TMDB ID, and merges it with the local Saudi connection data before rendering.

---

## File Structure

```
blood-money/
├── CLAUDE.md          # This file
├── index.html         # Main page
├── style.css          # All styles
├── app.js             # All JavaScript logic
└── data/
    └── titles.json    # Curated list of Saudi-backed titles
```

---

## What to Build

### index.html

- Clean, bold header: "Blood Money"
- Subtitle: "Movies and TV shows backed by Saudi Arabia"
- A search/filter bar so users can filter by title or type (movie vs TV)
- A card grid that renders each flagged title
- Each card should show: poster image (from TMDB), title, year, type (movie/tv badge), and a short Saudi connection summary
- Clicking a card should expand or link to show the full connection note and source URL
- A footer with a note that this is a community-maintained list and a link to contribute (GitHub repo)

### style.css

- Dark background, bold typography
- Color palette: deep black/charcoal, white text, blood red accent (#8B0000 or similar)
- Cards should be clean and grid-based, responsive for mobile
- The overall feel should be serious and journalistic, not playful

### app.js

- On page load, fetch `data/titles.json`
- For each title, call the TMDB API to get poster and metadata
- Render the cards into the grid
- Wire up the search/filter bar to filter the displayed cards in real time
- Handle missing posters gracefully (fallback placeholder)

### data/titles.json

Seed the file with 5-10 real, well-documented examples of Saudi-backed productions to start. Each should have a credible source URL. Research these carefully -- accuracy matters.

Example shape:
```json
[
  {
    "id": "saudi-neom-film",
    "tmdb_id": 12345,
    "type": "movie",
    "saudi_connection": "Financed in part by NEOM, the Saudi mega-city project funded by the Public Investment Fund (PIF).",
    "source_url": "https://example.com/article-about-this"
  }
]
```

---

## TMDB API

- Sign up for a free TMDB API key at https://www.themoviedb.org/settings/api
- Store the API key as a plain `const` at the top of `app.js` -- this is a public read-only key and safe to expose in a static site
- Use the TMDB v3 API endpoint: `https://api.themoviedb.org/3/movie/{tmdb_id}` or `/tv/{tmdb_id}`
- Poster images: `https://image.tmdb.org/t/p/w500/{poster_path}`

---

## Tone and Editorial Standards

- This site makes factual claims. Every flagged title must have a real, documented Saudi funding connection.
- The "saudi_connection" field should be one to two sentences, factual, and sourced.
- Do not include titles based on rumor or speculation.
- The design should feel like investigative journalism, not clickbait.

---

## Embedding on an Existing Site

The final `index.html` should be written so it can also be dropped in as a standalone page on an existing site with minimal friction. Avoid hardcoded absolute paths. Use relative paths throughout.

---

## How to Deploy

1. Push the folder to a GitHub repository
2. Go to Settings > Pages in the repo
3. Set the source to the `main` branch, root folder
4. GitHub will publish the site at `https://yourusername.github.io/blood-money`

---

## What to Do First

1. Create the file structure above
2. Build `index.html`, `style.css`, and `app.js` as described
3. Seed `data/titles.json` with real documented examples
4. Test locally by opening `index.html` in a browser
5. Confirm the TMDB API calls work and cards render correctly
