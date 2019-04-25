/*
 *  jQuery Dropdown Datepicker - v1.3.0
 *  A simple customizable jquery dropdown datepicker
 *
 *  Made by Md Shafkat Hussain Tanvir
 *  Under ISC License
 */
/*
 *  jQuery Dropdown Datepicker - v1.0.0
 *  A simple, customisable date select plugin
 *
 *  Made by Md Shafkat Hussain Tanvir
 *  Under ISC License
 */

;(function ($, window, document, undefined) {

    'use strict';

    // Create the defaults once
    var pluginName = 'dropdownDatepicker',
        pluginDefaults = {
            defaultDate: null,
            defaultDateFormat: 'yyyy-mm-dd',
            displayFormat: 'ymd',
            submitFormat: 'yyyy-mm-dd',
            minAge: null,
            maxAge: null,
            minYear: null,
            maxYear: null,
            minDate: null,
            maxDate: null,
            allowPast: true,
            allowFuture: true,
            submitFieldName: 'date',
            wrapperClass: 'date-dropdowns',
            dropdownClass: null,
            daySuffixes: true,
            monthSuffixes: true,
            monthFormat: 'long',
            required: false,
            dayLabel: 'Day',
            monthLabel: 'Month',
            yearLabel: 'Year',
            sortYear: 'desc',
            monthLongValues: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthShortValues: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            initialDayMonthYearValues: ['Day', 'Month', 'Year'],
            daySuffixValues: ['st', 'nd', 'rd', 'th'],
            onDayChange: null,
            onMonthChange: null,
            onYearChange: null
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;                                 // Element handle
        this.$element = $(element);                             // jQuery element handle
        this.config = $.extend({}, pluginDefaults, options);    // Plugin options
        this.internals = {                                      // Internal variables
            objectRefs: {}
        };
        this.init();

        return this;
    }




    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        /**
         * Initialise the plugin
         */
        init: function () {
            // this.checkForDuplicateElement();
            this.setInternalVariables();
            this.setupMarkup();
            this.buildDropdowns();
            this.attachDropdowns();
            this.bindChangeEvent();

            if (this.config.defaultDate) {
                if (isNaN(Date.parse(this.config.defaultDate)) === true) {
                    return;
                }

                // if past date is disallowed and default is a past date then no default date is selected
                if(!this.config.allowPast && new Date().getTime() > new Date(this.config.defaultDate).getTime()) {
                    return;
                }

                // if future date is disallowed and default is a future date then no default date is selected
                if(!this.config.allowFuture && new Date().getTime() < new Date(this.config.defaultDate).getTime()){
                    return;
                }

                this.populateDefaultDate();
            }
        },

        // set internal variables
        setInternalVariables: function(){
            var date = new Date();
            this.internals.currentDay = date.getDate();
            this.internals.currentMonth = date.getMonth() + 1;
            this.internals.currentYear = date.getFullYear();
        },

        // setup html markup
        setupMarkup: function () {
            var wrapper, hiddenField;

            if (this.element.tagName.toLowerCase() === 'input') {
                if (!this.config.defaultDate) {
                    this.config.defaultDate = this.element.value;
                }

                // Configure the input element and wrap
                hiddenField = this.$element.wrap('<div class="' + this.config.wrapperClass + '"></div>');
                // hiddenField = this.$element.attr('type', 'hidden')
                    // .wrap('<div class="' + this.config.wrapperClass + '"></div>');

                var customFieldNameProvided = (this.config.submitFieldName !== pluginDefaults.submitFieldName),
                    fieldHasName = this.element.hasAttribute('name');

                // Set the name attribute of the submit input
                if (!fieldHasName && !customFieldNameProvided) {
                    this.$element.attr('name', pluginDefaults.submitFieldName);
                } else if (customFieldNameProvided) {
                    this.$element.attr('name', this.config.submitFieldName);
                }

                wrapper = this.$element.parent();

            } else {

                // Build a hidden input and set this.$element as the wrapper
                hiddenField = $('<input/>', {
                    type: 'hidden',
                    name: this.config.submitFieldName
                });

                this.$element.append(hiddenField).addClass(this.config.wrapperClass);

                wrapper = this.$element;
            }

            // Store a reference to the wrapper and hidden field elements for later use
            this.internals.objectRefs.pluginWrapper = wrapper;
            this.internals.objectRefs.hiddenField = hiddenField;

            return true;
        },


        buildDropdowns: function () {
            var $dayDropdown, $dayOptions, $monthDropdown, $monthOptions, $yearDropdown, $yearOptions;

            Plugin.message = {
                day: this.config.initialDayMonthYearValues[0],
                month: this.config.initialDayMonthYearValues[1],
                year: this.config.initialDayMonthYearValues[2]
            };

            var parts = this.processDefaultDate();

            // Build the day dropdown element
            $dayDropdown = this.buildBaseDropdown('day');
            $dayOptions = this.buildDayOptions(parts[1], parts[2]);
            $dayDropdown = this.addOptionsToDropdown($dayDropdown, $dayOptions);   
            this.internals.objectRefs.dayDropdown = $dayDropdown;

            $monthDropdown = this.buildBaseDropdown('month');
            $monthOptions = this.buildMonthOptions(parts[2]);
            $monthDropdown = this.addOptionsToDropdown($monthDropdown, $monthOptions); 
            this.internals.objectRefs.monthDropdown = $monthDropdown;

            $yearDropdown = this.buildBaseDropdown('year');
            $yearOptions = this.buildYearOptions();
            $yearDropdown = this.addOptionsToDropdown($yearDropdown, $yearOptions); 
            this.internals.objectRefs.yearDropdown = $yearDropdown;

            return true;
        },


        attachDropdowns: function () {
            var $element = this.internals.objectRefs.pluginWrapper,
                $daySelect = this.internals.objectRefs.dayDropdown,
                $monthSelect = this.internals.objectRefs.monthDropdown,
                $yearSelect = this.internals.objectRefs.yearDropdown;

            switch (this.config.displayFormat) {
                case 'mdy':
                    $element.append($monthSelect, $daySelect, $yearSelect);
                    break;
                case 'ymd':
                    $element.append($yearSelect, $monthSelect, $daySelect);
                    break;
                case 'dmy':
                default:
                    $element.append($daySelect, $monthSelect, $yearSelect);
                    break;
            }

            return true;
        },

        bindChangeEvent: function () {
            var $daySelect = this.internals.objectRefs.dayDropdown,
                $monthSelect = this.internals.objectRefs.monthDropdown,
                $yearSelect = this.internals.objectRefs.yearDropdown,
                pluginHandle = this,
                objectRefs = this.internals.objectRefs,
                $that = this;

            objectRefs.pluginWrapper.on('change', 'select', function () {
                var day = $daySelect.val(),
                    month = $monthSelect.val(),
                    year = $yearSelect.val(),
                    invalidDay,
                    invalidMonth,
                    newDate,
                    $monthOptions,
                    $monthDropdown,
                    $dayOptions,
                    $dayDropdown;


                // Find out whether the change has made the date invalid (e.g. 31st Feb)
                // alert('ok');

                if($(this).hasClass('day')){
                    if(typeof $that.config.onDayChange === 'function'){
                        $that.config.onDayChange(day, month, year);
                    }
                }
                
                if($(this).hasClass('year')){
                    $that.clearOptions($monthSelect);
                    $monthOptions = $that.buildMonthOptions(year);
                    $monthDropdown = $that.addOptionsToDropdown($monthSelect, $monthOptions);
                    $that.internals.objectRefs.monthDropdown = $monthDropdown;

                    month = null;
                    $that.clearOptions($daySelect);
                    $dayOptions = $that.buildDayOptions(month, year);
                    $dayDropdown = $that.addOptionsToDropdown($daySelect, $dayOptions);
                    $that.internals.objectRefs.dayDropdown = $dayDropdown;

                    if(typeof $that.config.onYearChange === 'function'){
                        $that.config.onYearChange(day, month, year);
                    }
                }

                

                if($(this).hasClass('month')){
                    $that.clearOptions($daySelect);
                    $dayOptions = $that.buildDayOptions(month, year);
                    $dayDropdown = $that.addOptionsToDropdown($daySelect, $dayOptions);
                    $that.internals.objectRefs.dayDropdown = $dayDropdown;
                    if(typeof $that.config.onMonthChange === 'function'){
                        $that.config.onMonthChange(day, month, year);
                    }
                }


                if(typeof $that.config.onChange === 'function'){
                    $that.config.onChange(day, month, year);
                }
               

                // Empty the hidden field after each change
                objectRefs.hiddenField.val('');

                // Only format the submit date if a full date has been selected
                if (!invalidDay && !invalidMonth && (day * month * year !== 0)) {
                    newDate = pluginHandle.formatSubmitDate(day, month, year);

                    objectRefs.hiddenField.val(newDate);
                }

                objectRefs.hiddenField.change();
                
            });
        },


        buildBaseDropdown: function (type) {
            var classString = type;

            if (this.config.dropdownClass) {
                classString += ' ' + this.config.dropdownClass;
            }

            return $('<select></select>', {
                class: classString,
                name: this.config.submitFieldName + '_[' + type + ']',
                required: this.config.required
            });
        },


        buildDayOptions: function (month, year) {
            var day,start1=1,start2=10,end1=9,end2=31,
                options = [],
                option = document.createElement('option');
            month = parseInt(month);    
            year = parseInt(year);

            if(!this.config.allowPast && year === this.internals.currentYear && month === this.internals.currentMonth && start1 < this.internals.currentDay) {
                start1 = this.internals.currentDay;
            }

            if(this.config.maxAge != null){
                if(year === this.internals.currentYear - this.config.maxAge && month === this.internals.currentMonth){
                    start1 = this.internals.currentDay;
                }
            }

            if(this.config.minDate !== null && new Date(this.config.minDate).getFullYear() === year && new Date(this.config.minDate).getMonth() + 1 === month){
                start1 = start1 < new Date(this.config.minDate).getDate()?new Date(this.config.minDate).getDate():start1;
            }
            

            
            if(start2 < start1){
                start2 = start1;
            }


            var numDaysInMonth = (new Date(year, month, 0).getDate());
            if(end2 > numDaysInMonth) {
                end2 = numDaysInMonth;
            }

            if(!this.config.allowFuture && year === this.internals.currentYear && month === this.internals.currentMonth && end2 > this.internals.currentDay) {
                end2 = this.internals.currentDay;
            }
            


            if(this.config.minAge != null){
                if(year === this.internals.currentYear - this.config.minAge && month === this.internals.currentMonth){
                    end2 = this.internals.currentDay;
                }
            }

            if(this.config.maxDate !== null && new Date(this.config.maxDate).getFullYear() === year && new Date(this.config.maxDate).getMonth() + 1 === month){
                end2 = end2 > new Date(this.config.maxDate).getDate()?new Date(this.config.maxDate).getDate():end2;
            }
            

            if(end1 > start2){
                start2 = end1;
            }
            if(start2 > end2){
                end2 = start2;
            }


            if(this.config.dayLabel){
                option.setAttribute('value', '');
                option.appendChild(document.createTextNode(this.config.dayLabel));
                options.push(option);
            }

            // Days 1-9
            for (var i = start1; i <= end1; i++) {
                if (this.config.daySuffixes) {
                    day = i + this.getSuffix(i);
                } else {
                    day = '0' + i;
                }
                option = document.createElement('option');
                option.setAttribute('value', '0' + i);
                option.appendChild(document.createTextNode(day));
                options.push(option);
            }

            // Days 10-31
            for (var j = start2; j <= end2; j++) {
                day = j;

                if (this.config.daySuffixes) {
                    day = j + this.getSuffix(j);
                }
                option = document.createElement('option');
                option.setAttribute('value', j);
                option.appendChild(document.createTextNode(day));
                options.push(option);
            }

            return options;
        },



        buildMonthOptions: function (year) {
            var start = 1,end = 12,
                options = [],
                option = document.createElement('option');
            year = parseInt(year);    
            if(!this.config.allowPast && year === this.internals.currentYear) {
                start = this.internals.currentMonth;
            }
            if(!this.config.allowFuture && year === this.internals.currentYear) {
                end = this.internals.currentMonth;
            }

            if(this.config.minAge != null){
                if(year === this.internals.currentYear - this.config.minAge){
                    end = this.internals.currentMonth;
                }
            }

            if(this.config.maxAge != null){
                if(year === this.internals.currentYear - this.config.maxAge){
                    start = this.internals.currentMonth;
                }
            }

            if(this.config.minDate !== null && new Date(this.config.minDate).getFullYear() === year){
                start = start < new Date(this.config.minDate).getMonth()+1?new Date(this.config.minDate).getMonth()+1:start;
            }
            if(this.config.maxDate !== null && new Date(this.config.maxDate).getFullYear() === year){
                end = end > new Date(this.config.maxDate).getMonth()+1?new Date(this.config.maxDate).getMonth()+1:end;
            }

            if(this.config.monthLabel){
                option.setAttribute('value', '');
                option.appendChild(document.createTextNode(this.config.monthLabel));
                options.push(option);
            }    

            // Populate the month values
            for (var monthNo = start; monthNo <= end; monthNo++) {

                var month;

                switch (this.config.monthFormat) {
                    case 'short':
                        month = this.config.monthShortValues[monthNo - 1];
                        break;
                    case 'long':
                        month = this.config.monthLongValues[monthNo - 1];
                        break;
                    case 'numeric':
                        month = monthNo;

                        if (this.config.monthSuffixes) {
                            month += this.getSuffix(monthNo);
                        }
                        break;
                }

                if (monthNo < 10) {
                    monthNo = '0' + monthNo;
                }

                option = document.createElement('option');
                option.setAttribute('value', monthNo);
                option.appendChild(document.createTextNode(month));
                options.push(option);
            }

            return options;
        },

        buildYearOptions: function () {
            var minYear = this.config.minYear,
                maxYear = this.config.maxYear,
                options = [],
                option = document.createElement('option');

            if(this.config.yearLabel){
                option.setAttribute('value', '');
                option.appendChild(document.createTextNode(this.config.yearLabel));
                options.push(option);
            }

            if(this.config.minAge != null){
                maxYear = this.internals.currentYear - this.config.minAge;
            }
            if(this.config.maxAge != null){
                minYear = this.internals.currentYear - this.config.maxAge;
            }

            if (!minYear) {
                minYear = this.config.allowPast ? 1970 : this.internals.currentYear;
            }else{
                minYear = this.config.allowPast ? minYear : this.internals.currentYear;
            }
            if(this.config.minDate !== null){
                minYear = new Date(this.config.minDate).getFullYear();
            }

            if (!maxYear) {
                maxYear = this.internals.currentYear+20;
            }

            if(!this.config.allowFuture){
                maxYear = this.internals.currentYear;
            }

            if(this.config.maxDate !== null){
                maxYear = new Date(this.config.maxDate).getFullYear();
            }
            var i;
            if(this.config.sortYear === 'desc'){
                for (i = maxYear; i >= minYear; i--) {
                    option = document.createElement('option');
                    option.setAttribute('value', i);
                    option.appendChild(document.createTextNode(i));
                    options.push(option);
                }
            }else{
                for (i = minYear; i <= maxYear; i++) {
                    option = document.createElement('option');
                    option.setAttribute('value', i);
                    option.appendChild(document.createTextNode(i));
                    options.push(option);
                }
            }
            

            return options;
        },

        addOptionsToDropdown: function(dropdown, options){
            for (var index = 0; index < options.length; index++) {
                dropdown.append(options[index]);
                
            }
            return dropdown;
        },

        clearOptions: function(parent){
            parent.children('option').each(function(){
                $(this).remove();
            });
        },

        processDefaultDate: function(){
            var date = this.config.defaultDate,
                parts = [],
                day = '',
                month = '',
                year = '';

            switch (this.config.defaultDateFormat) {
                case 'yyyy-mm-dd':
                default:
                    parts = date.split('-');
                    day = parts[2];
                    month = parts[1];
                    year = parts[0];
                    break;

                case 'dd/mm/yyyy':
                    parts = date.split('/');
                    day = parts[0];
                    month = parts[1];
                    year = parts[2];
                    break;

                case 'mm/dd/yyyy':
                    parts = date.split('/');
                    day = parts[1];
                    month = parts[0];
                    year = parts[2];
                    break;

                case 'unix':
                    parts = new Date();
                    parts.setTime(date * 1000);
                    day = parts.getDate() + '';
                    month = (parts.getMonth() + 1) + '';
                    year = parts.getFullYear();

                    if (day.length < 2) {
                        day = '0' + day;
                    }
                    if (month.length < 2) {
                        month = '0' + month;
                    }
                    break;
            }

            return [day, month, year];
        },


        populateDefaultDate: function () {
            var date = this.config.defaultDate;
            var parts = this.processDefaultDate();           

            // Set the values on the dropdowns
            this.internals.objectRefs.dayDropdown.val(parts[0]);
            this.internals.objectRefs.monthDropdown.val(parts[1]);
            this.internals.objectRefs.yearDropdown.val(parts[2]);
            this.internals.objectRefs.hiddenField.val(date);

            

            return true;
        },

        getSuffix: function (number) {
            var suffix = '';
            var st = this.config.daySuffixValues[0];
            var nd = this.config.daySuffixValues[1];
            var rd = this.config.daySuffixValues[2];
            var th = this.config.daySuffixValues[3];

            switch (number % 10) {
                case 1:
                    suffix = (number % 100 === 11) ? th : st;
                    break;
                case 2:
                    suffix = (number % 100 === 12) ? th : nd;
                    break;
                case 3:
                    suffix = (number % 100 === 13) ? th : rd;
                    break;
                default:
                    suffix = th;
                    break;
            }

            return suffix;
        },


        formatSubmitDate: function (day, month, year) {
            var formattedDate,
                _date;

            switch (this.config.submitFormat) {
                case 'unix':
                    _date = new Date();
                    _date.setDate(day);
                    _date.setMonth(month - 1);
                    _date.setYear(year);
                    formattedDate = Math.round(_date.getTime() / 1000);
                    break;

                default:
                    formattedDate = this.config.submitFormat
                        .replace('dd', day)
                        .replace('mm', month)
                        .replace('yyyy', year);
                    break;
            }

            return formattedDate;
        },

        destroy: function () {
            var wrapperClass = this.config.wrapperClass;

            if (this.$element.hasClass(wrapperClass)) {
                // this.$element.empty();
                this.$element.removeData('plugin_' +pluginName);
            } else {
                var $parent = this.$element.parent(),
                    $select = $parent.find('select');
                
                this.$element.removeData('plugin_' +pluginName);
                this.$element.unwrap();
                $select.remove();
            }
        },
    });



    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        this.each(function () {
            if (typeof options === 'string') {
                var args = Array.prototype.slice.call(arguments, 1);
                var plugin = $.data(this, 'plugin_' + pluginName);

                if (typeof plugin === 'undefined') {
                    $.error('Please initialize the plugin before calling this method.');
                    return false;
                }
                plugin[options].apply(plugin, args);
            } else {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            }
        });
        // chain jQuery functions
        return this;
    };

})(jQuery, window, document);