# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS personal website and portfolio hosted on GitHub Pages at boxyourbuddy.com. No build process — files are served directly.

## Deployment

Push to `main` branch → GitHub Pages auto-deploys to boxyourbuddy.com (configured via `CNAME`). No build step required.

## Architecture

Pure HTML5 + CSS3 (no frameworks, no JavaScript bundlers). Each page is a self-contained `.html` file with embedded `<style>` blocks and inline scripts.

**Site structure:**
- `/index.html` — landing page with animated SVG text and rotating hero eye image
- `/apps/index.html` — macOS app showcase
- `/tv-stats-tracker/index.html` — TV Stats product page (main app marketing page)
- `/tv-stats-tracker/tv-stats-features/index.html` — extended features page
- `/writing/index.html` — blog listing
- `/writing/simple-solution-for-hiccups/index.html` — individual article

**Design system (consistent across all pages):**
- Background: `#000000`, cards: `#111111`, text: `#ffffff`, accent: `#FFF0AD`
- Typography: `-apple-system, BlinkMacSystemFont, Arial` stack; fluid sizing via `clamp()`
- Google Analytics via gtag (`GA-7NDGQGQM5G`) is present on marketing pages

**TV Stats product pages** use JSON-LD schema markup for SEO and follow a privacy-first messaging angle: no ads, no subscriptions, no cloud, local-only data storage.

**Adding a new blog post:** create a new subdirectory under `/writing/`, add `index.html` following the existing article pattern, then add a card link in `/writing/index.html`.

**Images** live in `/images/` — use descriptive names matching the existing convention (e.g., `tv-stats-feature-*.png`).

## Adding a New Story from Medium

When I give you an exported Medium HTML file, do the following automatically:

1. Read the title, date, and body content from the Medium HTML
2. Create a new folder inside `/writing/` named after the story title in lowercase with hyphens (e.g. "Made of Concrete" becomes `made-of-concrete`)
3. Inside that folder create `index.html` using this exact template style:
   - Black background #000
   - Same header as writing/index.html with logo, brand name, and nav
   - Back link goes to /writing/
   - Story title as h2
   - Date and "Dan Stout" as meta line
   - HR divider
   - Story body text styled as paragraphs with font-size 1.05rem, color #ccc, line-height 1.8
   - Google Analytics tag G-7NDGQGQM5G
   - Favicon /favicon.png
4. Open `writing/index.html` and add a new card at the top of the cards list with:
   - Title from the story
   - First sentence of the story as description
   - Date formatted as Month DD, YYYY
   - Link pointing to the new folder
   - Always include this image line in every card:
     ```html
     <img src="../images/xxxx.png" alt="[story title]" class="card-img">
     ```
     Leave the filename as `xxxx.png` — the user will rename it to match the actual image.
5. Do not change any other files.
6. Report back what you created and where.
