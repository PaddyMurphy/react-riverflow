# Riverflow (React)

Current Texas river flow (CFS) pulled from the [USGS Water Data APIs](https://api.waterdata.usgs.gov/) (OGC API - Features).

Originally bootstrapped with Create React App in 2016; migrated to **Vite + React 18** in 2026.

## Tech stack

- [Vite](https://vitejs.dev/) build tooling
- [React 18](https://react.dev/) (class components)
- [React Router v6](https://reactrouter.com/) (`HashRouter`, for GitHub Pages)
- [Bulma](https://bulma.io/) + [Dart Sass](https://sass-lang.com/) for styling
- Native `fetch` for the USGS API
- [Recharts](https://recharts.github.io/) for the interactive 7-day flow graph
- [Vitest](https://vitest.dev/) for tests

## Requirements

- Node.js 18+ (developed against Node 22)

## Scripts

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173/react-riverflow/)
npm run build      # production build to dist/
npm run preview    # preview the production build locally
npm test           # run the test suite once
npm run test:watch # run tests in watch mode
npm run deploy     # build and publish dist/ to GitHub Pages
```

## USGS API key (optional)

Data comes from the modernized [USGS Water Data APIs](https://api.waterdata.usgs.gov/)
(`/ogcapi/v0/collections/continuous`). Anonymous requests are limited to **50 per
IP per hour**; registering a free [API key](https://api.waterdata.usgs.gov/signup/)
raises this to **1,000 per hour**.

To use a key, set a Vite env var (e.g. in `.env.local`) and it will be appended
to every request automatically:

```bash
VITE_USGS_API_KEY=your_key_here
```

Note: in a static client-side build the key is visible in network requests, so
only use a key dedicated to this app. The app works without a key for typical use.

## Notes

- The app uses `HashRouter` and a Vite `base` of `/react-riverflow/` so it works
  when served from a subpath on GitHub Pages.
- `src/components/Map` is legacy/unused (its import in `App.js` is commented out).
  It still references the old `google-maps` package, which is no longer a
  dependency — re-enable it only after reinstating that package.
