# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed
- **Selecting the year wiped out an already-picked day/month.** Cascading
  resets on `year`/`month` change (`bindChangeEvent()`) unconditionally
  cleared the downstream dropdown(s) instead of only clearing them when the
  existing selection was no longer valid for the newly rebuilt options. For
  `displayFormat: 'dmy'` in particular, this meant a user filling the form
  left-to-right (day, then month, then year) had their day and month wiped
  the moment they picked a year. Added `optionsHaveValue()` and used it to
  re-select the previous day/month value
  when it still exists in the rebuilt option set, only falling back to a
  reset when the prior selection is genuinely no longer valid (e.g. Feb 29
  selected, then the year changes to a non-leap year).

## [1.3.1] - 2026-08-17

### Fixed
- **Crash on non-`<input>` targets without `defaultDate`.** Initializing the
  plugin on a container element (e.g. a `<div>`) without an explicit
  `defaultDate` option threw `TypeError: Cannot read properties of null
  (reading 'split')` inside `processDefaultDate()`. The input-element code
  path back-filled `defaultDate` from the field's value, but the container
  path never did, so `defaultDate` stayed `null` and was unconditionally
  `.split()`'d. `processDefaultDate()` now returns empty day/month/year parts
  when no default date is set.
- **`destroy()` didn't clean up on container targets.** When the plugin was
  initialized on a non-`<input>` element, calling `.dropdownDatepicker('destroy')`
  only removed the internal jQuery data reference — the generated `<select>`
  elements and hidden field were left in the DOM (the cleanup call was
  commented out). `destroy()` now removes the generated selects and hidden
  field and un-does the wrapper class, matching the behavior already used for
  `<input>` targets.
- **Wrong day value in `submitFormat: 'unix'` output.** `formatSubmitDate()`
  built the submission date by mutating "now" with `setDate()` then
  `setMonth()`, in that order. If today's day-of-month wasn't valid for
  today's month's day count edge cases (e.g. building a date from `new Date()`
  on Feb 28 and calling `setDate(31)` before the month was changed), the day
  value would silently roll over before the target month was applied,
  producing the wrong date. The date is now constructed directly with
  `new Date(year, month - 1, day)`.
- **Deprecated `Date#setYear()` replaced.** Same `unix` code path also used
  the legacy, deprecated `setYear()` (which special-cases two-digit years);
  removed along with the fix above.
- **Broken/no-op `wrapperClass` HTML injection risk.** The wrapping `<div>`
  for `<input>` targets was built by concatenating `wrapperClass` directly
  into an HTML string (`'<div class="' + wrapperClass + '"></div>'`). A
  `wrapperClass` value containing a quote could break out of the attribute.
  Now built via `$('<div></div>').addClass(wrapperClass)`.
- **Build pipeline produced a stale, unminified `dist/`.** In `Gruntfile.js`,
  the `concat` task wrote to `dist/jquery-dropdown-datepicker.min.js` while
  `uglify` read from and wrote back to `dist/jquery-dropdown-datepicker.js`
  — the two tasks never actually touched each other's output. In practice
  this meant:
  - `dist/jquery-dropdown-datepicker.min.js` (the file linked from the CDN
    examples in the README) shipped **unminified** source.
  - `dist/jquery-dropdown-datepicker.js` was minified from whatever was
    already sitting in that file, and was never refreshed from `src/` —
    it had drifted years out of date and was missing most current options
    (`allowFuture`, `minAge`, `maxAge`, `minDate`, `maxDate`, `sortYear`,
    `onDayChange`, `onMonthChange`, `onYearChange`, `onChange`).

  Fixed the task wiring and rebuilt `dist/` from current `src/`.

### Removed
- **`initialDayMonthYearValues` config option.** This option was documented
  in the README but never actually had any effect — it was only ever
  assigned to an unused `Plugin.message` static property that nothing read.
  Placeholder labels are controlled by `dayLabel` / `monthLabel` / `yearLabel`
  instead. Passing this option is now simply ignored (as it always
  effectively was).
- Dead code: the unused `Plugin.message` static assignment, an unreachable
  "invalid date" check (`invalidDay`/`invalidMonth` were declared but never
  assigned, so the guard was always a no-op), and assorted stale commented-out
  code.

### Changed
- Added `onChange` to the documented plugin defaults (it was already
  supported by `bindChangeEvent()` but missing from `pluginDefaults`).
- Corrected the version number in the `src/` file header banner (was stuck
  at `v1.0.0` while the package had moved on to `1.3.0`).
- Synced `bower.json`'s `main` to point at `dist/jquery-dropdown-datepicker.min.js`.
  It previously pointed at `src/jquery-dropdown-datepicker.js` while that same
  path was listed in `ignore`, so a `bower install` would never actually have
  the file `main` referenced.

## [1.3.0]
- Added `sortYear` option to control ascending/descending order of the year
  dropdown.
- Dependency maintenance (Grunt toolchain and transitive dev dependencies).

## [1.2.0] - 2019-04-06
- Added support for building date-range pickers (paired min/max date
  constraints between two instances).

## [1.1.0] - 2019-04-05
- Added `allowFuture`, `minAge`, `maxAge` options.
- Added `onChange`, `onDayChange`, `onMonthChange`, `onYearChange` callbacks.

## [1.0.0] - 2019-04-04
- Initial release.

[Unreleased]: https://github.com/tanvir0604/jquery-dropdown-datepicker/compare/1.3.1...HEAD
[1.3.1]: https://github.com/tanvir0604/jquery-dropdown-datepicker/compare/1.2.0...1.3.1
[1.3.0]: https://github.com/tanvir0604/jquery-dropdown-datepicker/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/tanvir0604/jquery-dropdown-datepicker/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/tanvir0604/jquery-dropdown-datepicker/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/tanvir0604/jquery-dropdown-datepicker/releases/tag/1.0.0
