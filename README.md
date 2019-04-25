# jQuery Dropdown Datepicker

A simple and customization dropdown datepicker plugin made with jQuery.

## Check [Examples](https://tanvir0604.github.io/jquery-dropdown-datepicker/)

## Installation

### [jQuery](https://jquery.com/) is required to use this plugin

### Package manager 
#### Using [npm](https://www.npmjs.com)

```bash
npm i jquery-dropdown-datepicker
```

#### Using [yarn](https://yarnpkg.com)

```bash
yarn add jquery-dropdown-datepicker
```

#### Using [bower](https://bower.io)

```bash
bower install jquery-dropdown-datepicker
```

#### Using CDN

```code
<script src="https://cdn.jsdelivr.net/npm/jquery-dropdown-datepicker@1.3.0/dist/jquery-dropdown-datepicker.min.js"></script>
```
OR
```code
<script src="https://unpkg.com/jquery-dropdown-datepicker@1.3.0/dist/jquery-dropdown-datepicker.min.js"></script>
```
## Usage

```javascript
$("#date").dropdownDatepicker({
    defaultDate: '2019-04-07',
    displayFormat: 'dmy',
    monthFormat: 'short',
    minYear: 2000,
    maxYear: 2020
});
```

## Options
| Option                   | Type          | Defult          |Comment |
| -------------            | ------------- | ----------      |--------|
| defaultDate              | string        | null            |        |
| defaultDateFormat        | string        | 'yyyy-mm-dd'    |        |
| displayFormat            | string        | 'dmy'           |        |
| submitFormat             | string        | 'yyyy-mm-dd'    |        |
| minAge                   | int           | null            |        |
| maxAge                   | int           | null            |        |
| minYear                  | int           | null            |        |
| maxYear                  | int           | null            |        |
| minDate                  | string        | null            | yyyy-mm-dd |
| maxDate                  | string        | null            | yyyy-mm-dd |
| allowPast                | boolean       | true            |        |
| allowFuture              | boolean       | true            |        |
| submitFieldName          | string        | 'date'          |        |
| wrapperClass             | string        | 'date-dropdowns'|        |
| dropdownClass            | string        | null            |        |
| daySuffixes              | boolean       | true            |        |
| monthSuffixes            | boolean       | true            |        |
| monthFormat              | string        | 'long'          |        |
| required                 | boolean       | false           |        |
| dayLabel                 | string        | 'Day            |        |
| monthLabel               | string        | 'Month'         |        |
| yearLabel                | string        | 'Year'          |        |
| sortYear                 | string        | 'desc'          |        |
| monthLongValues          | array         | ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']|   |
| monthShortValues         | array         | ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] |    |
| initialDayMonthYearValues| array         | ['Day', 'Month', 'Year'] |      |
| daySuffixValues          | array         | ['st', 'nd', 'rd', 'th'] |      |


## Events
### onChange
Call on any change of day,month or year dropdown
```javascript
$("#date").dropdownDatepicker({
    onChange: function(day, month, year){
        console.log(day, month, year);
    }
});
```
### onDayChange
Call on any change of day dropdown
```javascript
$("#date").dropdownDatepicker({
    onDayChange: function(day, month, year){
        console.log(day, month, year);
    }
});
```

### onMonthChange
Call on any change of month dropdown
```javascript
$("#date").dropdownDatepicker({
    onMonthChange: function(day, month, year){
        console.log(day, month, year);
    }
});
```

### onYearChange
Call on any change of year dropdown
```javascript
$("#date").dropdownDatepicker({
    onYearChange: function(day, month, year){
        console.log(day, month, year);
    }
});
```

## Methods
### destroy
Call the destroy method to undo any changes made during the plugin's initialisation.
```javascript
$("#date").dropdownDatepicker('destroy');
```


## Contributing
Contributing Feel free to submit any fixes or propose any additional functionality via pull request or issue, making sure any changes take place in /src. Any code changes must pass the JSHint validation, and where possible also update the minified file.

Minification and Validation Both are automated via Grunt. Run npm install to install the required dependencies, then run grunt from the root of the project to handle the tasks.

## License
[ISC](https://choosealicense.com/licenses/isc/)

## Thanks Giving
This plugin is made based on [jquery-date-dropdowns](https://github.com/IckleChris/jquery-date-dropdowns) 

Thanks to [IckleChris](https://github.com/IckleChris)