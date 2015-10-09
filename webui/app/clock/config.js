angular.module('app.clock').service("app.clock.configService", function() {

    this.defaults = {
        boxSize: '1',
        formats: {
            clockFacePlace: '0',
            multipleClocks: '',
            clockFaceHours: '0',
            clockMeridiem: 'X',
            clockSeparator: ':',
            dateSeparator: '/',
            dateType: '2',
            clockSeconds: '',
            clockZeroToHour: '',
            dateCentury: 'X',
            dateText: 'W',
            multipleClockOrder: '123',
            showActiveDST: '',
            datetextOrder: 'T'
        },
        clock_0: {
            index: '0',
            location: 'TORONTO, CA',
            isDST: 'X',
            DSTPeriod: 'B:E',
            DSTbgnOFS: 'UTC-4',
            DSTbgnMIN: '00',
            DSTbgnRNK: '2',
            DSTbgnDAY: '0',
            DSTbgnMTH: '2',
            DSTbgnTCH: '02',
            DSTbgnTCM: '00',
            DSTbgnMRD: 'AM',
            DSTendOFS: 'UTC-5',
            DSTendMIN: '00',
            DSTendRNK: '1',
            DSTendDAY: '0',
            DSTendMTH: '10',
            DSTendTCH: '02',
            DSTendTCM: '00',
            DSTendMRD: 'AM',
            color: 'basic-blue-font'
        },
        clock_1: {
            index: '1',
            location: 'WALLDORF, DE',
            isDST: 'X',
            DSTPeriod: 'B:E',
            DSTbgnOFS: 'UTC+2',
            DSTbgnMIN: '00',
            DSTbgnRNK: '5',
            DSTbgnDAY: '0',
            DSTbgnMTH: '2',
            DSTbgnTCH: '02',
            DSTbgnTCM: '00',
            DSTbgnMRD: 'AM',
            DSTendOFS: 'UTC+1',
            DSTendMIN: '00',
            DSTendRNK: '5',
            DSTendDAY: '0',
            DSTendMTH: '9',
            DSTendTCH: '03',
            DSTendTCM: '00',
            DSTendMRD: 'AM',
            color: 'basic-blue-font'
        },
        clock_2: {
            index: '2',
            location: 'PAPEETE, TAHITI',
            isDST: '',
            DSTPeriod: 'B:E',
            DSTbgnOFS: 'UTC-10',
            DSTbgnMIN: '00',
            DSTbgnRNK: '1',
            DSTbgnDAY: '0',
            DSTbgnMTH: '0',
            DSTbgnTCH: '12',
            DSTbgnTCM: '00',
            DSTbgnMRD: 'AM',
            DSTendOFS: 'UTC+0',
            DSTendMIN: '00',
            DSTendRNK: '1',
            DSTendDAY: '0',
            DSTendMTH: '0',
            DSTendTCH: '12',
            DSTendTCM: '00',
            DSTendMRD: 'AM',
            color: 'green-font'
        },
        clock_3: {
            index: '3',
            location: 'ADELAIDE, S. AU',
            isDST: 'X',
            DSTPeriod: 'E:B',
            DSTbgnOFS: 'UTC+10',
            DSTbgnMIN: '30',
            DSTbgnRNK: '1',
            DSTbgnDAY: '0',
            DSTbgnMTH: '9',
            DSTbgnTCH: '02',
            DSTbgnTCM: '00',
            DSTbgnMRD: 'AM',
            DSTendOFS: 'UTC+9',
            DSTendMIN: '30',
            DSTendRNK: '1',
            DSTendDAY: '0',
            DSTendMTH: '3',
            DSTendTCH: '03',
            DSTendTCM: '00',
            DSTendMRD: 'AM',
            color: 'red-font'
        }
    };

    this.values = {
        boxSize: '',
        formats: {
            clockFacePlace: '',
            multipleClocks: '',
            clockFaceHours: '',
            clockMeridiem: '',
            clockSeparator: '',
            dateSeparator: '',
            dateType: '',
            clockSeconds: '',
            clockZeroToHour: '',
            dateCentury: '',
            dateText: '',
            multipleClockOrder: '',
            showActiveDST: '',
            datetextOrder: ''
        },
        clock_0: {
            index: '0',
            location: '',
            isDST: '',
            DSTPeriod: '',
            DSTbgnOFS: '',
            DSTbgnMIN: '',
            DSTbgnRNK: '',
            DSTbgnDAY: '',
            DSTbgnMTH: '',
            DSTbgnTCH: '',
            DSTbgnTCM: '',
            DSTbgnMRD: '',
            DSTendOFS: '',
            DSTendMIN: '',
            DSTendRNK: '',
            DSTendDAY: '',
            DSTendMTH: '',
            DSTendTCH: '',
            DSTendTCM: '',
            DSTendMRD: '',
            color: ''
        },
        clock_1: {
            index: '1',
            location: '',
            isDST: '',
            DSTPeriod: '',
            DSTbgnOFS: '',
            DSTbgnMIN: '',
            DSTbgnRNK: '',
            DSTbgnDAY: '',
            DSTbgnMTH: '',
            DSTbgnTCH: '',
            DSTbgnTCM: '',
            DSTbgnMRD: '',
            DSTendOFS: '',
            DSTendMIN: '',
            DSTendRNK: '',
            DSTendDAY: '',
            DSTendMTH: '',
            DSTendTCH: '',
            DSTendTCM: '',
            DSTendMRD: '',
            color: ''
        },
        clock_2: {
            index: '2',
            location: '',
            isDST: '',
            DSTPeriod: '',
            DSTbgnOFS: '',
            DSTbgnMIN: '',
            DSTbgnRNK: '',
            DSTbgnDAY: '',
            DSTbgnMTH: '',
            DSTbgnTCH: '',
            DSTbgnTCM: '',
            DSTbgnMRD: '',
            DSTendOFS: '',
            DSTendMIN: '',
            DSTendRNK: '',
            DSTendDAY: '',
            DSTendMTH: '',
            DSTendTCH: '',
            DSTendTCM: '',
            DSTendMRD: '',
            color: ''
        },
        clock_3: {
            index: '3',
            location: '',
            isDST: '',
            DSTPeriod: '',
            DSTbgnOFS: '',
            DSTbgnMIN: '',
            DSTbgnRNK: '',
            DSTbgnDAY: '',
            DSTbgnMTH: '',
            DSTbgnTCH: '',
            DSTbgnTCM: '',
            DSTbgnMRD: '',
            DSTendOFS: '',
            DSTendMIN: '',
            DSTendRNK: '',
            DSTendDAY: '',
            DSTendMTH: '',
            DSTendTCH: '',
            DSTendTCM: '',
            DSTendMRD: '',
            color: ''
        }
    };

    // FUNCTION: "initialize" - initializes configuration (if not exists, sets default configuration)
    this.initialize = function(configLoadedFromBackend) {

        if (configLoadedFromBackend !== undefined &&
            configLoadedFromBackend !== {} &&
            configLoadedFromBackend.values) {
            // Standard case: Get config from backend
            this.values = configLoadedFromBackend.values;
        } else {

            // Use default config on first load
            configLoadedFromBackend.values = this.values;

            this.getDefaultClock(configLoadedFromBackend.values.clock_0);
            this.getDefaultClock(configLoadedFromBackend.values.clock_1);
            this.getDefaultClock(configLoadedFromBackend.values.clock_2);
            this.getDefaultClock(configLoadedFromBackend.values.clock_3);

            configLoadedFromBackend.values.boxSize = this.getDefaultValue('boxSize');
            configLoadedFromBackend.values.formats.clockFacePlace = this.getDefaultValue('clockFacePlace');
            configLoadedFromBackend.values.formats.multipleClocks = this.getDefaultValue('multipleClocks');
            configLoadedFromBackend.values.formats.clockFaceHours = this.getDefaultValue('clockFaceHours');
            configLoadedFromBackend.values.formats.clockMeridiem = this.getDefaultValue('clockMeridiem');
            configLoadedFromBackend.values.formats.clockSeparator = this.getDefaultValue('clockSeparator');
            configLoadedFromBackend.values.formats.dateSeparator = this.getDefaultValue('dateSeparator');
            configLoadedFromBackend.values.formats.dateType = this.getDefaultValue('dateType');
            configLoadedFromBackend.values.formats.clockSeconds = this.getDefaultValue('clockSeconds');
            configLoadedFromBackend.values.formats.clockZeroToHour = this.getDefaultValue('clockZeroToHour');
            configLoadedFromBackend.values.formats.dateCentury = this.getDefaultValue('dateCentury');
            configLoadedFromBackend.values.formats.dateText = this.getDefaultValue('dateText');
            configLoadedFromBackend.values.formats.multipleClockOrder = this.getDefaultValue('multipleClockOrder');
            configLoadedFromBackend.values.formats.showActiveDST = this.getDefaultValue('showActiveDST');
            configLoadedFromBackend.values.formats.datetextOrder = this.getDefaultValue('datetextOrder');

        }

    };

    // FUNCTION: "getDefaultValue" - gets settings from "default" configuration for specified attribute
    this.getDefaultValue = function(theOption) {

        switch (theOption) {
            case 'boxSize': return this.defaults.boxSize; break;
            case 'clockFacePlace': return this.defaults.formats.clockFacePlace; break;
            case 'multipleClocks': return this.defaults.formats.multipleClocks; break;
            case 'clockFaceHours': return this.defaults.formats.clockFaceHours; break;
            case 'clockMeridiem': return this.defaults.formats.clockMeridiem; break;
            case 'clockSeparator': return this.defaults.formats.clockSeparator; break;
            case 'dateSeparator': return this.defaults.formats.dateSeparator; break;
            case 'dateType': return this.defaults.formats.dateType; break;
            case 'clockSeconds': return this.defaults.formats.clockSeconds; break;
            case 'clockZeroToHour': return this.defaults.formats.clockZeroToHour; break;
            case 'dateCentury': return this.defaults.formats.dateCentury; break;
            case 'dateText': return this.defaults.formats.dateText; break;
            case 'multipleClockOrder': return this.defaults.formats.multipleClockOrder; break;
            case 'showActiveDST': return this.defaults.formats.showActiveDST; break;
            case 'datetextOrder': return this.defaults.formats.datetextOrder; break;
        };

    };

    // FUNCTION: "getDefaultClock" - gets settings from "default" configuration for specified clock "index"
    this.getDefaultClock = function(theClock) {

        var idx = 0;

        var clkdfl;

        idx = parseInt(theClock.index);

        switch (idx) {
            case 0: clkdfl = this.defaults.clock_0; break;
            case 1: clkdfl = this.defaults.clock_1; break;
            case 2: clkdfl = this.defaults.clock_2; break;
            case 3: clkdfl = this.defaults.clock_3; break;
        };

        theClock.location = clkdfl.location;
        theClock.isDST = clkdfl.isDST;
        theClock.DSTPeriod = clkdfl.DSTPeriod;
        theClock.DSTbgnOFS = clkdfl.DSTbgnOFS;
        theClock.DSTbgnMIN = clkdfl.DSTbgnMIN;
        theClock.DSTbgnRNK = clkdfl.DSTbgnRNK;
        theClock.DSTbgnDAY = clkdfl.DSTbgnDAY;
        theClock.DSTbgnMTH = clkdfl.DSTbgnMTH;
        theClock.DSTbgnTCH = clkdfl.DSTbgnTCH;
        theClock.DSTbgnTCM = clkdfl.DSTbgnTCM;
        theClock.DSTbgnMRD = clkdfl.DSTbgnMRD;
        theClock.DSTendOFS = clkdfl.DSTendOFS;
        theClock.DSTendMIN = clkdfl.DSTendMIN;
        theClock.DSTendRNK = clkdfl.DSTendRNK;
        theClock.DSTendDAY = clkdfl.DSTendDAY;
        theClock.DSTendMTH = clkdfl.DSTendMTH;
        theClock.DSTendTCH = clkdfl.DSTendTCH;
        theClock.DSTendTCM = clkdfl.DSTendTCM;
        theClock.DSTendMRD = clkdfl.DSTendMRD;
        theClock.color = clkdfl.color;

    };

    // FUNCTION: "getClock" - gets settings from "current" configuration for specified clock "index"
    this.getClock = function(theIndex) {

        switch (theIndex) {
            case 0: return this.values.clock_0; break;
            case 1: return this.values.clock_1; break;
            case 2: return this.values.clock_2; break;
            case 3: return this.values.clock_3; break;
        }

    }

    // FUNCTION: "setClock" - sets settings in "current" configuration for specified clock "index"
    this.setClock = function(theClock) {

        var idx = 0;

        idx = parseInt(theClock.index);

        switch (idx) {
            case 0: this.values.clock_0 = theClock; break;
            case 1: this.values.clock_1 = theClock; break;
            case 2: this.values.clock_2 = theClock; break;
            case 3: this.values.clock_3 = theClock; break;
        }
    }

    // FUNCTION: "getValue" - gets settings from "current" configuration for specified attribute
    this.getValue = function(theOption) {

        switch (theOption) {
            case 'boxSize': return this.values.boxSize; break;
            case 'clockFacePlace': return this.values.formats.clockFacePlace; break;
            case 'multipleClocks': return this.values.formats.multipleClocks; break;
            case 'clockFaceHours': return this.values.formats.clockFaceHours; break;
            case 'clockMeridiem': return this.values.formats.clockMeridiem; break;
            case 'clockSeparator': return this.values.formats.clockSeparator; break;
            case 'dateSeparator': return this.values.formats.dateSeparator; break;
            case 'dateType': return this.values.formats.dateType; break;
            case 'clockSeconds': return this.values.formats.clockSeconds; break;
            case 'clockZeroToHour': return this.values.formats.clockZeroToHour; break;
            case 'dateCentury': return this.values.formats.dateCentury; break;
            case 'dateText': return this.values.formats.dateText; break;
            case 'multipleClockOrder': return this.values.formats.multipleClockOrder; break;
            case 'showActiveDST': return this.values.formats.showActiveDST; break;
            case 'datetextOrder': return this.values.formats.datetextOrder; break;
        }

    }

    // FUNCTION: "setValue" - sets settings in "current" configuration for specified attribute
    this.setValue = function(theOption, theValue) {

        switch (theOption) {
            case 'boxSize': this.values.boxSize = theValue; break;
            case 'clockFacePlace': this.values.formats.clockFacePlace = theValue; break;
            case 'multipleClocks': this.values.formats.multipleClocks = theValue; break;
            case 'clockFaceHours': this.values.formats.clockFaceHours = theValue; break;
            case 'clockMeridiem': this.values.formats.clockMeridiem = theValue; break;
            case 'clockSeparator': this.values.formats.clockSeparator = theValue; break;
            case 'dateSeparator': this.values.formats.dateSeparator = theValue; break;
            case 'dateType': this.values.formats.dateType = theValue; break;
            case 'clockSeconds': this.values.formats.clockSeconds = theValue; break;
            case 'clockZeroToHour': this.values.formats.clockZeroToHour = theValue; break;
            case 'dateCentury': this.values.formats.dateCentury = theValue; break;
            case 'dateText': this.values.formats.dateText = theValue; break;
            case 'multipleClockOrder': this.values.formats.multipleClockOrder = theValue; break;
            case 'showActiveDST': this.values.formats.showActiveDST = theValue; break;
            case 'datetextOrder': this.values.formats.datetextOrder = theValue; break;
        }

    }

});
