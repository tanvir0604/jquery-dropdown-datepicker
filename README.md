# jQuery Dropdown Datepicker

[![npm version](https://img.shields.io/npm/v/jquery-dropdown-datepicker.svg)](https://www.npmjs.com/package/jquery-dropdown-datepicker)
[![npm downloads](https://img.shields.io/npm/dm/jquery-dropdown-datepicker.svg)](https://www.npmjs.com/package/jquery-dropdown-datepicker)
[![license](https://img.shields.io/npm/l/jquery-dropdown-datepicker.svg)](LICENSE)
[![open issues](https://img.shields.io/github/issues/tanvir0604/jquery-dropdown-datepicker.svg)](https://github.com/tanvir0604/jquery-dropdown-datepicker/issues)
[![open pull requests](https://img.shields.io/github/issues-pr/tanvir0604/jquery-dropdown-datepicker.svg)](https://github.com/tanvir0604/jquery-dropdown-datepicker/pulls)

A lightweight, dependency-free (beyond jQuery) plugin that turns an `<input>`
or a container element into three cascading day/month/year `<select>`
dropdowns, keeping a single formatted date value in sync as the user picks.

**[Live examples](https://tanvir0604.github.io/jquery-dropdown-datepicker/)**

## Features

- Works on a plain `<input>` **or** a container element (`<div>`, etc.)
- Configurable display order (`dmy` / `mdy` / `ymd`) and submit format
- Age and date-range constraints (`minAge`/`maxAge`, `minDate`/`maxDate`,
  `allowPast`/`allowFuture`) — handy for date-of-birth or range pickers
- i18n-friendly: every label, month name, and ordinal suffix is overridable
- `onChange` / `onDayChange` / `onMonthChange` / `onYearChange` callbacks
- No external dependencies other than jQuery

## Requirements

[jQuery](https://jquery.com/) `>= 1.4`

## Installation

```bash
npm install jquery-dropdown-datepicker
```

```bash
yarn add jquery-dropdown-datepicker
```

```bash
bower install jquery-dropdown-datepicker
```

Or via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/jquery-dropdown-datepicker@1.3.2/dist/jquery-dropdown-datepicker.min.js"></script>
```

```html
<script src="https://unpkg.com/jquery-dropdown-datepicker@1.3.2/dist/jquery-dropdown-datepicker.min.js"></script>
```

## Usage

```html
<input type="text" id="date" readonly>
```

```javascript
$("#date").dropdownDatepicker({
    defaultDate: '2019-04-07',
    displayFormat: 'dmy',
    monthFormat: 'short',
    minYear: 2000,
    maxYear: 2020
});
```

The plugin builds three `<select>` elements next to the target and keeps a
formatted date value in sync — as a hidden `<input>` if the target is a
container element, or on the target itself if it's an `<input>`.

## Options

| Option              | Type    | Default           | Notes |
| ------------------- | ------- | ----------------- | ----- |
| `defaultDate`        | string  | `null`             | Pre-selects a date. Falls back to the target `<input>`'s existing value when omitted. |
| `defaultDateFormat`  | string  | `'yyyy-mm-dd'`     | Format of `defaultDate`. One of `'yyyy-mm-dd'`, `'dd/mm/yyyy'`, `'mm/dd/yyyy'`, `'unix'`. |
| `displayFormat`      | string  | `'ymd'`            | Order the dropdowns are rendered in: `'dmy'`, `'mdy'`, or `'ymd'`. |
| `submitFormat`       | string  | `'yyyy-mm-dd'`     | Format written to the submit field. Tokens `dd`/`mm`/`yyyy`, or `'unix'` for a Unix timestamp. |
| `minAge`             | int     | `null`             | Restricts selectable dates to at least this many years old. |
| `maxAge`             | int     | `null`             | Restricts selectable dates to at most this many years old. |
| `minYear`            | int     | `null`             | Lower bound for the year dropdown. |
| `maxYear`            | int     | `null`             | Upper bound for the year dropdown. |
| `minDate`            | string  | `null`             | `yyyy-mm-dd`. Lower bound for the selectable date. |
| `maxDate`            | string  | `null`             | `yyyy-mm-dd`. Upper bound for the selectable date. |
| `allowPast`          | boolean | `true`             | Allow dates before today. |
| `allowFuture`        | boolean | `true`             | Allow dates after today. |
| `submitFieldName`    | string  | `'date'`           | `name` attribute of the submit field. |
| `wrapperClass`       | string  | `'date-dropdowns'` | Class applied to the wrapping element. |
| `dropdownClass`      | string  | `null`             | Extra class(es) applied to each `<select>`. |
| `daySuffixes`        | boolean | `true`             | Show ordinal suffixes (1st, 2nd, ...) in the day dropdown. |
| `monthSuffixes`      | boolean | `true`             | Show ordinal suffixes when `monthFormat` is `'numeric'`. |
| `monthFormat`        | string  | `'long'`           | `'long'`, `'short'`, or `'numeric'`. |
| `required`           | boolean | `false`            | Marks all three `<select>` elements as required. |
| `dayLabel`           | string  | `'Day'`            | Placeholder option text for the day dropdown. Falsy hides the placeholder. |
| `monthLabel`         | string  | `'Month'`          | Placeholder option text for the month dropdown. |
| `yearLabel`          | string  | `'Year'`           | Placeholder option text for the year dropdown. |
| `sortYear`           | string  | `'desc'`           | `'desc'` or `'asc'` order for the year dropdown. |
| `monthLongValues`    | array   | `['January', ..., 'December']` | Full month names, overridable for i18n. |
| `monthShortValues`   | array   | `['Jan', ..., 'Dec']`          | Abbreviated month names, overridable for i18n. |
| `daySuffixValues`    | array   | `['st', 'nd', 'rd', 'th']`     | Ordinal suffixes, overridable for i18n. |

## Events

### onChange
Fires on any change to the day, month, or year dropdown.
```javascript
$("#date").dropdownDatepicker({
    onChange: function(day, month, year){
        console.log(day, month, year);
    }
});
```

### onDayChange
Fires when the day dropdown changes.
```javascript
$("#date").dropdownDatepicker({
    onDayChange: function(day, month, year){
        console.log(day, month, year);
    }
});
```

### onMonthChange
Fires when the month dropdown changes.
```javascript
$("#date").dropdownDatepicker({
    onMonthChange: function(day, month, year){
        console.log(day, month, year);
    }
});
```

### onYearChange
Fires when the year dropdown changes.
```javascript
$("#date").dropdownDatepicker({
    onYearChange: function(day, month, year){
        console.log(day, month, year);
    }
});
```

## Methods

### destroy
Removes the generated dropdowns and restores the target element to its
pre-init state.
```javascript
$("#date").dropdownDatepicker('destroy');
```

## Development

```bash
npm install
npx grunt          # lint (jshint), then rebuild dist/
npx grunt jshint    # lint only
```

Source lives in `src/jquery-dropdown-datepicker.js`; `dist/` is generated —
don't edit it by hand. See [CLAUDE.md](CLAUDE.md) for more on the build
pipeline and known gotchas.

## Contributing

Fixes and new functionality are welcome via pull request or issue. Make sure
any changes take place in `src/`, pass `npx grunt jshint`, and that `dist/`
is rebuilt (`npx grunt`) and committed alongside the source change.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[ISC](LICENSE)

## Acknowledgements

Based on [jquery-date-dropdowns](https://github.com/IckleChris/jquery-date-dropdowns)
by [IckleChris](https://github.com/IckleChris).
