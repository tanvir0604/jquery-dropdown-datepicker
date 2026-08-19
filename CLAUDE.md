# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`jquery-dropdown-datepicker` is a single-file jQuery plugin: three cascading
`<select>` dropdowns (day/month/year) that keep a hidden field (or the
original `<input>`) in sync with a formatted date string. No build tooling
runs at plugin runtime — the Grunt pipeline exists only to lint, concat a
license banner onto the source, and produce a minified `dist/` build.

There is exactly one source file: `src/jquery-dropdown-datepicker.js`. Every
other JS file in the repo is generated. **Never hand-edit anything under
`dist/`** — it's overwritten by `grunt`.

## Build workflow

```bash
npm install
npx grunt          # jshint -> concat -> uglify (also: npm run build)
npx grunt jshint    # lint only (also: npm run lint)
```

`Gruntfile.js` reads metadata (name/version/author/license) from
`plugin-config.json`, not `package.json`. When bumping a version, update it
in **all three**: `package.json`, `bower.json`, `plugin-config.json` — nothing
enforces they stay in sync, and the release banner injected into `dist/` is
sourced from `plugin-config.json` specifically.

After any change to `src/jquery-dropdown-datepicker.js`, run `npx grunt` and
commit the regenerated `dist/` files in the same change. This was previously
broken: the `concat` and `uglify` task `src`/`dest` pairs in `Gruntfile.js`
were swapped, so `dist/jquery-dropdown-datepicker.min.js` shipped
**unminified** and `dist/jquery-dropdown-datepicker.js` was minified but
frozen years out of date (missing most current config options). Fixed, but
watch for this class of bug again if the Gruntfile is touched — always spot
check that `dist/*.min.js` is actually minified and that both dist files
mention every option currently in `src/`.

## Code conventions

- ES5-only, jQuery plugin boilerplate style (`$.fn.dropdownDatepicker`).
  `.jshintrc` enforces `'use strict'`, single quotes, `===`, and flags unused
  vars — run `npx grunt jshint` before considering a change done.
- No test suite exists (`npm test` is a stub that exits 1). Verify behavior
  changes by hand: `python3 -m http.server` from repo root and open
  `docs/test.html` (loads `../src/...` directly, good for testing local
  edits) or `docs/index.html` (loads the published CDN build — useful as a
  before/after reference, not for testing local `src/` changes).
- Two supported init targets, with different internal wiring — test both
  when touching `setupMarkup()` / `destroy()`:
  - `<input>` element: gets wrapped in a new `<div>`; the input itself is
    reused as the display/submit field (`internals.objectRefs.hiddenField`
    is a misleading name here — it's the visible original input).
  - Any other element (e.g. `<div id="date">`): used directly as the
    wrapper; a real `<input type="hidden">` is appended into it.
- `formatSubmitDate()` / date option parsing assumes the browser's local
  timezone throughout (`new Date(y, m-1, d)`, `Date.parse`, etc.) — there is
  no UTC handling anywhere in this plugin.
- Cascading resets are intentional, not a bug: changing the year clears the
  month and day selection; changing the month clears the day selection. This
  matches the plugin's existing documented behavior and demo pages — don't
  "fix" this into preserving selection without checking with the maintainer
  first, since it's a user-facing behavior change for a published package.

## Gotchas found during audit (2026-08-17)

See `CHANGELOG.md` under `[Unreleased]` for the full list with root causes.
Highlights worth remembering if you're about to touch related code:

- `processDefaultDate()` must tolerate `this.config.defaultDate` being falsy
  — it's called unconditionally from `buildDropdowns()` regardless of
  whether the user actually passed a default date.
- `initialDayMonthYearValues` was removed from `pluginDefaults` — it never
  did anything (dead code path). If you see it referenced in old docs/demos,
  it's a harmless no-op if a caller still passes it, not something to
  resurrect.
