# Browser Homepage with Bookmarks

A personal new-tab / start page built with React, Vite and Tailwind CSS. It replaces the browser's default homepage with a clock, a search bar, and bookmarks organised into named sections that can be edited directly on the page.

## Why this exists

The browser's built-in homepage works, but its bookmark bar runs out of room after 10 to 20 links. I regularly need many more than that, and what I need changes over time. A link I open ten times a day this week might be irrelevant next month once I move on to a different task.

This project is my answer to that:

- **Room for many bookmarks.** Sections hold as many links as needed and the page scrolls.
- **Grouping.** Bookmarks live in sections such as Work, Dev, Social or Entertainment, so related links sit together.
- **Easy to reshape.** Add, rename, reorder or remove sections and bookmarks in an edit mode on the page itself. When my focus shifts, I prune what I no longer use and promote what I am working on now.
- **Portable.** The end goal is a folder I can copy to any computer and open with no install steps.

## Features

- Greeting and 12-hour clock with the current date
- Search bar that opens Google, or navigates directly when the input looks like a URL
- Bookmark tiles with favicons fetched automatically from the site's domain
- Sections with a heading and a grid of bookmarks
- Edit mode for adding, editing and removing bookmarks, plus renaming, reordering and deleting sections
- Custom favicon URL override per bookmark
- Dark and light mode toggle, remembered between visits

## Current state

The app is a working single-page React app served by the Vite dev server. Sections and bookmarks are held in memory and reset to the defaults defined in `src/App.tsx` on every reload. Only the dark mode preference is persisted, in `localStorage`.

Storage is the next problem to solve. See the roadmap below.

## Roadmap

1. **Move bookmarks into a JSON file.** Keep sections and bookmarks in a pretty-printed `bookmarks.json` so they can be bulk-edited in any code editor and version controlled.
2. **Write in-app edits back to that file.** Use the File System Access API (Chromium browsers) so edits made on the page land in the JSON file. Fall back to `localStorage` plus an Export button in browsers that cannot write files.
3. **Portable build.** Bundle the app into a single self-contained `index.html` that sits next to `bookmarks.json`. Copy the folder anywhere, double-click the HTML, no Node or install needed.
4. Later ideas: keyboard shortcuts, drag-and-drop reordering, per-section collapse, import from browser bookmarks.

## Project structure

```
index.html          Vite HTML shell
src/main.tsx        React entry point
src/App.tsx         The whole app: clock, search, sections, modals, edit mode
src/index.css       Tailwind CSS import and global styles
vite.config.ts      Vite config with React and Tailwind plugins
.mise.toml          Pinned toolchain: Node 22, pnpm 10
```

## Development

Requirements: Node 22 and pnpm 10. If you use `mise`, it reads `.mise.toml` and installs both. With `nvm`:

```bash
source ~/.nvm/nvm.sh && nvm install 22 && nvm use 22
npm install -g pnpm@10
```

Install and run:

```bash
pnpm install
pnpm dev --port 8443
```

Open http://127.0.0.1:8443/ in the browser. Changes to `src/` hot-reload.

Other scripts:

```bash
pnpm build      # production build into dist/
pnpm preview    # serve the production build locally
pnpm format     # format with oxfmt
npx tsc --noEmit  # type check
```

## Stack

- React 19
- Vite 8
- Tailwind CSS v4 via `@tailwindcss/vite`
- TypeScript 5

Originally scaffolded in Figma Make.
