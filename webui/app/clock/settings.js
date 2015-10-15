/*global document*/
/*eslint eqeqeq: 0*/

angular.module('app.clock').appClockSettings =
	['$scope', 'app.clock.configService', function($scope, configService) {

	    $scope.UTC_OffSet_OFS = [
          { value: 'UTC+14' },
          { value: 'UTC+13' },
          { value: 'UTC+12' },
          { value: 'UTC+11' },
          { value: 'UTC+10' },
          { value: 'UTC+9' },
          { value: 'UTC+8' },
          { value: 'UTC+7' },
          { value: 'UTC+6' },
          { value: 'UTC+5' },
          { value: 'UTC+4' },
          { value: 'UTC+3' },
          { value: 'UTC+2' },
          { value: 'UTC+1' },
          { value: 'UTC+0' },
          { value: 'UTC-1' },
          { value: 'UTC-2' },
          { value: 'UTC-3' },
          { value: 'UTC-4' },
          { value: 'UTC-5' },
          { value: 'UTC-6' },
          { value: 'UTC-7' },
          { value: 'UTC-8' },
          { value: 'UTC-9' },
          { value: 'UTC-10' },
          { value: 'UTC-11' },
          { value: 'UTC-12' },
          { value: 'UTC-13' },
          { value: 'UTC-14' }
        ];

	    $scope.UTC_OffSet_HRS = [
          { value: '01' },
          { value: '02' },
          { value: '03' },
          { value: '04' },
          { value: '05' },
          { value: '06' },
          { value: '07' },
          { value: '08' },
          { value: '09' },
          { value: '10' },
          { value: '11' },
          { value: '12' }
        ];

	    $scope.UTC_OffSet_MNS = [
          { value: '00' },
          { value: '01' },
          { value: '02' },
          { value: '03' },
          { value: '04' },
          { value: '05' },
          { value: '06' },
          { value: '07' },
          { value: '08' },
          { value: '09' },
          { value: '10' },
          { value: '11' },
          { value: '12' },
          { value: '13' },
          { value: '14' },
          { value: '15' },
          { value: '16' },
          { value: '17' },
          { value: '18' },
          { value: '19' },
          { value: '20' },
          { value: '21' },
          { value: '22' },
          { value: '23' },
          { value: '24' },
          { value: '25' },
          { value: '26' },
          { value: '27' },
          { value: '28' },
          { value: '29' },
          { value: '30' },
          { value: '31' },
          { value: '32' },
          { value: '33' },
          { value: '34' },
          { value: '35' },
          { value: '36' },
          { value: '37' },
          { value: '38' },
          { value: '39' },
          { value: '40' },
          { value: '41' },
          { value: '42' },
          { value: '43' },
          { value: '44' },
          { value: '45' },
          { value: '46' },
          { value: '47' },
          { value: '48' },
          { value: '49' },
          { value: '50' },
          { value: '51' },
          { value: '52' },
          { value: '53' },
          { value: '54' },
          { value: '55' },
          { value: '56' },
          { value: '57' },
          { value: '58' },
          { value: '59' }
        ];

	    $scope.UTC_OffSet_PRD = [
          { value: 'Start' },
          { value: 'Finish' }
        ];

	    $scope.UTC_OffSet_RNK = [
          { value: '1st' },
          { value: '2nd' },
          { value: '3rd' },
          { value: '4th' },
          { value: 'Last' }
        ];

	    $scope.UTC_OffSet_DAY = [
          { value: 'Sun' },
          { value: 'Mon' },
          { value: 'Tue' },
          { value: 'Wed' },
          { value: 'Thr' },
          { value: 'Fri' },
          { value: 'Sat' }
        ];

	    $scope.UTC_OffSet_MTH = [
          { value: 'Jan' },
          { value: 'Feb' },
          { value: 'Mar' },
          { value: 'Apr' },
          { value: 'May' },
          { value: 'Jun' },
          { value: 'Jul' },
          { value: 'Aug' },
          { value: 'Sep' },
          { value: 'Oct' },
          { value: 'Nov' },
          { value: 'Dec' }
        ];

	    $scope.UTC_OffSet_MRD = [
          { value: 'AM' },
          { value: 'PM' }
        ];

	    $scope.UTC_Option_Fields = [
          { value: 'Prd' },
          { value: 'Rnk' },
          { value: 'Day' },
          { value: 'Mth' },
          { value: 'Tch' },
          { value: 'Tcm' },
          { value: 'Mrd' },
          { value: 'Ofs' },
          { value: 'Min' }
        ];

	    $scope.CLOCK_FACE_PLACE = [
	      { value: 'Clock-1' },
	      { value: 'Clock-2' },
	      { value: 'Clock-3' },
	      { value: 'Clock-4' }
        ];

	    $scope.CLOCK_COLOR = [
	      { value: 'Blue', code: 'basic-blue-font' },
	      { value: 'Grey', code: 'grey-font' },
	      { value: 'Red', code: 'red-font' },
	      { value: 'Yellow', code: 'yellow-font' },
	      { value: 'Orange', code: 'orange-font' },
	      { value: 'Green', code: 'green-font' },
	      { value: 'Purple', code: 'purple-font' }
        ];

	    $scope.CLOCK_FACE_HOURS = [
	      { value: '12 Hours' },
	      { value: '24 Hours' }
        ];

	    $scope.DATE_TYPES = [
	      { value: 'DDD dd yyyy' },
	      { value: 'MMM dd yyyy' },
	      { value: 'MM/DD/YYYY' },
	      { value: 'DD/MM/YYYY' },
	      { value: 'YYYY/MM/DD' },
	      { value: 'YYYY/DD/MM' }
        ];

	    $scope.DATE_TEXT = [
	      { value: 'None', code: '' },
	      { value: 'Weekday', code: 'W' },
	      { value: 'Month Name', code: 'M' }
        ];

	    $scope.CLOCK_FACE_MULTIPLE = [
	      { value: 'None' },
	      { value: 'Clock-1' },
	      { value: 'Clock-2' },
	      { value: 'Clock-3' },
	      { value: 'Clock-4' }
        ];

	    $scope.CLOCK_FACE_DISPLAY = [
	      { value: 'Single Clock', code: '' },
	      { value: 'Multiple Clocks', code: 'X' }
        ];

	    $scope.DATE_TEXT_ORDER = [
	      { value: 'Text / Date', code: 'T' },
	      { value: 'Date / Text', code: 'D' }
	    ];

	    // work with localized copies of "clock" objects so that if user does not click the "save" button, current
	    // configurations will not be saved...
	    $scope.clock_0 = {
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
	    };

	    $scope.clock_1 = {
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
	    };

	    $scope.clock_2 = {
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
	    };

	    $scope.clock_3 = {
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
	    };

	    $scope.flags = {
	        clockMeridiem: ''
	    };

	    $scope.formats = {
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
	    };

	    // FUNCTION: "toggleClockConfig" - toggles configuration in preparation for loading/saving time zone period configurations within the correct elements in the HTML page/structure
	    function toggleClockConfig(theClock) {

	        var tmpOfs;
	        var tmpMin;
	        var tmpRnk;
	        var tmpDay;
	        var tmpMth;
	        var tmpTch;
	        var tmpTcm;
	        var tmpMrd;

	        tmpOfs = theClock.DSTbgnOFS;
	        tmpMin = theClock.DSTbgnMIN;
	        tmpRnk = theClock.DSTbgnRNK;
	        tmpDay = theClock.DSTbgnDAY;
	        tmpMth = theClock.DSTbgnMTH;
	        tmpTch = theClock.DSTbgnTCH;
	        tmpTcm = theClock.DSTbgnTCM;
	        tmpMrd = theClock.DSTbgnMRD;

	        theClock.DSTbgnOFS = theClock.DSTendOFS;
	        theClock.DSTbgnMIN = theClock.DSTendMIN;
	        theClock.DSTbgnRNK = theClock.DSTendRNK;
	        theClock.DSTbgnDAY = theClock.DSTendDAY;
	        theClock.DSTbgnMTH = theClock.DSTendMTH;
	        theClock.DSTbgnTCH = theClock.DSTendTCH;
	        theClock.DSTbgnTCM = theClock.DSTendTCM;
	        theClock.DSTbgnMRD = theClock.DSTendMRD;

	        theClock.DSTendOFS = tmpOfs;
	        theClock.DSTendMIN = tmpMin;
	        theClock.DSTendRNK = tmpRnk;
	        theClock.DSTendDAY = tmpDay;
	        theClock.DSTendMTH = tmpMth;
	        theClock.DSTendTCH = tmpTch;
	        theClock.DSTendTCM = tmpTcm;
	        theClock.DSTendMRD = tmpMrd;

	    }

	    // FUNCTION: "initialUTCPrdItem" - initialize the selection of time zone "period" configurations in "begin/finish" list
	    function initialUTCPrdItem(theClock) {

	        if (theClock.DSTPeriod == 'B:E') {
	            switch (theClock.index) {
	                case '0':
	                    $scope.UTCBgnPrdLst_0 = $scope.UTC_OffSet_PRD[0];
	                    $scope.UTCEndPrdLst_0 = $scope.UTC_OffSet_PRD[1];
	                    break;
	                case '1':
	                    $scope.UTCBgnPrdLst_1 = $scope.UTC_OffSet_PRD[0];
	                    $scope.UTCEndPrdLst_1 = $scope.UTC_OffSet_PRD[1];
	                    break;
	                case '2':
	                    $scope.UTCBgnPrdLst_2 = $scope.UTC_OffSet_PRD[0];
	                    $scope.UTCEndPrdLst_2 = $scope.UTC_OffSet_PRD[1];
	                    break;
	                case '3':
	                    $scope.UTCBgnPrdLst_3 = $scope.UTC_OffSet_PRD[0];
	                    $scope.UTCEndPrdLst_3 = $scope.UTC_OffSet_PRD[1];
	                    break;
	            }
	        } else {
	            switch (theClock.index) {
	                case '0':
	                    $scope.UTCBgnPrdLst_0 = $scope.UTC_OffSet_PRD[1];
	                    $scope.UTCEndPrdLst_0 = $scope.UTC_OffSet_PRD[0];
	                    break;
	                case '1':
	                    $scope.UTCBgnPrdLst_1 = $scope.UTC_OffSet_PRD[1];
	                    $scope.UTCEndPrdLst_1 = $scope.UTC_OffSet_PRD[0];
	                    break;
	                case '2':
	                    $scope.UTCBgnPrdLst_2 = $scope.UTC_OffSet_PRD[1];
	                    $scope.UTCEndPrdLst_2 = $scope.UTC_OffSet_PRD[0];
	                    break;
	                case '3':
	                    $scope.UTCBgnPrdLst_3 = $scope.UTC_OffSet_PRD[1];
	                    $scope.UTCEndPrdLst_3 = $scope.UTC_OffSet_PRD[0];
	                    break;
	            }

	            // toggle "begin" configurations with "end" configurations because DST periods have
	            // been entered "backwards" from how they need to be stored in the structure

	            toggleClockConfig(theClock);
	        }

	    }

	    // FUNCTION: "initialUTCOfsItem" - initialize the selection of time zone "UTC hour offset" configuration in "begin/finish" list
	    function initialUTCOfsItem(theOption, theValue, theIndex) {

	        var siz = $scope.UTC_OffSet_OFS.length;

	        var optstr;
	        var idx;

	        optstr = theOption;
	        optstr = optstr.concat('_');
	        optstr = optstr.concat(theIndex);

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == $scope.UTC_OffSet_OFS[idx].value) {
	                // set the selected item in the list
	                switch (optstr) {
	                    case 'UTCBgnOfsOpt_0': $scope.UTCBgnOfsLst_0 = $scope.UTC_OffSet_OFS[idx]; break;
	                    case 'UTCEndOfsOpt_0': $scope.UTCEndOfsLst_0 = $scope.UTC_OffSet_OFS[idx]; break;
	                    case 'UTCBgnOfsOpt_1': $scope.UTCBgnOfsLst_1 = $scope.UTC_OffSet_OFS[idx]; break;
	                    case 'UTCEndOfsOpt_1': $scope.UTCEndOfsLst_1 = $scope.UTC_OffSet_OFS[idx]; break;
	                    case 'UTCBgnOfsOpt_2': $scope.UTCBgnOfsLst_2 = $scope.UTC_OffSet_OFS[idx]; break;
	                    case 'UTCEndOfsOpt_2': $scope.UTCEndOfsLst_2 = $scope.UTC_OffSet_OFS[idx]; break;
	                    case 'UTCBgnOfsOpt_3': $scope.UTCBgnOfsLst_3 = $scope.UTC_OffSet_OFS[idx]; break;
	                    case 'UTCEndOfsOpt_3': $scope.UTCEndOfsLst_3 = $scope.UTC_OffSet_OFS[idx]; break;
	                }
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            switch (optstr) {
	                case 'UTCBgnOfsOpt_0': $scope.UTCBgnOfsLst_0 = $scope.UTC_OffSet_OFS[14]; break;
	                case 'UTCEndOfsOpt_0': $scope.UTCEndOfsLst_0 = $scope.UTC_OffSet_OFS[14]; break;
	                case 'UTCBgnOfsOpt_1': $scope.UTCBgnOfsLst_1 = $scope.UTC_OffSet_OFS[14]; break;
	                case 'UTCEndOfsOpt_1': $scope.UTCEndOfsLst_1 = $scope.UTC_OffSet_OFS[14]; break;
	                case 'UTCBgnOfsOpt_2': $scope.UTCBgnOfsLst_2 = $scope.UTC_OffSet_OFS[14]; break;
	                case 'UTCEndOfsOpt_2': $scope.UTCEndOfsLst_2 = $scope.UTC_OffSet_OFS[14]; break;
	                case 'UTCBgnOfsOpt_3': $scope.UTCBgnOfsLst_3 = $scope.UTC_OffSet_OFS[14]; break;
	                case 'UTCEndOfsOpt_3': $scope.UTCEndOfsLst_3 = $scope.UTC_OffSet_OFS[14]; break;
	            }
	        }

	    }

	    // FUNCTION: "initialUTCMinItem" - initialize the selection of time zone "UTC minute offset" configuration in "begin/finish" list
	    function initialUTCMinItem(theOption, theValue, theIndex) {

	        var siz = $scope.UTC_OffSet_MNS.length;

	        var optstr;
	        var idx;

	        optstr = theOption;
	        optstr = optstr.concat('_');
	        optstr = optstr.concat(theIndex);

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == $scope.UTC_OffSet_MNS[idx].value) {
	                // set the selected item in the list
	                switch (optstr) {
	                    case 'UTCBgnMinOpt_0': $scope.UTCBgnMinLst_0 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCEndMinOpt_0': $scope.UTCEndMinLst_0 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCBgnMinOpt_1': $scope.UTCBgnMinLst_1 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCEndMinOpt_1': $scope.UTCEndMinLst_1 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCBgnMinOpt_2': $scope.UTCBgnMinLst_2 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCEndMinOpt_2': $scope.UTCEndMinLst_2 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCBgnMinOpt_3': $scope.UTCBgnMinLst_3 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCEndMinOpt_3': $scope.UTCEndMinLst_3 = $scope.UTC_OffSet_MNS[idx]; break;
	                }
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            switch (optstr) {
	                case 'UTCBgnMinOpt_0': $scope.UTCBgnMinLst_0 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCEndMinOpt_0': $scope.UTCEndMinLst_0 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCBgnMinOpt_1': $scope.UTCBgnMinLst_1 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCEndMinOpt_1': $scope.UTCEndMinLst_1 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCBgnMinOpt_2': $scope.UTCBgnMinLst_2 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCEndMinOpt_2': $scope.UTCEndMinLst_2 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCBgnMinOpt_3': $scope.UTCBgnMinLst_3 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCEndMinOpt_3': $scope.UTCEndMinLst_3 = $scope.UTC_OffSet_MNS[0]; break;
	            }
	        }

	    }

	    // FUNCTION: "initialUTCRnkItem" - initialize the selection of time zone "weekday ranking" configuration in "begin/finish" list
	    function initialUTCRnkItem(theOption, theValue, theIndex) {

	        var siz = $scope.UTC_OffSet_RNK.length;

	        var optstr;
	        var idx;

	        optstr = theOption;
	        optstr = optstr.concat('_');
	        optstr = optstr.concat(theIndex);

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == (idx + 1)) {
	                // set the selected item in the list
	                switch (optstr) {
	                    case 'UTCBgnRnkOpt_0': $scope.UTCBgnRnkLst_0 = $scope.UTC_OffSet_RNK[idx]; break;
	                    case 'UTCEndRnkOpt_0': $scope.UTCEndRnkLst_0 = $scope.UTC_OffSet_RNK[idx]; break;
	                    case 'UTCBgnRnkOpt_1': $scope.UTCBgnRnkLst_1 = $scope.UTC_OffSet_RNK[idx]; break;
	                    case 'UTCEndRnkOpt_1': $scope.UTCEndRnkLst_1 = $scope.UTC_OffSet_RNK[idx]; break;
	                    case 'UTCBgnRnkOpt_2': $scope.UTCBgnRnkLst_2 = $scope.UTC_OffSet_RNK[idx]; break;
	                    case 'UTCEndRnkOpt_2': $scope.UTCEndRnkLst_2 = $scope.UTC_OffSet_RNK[idx]; break;
	                    case 'UTCBgnRnkOpt_3': $scope.UTCBgnRnkLst_3 = $scope.UTC_OffSet_RNK[idx]; break;
	                    case 'UTCEndRnkOpt_3': $scope.UTCEndRnkLst_3 = $scope.UTC_OffSet_RNK[idx]; break;
	                }
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            switch (optstr) {
	                case 'UTCBgnRnkOpt_0': $scope.UTCBgnRnkLst_0 = $scope.UTC_OffSet_RNK[0]; break;
	                case 'UTCEndRnkOpt_0': $scope.UTCEndRnkLst_0 = $scope.UTC_OffSet_RNK[0]; break;
	                case 'UTCBgnRnkOpt_1': $scope.UTCBgnRnkLst_1 = $scope.UTC_OffSet_RNK[0]; break;
	                case 'UTCEndRnkOpt_1': $scope.UTCEndRnkLst_1 = $scope.UTC_OffSet_RNK[0]; break;
	                case 'UTCBgnRnkOpt_2': $scope.UTCBgnRnkLst_2 = $scope.UTC_OffSet_RNK[0]; break;
	                case 'UTCEndRnkOpt_2': $scope.UTCEndRnkLst_2 = $scope.UTC_OffSet_RNK[0]; break;
	                case 'UTCBgnRnkOpt_3': $scope.UTCBgnRnkLst_3 = $scope.UTC_OffSet_RNK[0]; break;
	                case 'UTCEndRnkOpt_3': $scope.UTCEndRnkLst_3 = $scope.UTC_OffSet_RNK[0]; break;
	            }
	        }

	    }

	    // FUNCTION: "initialUTCDayItem" - initialize the selection of time zone "weekday" configuration in "begin/finish" list
	    function initialUTCDayItem(theOption, theValue, theIndex) {

	        var siz = $scope.UTC_OffSet_DAY.length;

	        var optstr;
	        var idx;

	        optstr = theOption;
	        optstr = optstr.concat('_');
	        optstr = optstr.concat(theIndex);

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == idx) {
	                // set the selected item in the list
	                switch (optstr) {
	                    case 'UTCBgnDayOpt_0': $scope.UTCBgnDayLst_0 = $scope.UTC_OffSet_DAY[idx]; break;
	                    case 'UTCEndDayOpt_0': $scope.UTCEndDayLst_0 = $scope.UTC_OffSet_DAY[idx]; break;
	                    case 'UTCBgnDayOpt_1': $scope.UTCBgnDayLst_1 = $scope.UTC_OffSet_DAY[idx]; break;
	                    case 'UTCEndDayOpt_1': $scope.UTCEndDayLst_1 = $scope.UTC_OffSet_DAY[idx]; break;
	                    case 'UTCBgnDayOpt_2': $scope.UTCBgnDayLst_2 = $scope.UTC_OffSet_DAY[idx]; break;
	                    case 'UTCEndDayOpt_2': $scope.UTCEndDayLst_2 = $scope.UTC_OffSet_DAY[idx]; break;
	                    case 'UTCBgnDayOpt_3': $scope.UTCBgnDayLst_3 = $scope.UTC_OffSet_DAY[idx]; break;
	                    case 'UTCEndDayOpt_3': $scope.UTCEndDayLst_3 = $scope.UTC_OffSet_DAY[idx]; break;
	                }
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            switch (optstr) {
	                case 'UTCBgnDayOpt_0': $scope.UTCBgnDayLst_0 = $scope.UTC_OffSet_DAY[0]; break;
	                case 'UTCEndDayOpt_0': $scope.UTCEndDayLst_0 = $scope.UTC_OffSet_DAY[0]; break;
	                case 'UTCBgnDayOpt_1': $scope.UTCBgnDayLst_1 = $scope.UTC_OffSet_DAY[0]; break;
	                case 'UTCEndDayOpt_1': $scope.UTCEndDayLst_1 = $scope.UTC_OffSet_DAY[0]; break;
	                case 'UTCBgnDayOpt_2': $scope.UTCBgnDayLst_2 = $scope.UTC_OffSet_DAY[0]; break;
	                case 'UTCEndDayOpt_2': $scope.UTCEndDayLst_2 = $scope.UTC_OffSet_DAY[0]; break;
	                case 'UTCBgnDayOpt_3': $scope.UTCBgnDayLst_3 = $scope.UTC_OffSet_DAY[0]; break;
	                case 'UTCEndDayOpt_3': $scope.UTCEndDayLst_3 = $scope.UTC_OffSet_DAY[0]; break;
	            }
	        }

	    }

	    // FUNCTION: "initialUTCMthItem" - initialize the selection of time zone "month" configuration in "begin/finish" list
	    function initialUTCMthItem(theOption, theValue, theIndex) {

	        var siz = $scope.UTC_OffSet_MTH.length;

	        var optstr;
	        var idx;

	        optstr = theOption;
	        optstr = optstr.concat('_');
	        optstr = optstr.concat(theIndex);

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == idx) {
	                // set the selected item in the list
	                switch (optstr) {
	                    case 'UTCBgnMthOpt_0': $scope.UTCBgnMthLst_0 = $scope.UTC_OffSet_MTH[idx]; break;
	                    case 'UTCEndMthOpt_0': $scope.UTCEndMthLst_0 = $scope.UTC_OffSet_MTH[idx]; break;
	                    case 'UTCBgnMthOpt_1': $scope.UTCBgnMthLst_1 = $scope.UTC_OffSet_MTH[idx]; break;
	                    case 'UTCEndMthOpt_1': $scope.UTCEndMthLst_1 = $scope.UTC_OffSet_MTH[idx]; break;
	                    case 'UTCBgnMthOpt_2': $scope.UTCBgnMthLst_2 = $scope.UTC_OffSet_MTH[idx]; break;
	                    case 'UTCEndMthOpt_2': $scope.UTCEndMthLst_2 = $scope.UTC_OffSet_MTH[idx]; break;
	                    case 'UTCBgnMthOpt_3': $scope.UTCBgnMthLst_3 = $scope.UTC_OffSet_MTH[idx]; break;
	                    case 'UTCEndMthOpt_3': $scope.UTCEndMthLst_3 = $scope.UTC_OffSet_MTH[idx]; break;
	                }
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            switch (optstr) {
	                case 'UTCBgnMthOpt_0': $scope.UTCBgnMthLst_0 = $scope.UTC_OffSet_MTH[0]; break;
	                case 'UTCEndMthOpt_0': $scope.UTCEndMthLst_0 = $scope.UTC_OffSet_MTH[0]; break;
	                case 'UTCBgnMthOpt_1': $scope.UTCBgnMthLst_1 = $scope.UTC_OffSet_MTH[0]; break;
	                case 'UTCEndMthOpt_1': $scope.UTCEndMthLst_1 = $scope.UTC_OffSet_MTH[0]; break;
	                case 'UTCBgnMthOpt_2': $scope.UTCBgnMthLst_2 = $scope.UTC_OffSet_MTH[0]; break;
	                case 'UTCEndMthOpt_2': $scope.UTCEndMthLst_2 = $scope.UTC_OffSet_MTH[0]; break;
	                case 'UTCBgnMthOpt_3': $scope.UTCBgnMthLst_3 = $scope.UTC_OffSet_MTH[0]; break;
	                case 'UTCEndMthOpt_3': $scope.UTCEndMthLst_3 = $scope.UTC_OffSet_MTH[0]; break;
	            }
	        }

	    }

	    // FUNCTION: "initialUTCTchItem" - initialize the selection of time zone "time change hour" configuration in "begin/finish" list
	    function initialUTCTchItem(theOption, theValue, theIndex) {

	        var siz = $scope.UTC_OffSet_HRS.length;

	        var optstr;
	        var idx;

	        optstr = theOption;
	        optstr = optstr.concat('_');
	        optstr = optstr.concat(theIndex);

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == (idx + 1)) {
	                // set the selected item in the list
	                switch (optstr) {
	                    case 'UTCBgnTchOpt_0': $scope.UTCBgnTchLst_0 = $scope.UTC_OffSet_HRS[idx]; break;
	                    case 'UTCEndTchOpt_0': $scope.UTCEndTchLst_0 = $scope.UTC_OffSet_HRS[idx]; break;
	                    case 'UTCBgnTchOpt_1': $scope.UTCBgnTchLst_1 = $scope.UTC_OffSet_HRS[idx]; break;
	                    case 'UTCEndTchOpt_1': $scope.UTCEndTchLst_1 = $scope.UTC_OffSet_HRS[idx]; break;
	                    case 'UTCBgnTchOpt_2': $scope.UTCBgnTchLst_2 = $scope.UTC_OffSet_HRS[idx]; break;
	                    case 'UTCEndTchOpt_2': $scope.UTCEndTchLst_2 = $scope.UTC_OffSet_HRS[idx]; break;
	                    case 'UTCBgnTchOpt_3': $scope.UTCBgnTchLst_3 = $scope.UTC_OffSet_HRS[idx]; break;
	                    case 'UTCEndTchOpt_3': $scope.UTCEndTchLst_3 = $scope.UTC_OffSet_HRS[idx]; break;
	                }
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            switch (optstr) {
	                case 'UTCBgnTchOpt_0': $scope.UTCBgnTchLst_0 = $scope.UTC_OffSet_HRS[0]; break;
	                case 'UTCEndTchOpt_0': $scope.UTCEndTchLst_0 = $scope.UTC_OffSet_HRS[0]; break;
	                case 'UTCBgnTchOpt_1': $scope.UTCBgnTchLst_1 = $scope.UTC_OffSet_HRS[0]; break;
	                case 'UTCEndTchOpt_1': $scope.UTCEndTchLst_1 = $scope.UTC_OffSet_HRS[0]; break;
	                case 'UTCBgnTchOpt_2': $scope.UTCBgnTchLst_2 = $scope.UTC_OffSet_HRS[0]; break;
	                case 'UTCEndTchOpt_2': $scope.UTCEndTchLst_2 = $scope.UTC_OffSet_HRS[0]; break;
	                case 'UTCBgnTchOpt_3': $scope.UTCBgnTchLst_3 = $scope.UTC_OffSet_HRS[0]; break;
	                case 'UTCEndTchOpt_3': $scope.UTCEndTchLst_3 = $scope.UTC_OffSet_HRS[0]; break;
	            }
	        }

	    }

	    // FUNCTION: "initialUTCTcmItem" - initialize the selection of time zone "time change minute" configuration in "begin/finish" list
	    function initialUTCTcmItem(theOption, theValue, theIndex) {

	        var siz = $scope.UTC_OffSet_MNS.length;

	        var optstr;
	        var idx;

	        optstr = theOption;
	        optstr = optstr.concat('_');
	        optstr = optstr.concat(theIndex);

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == idx) {
	                // set the selected item in the list
	                switch (optstr) {
	                    case 'UTCBgnTcmOpt_0': $scope.UTCBgnTcmLst_0 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCEndTcmOpt_0': $scope.UTCEndTcmLst_0 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCBgnTcmOpt_1': $scope.UTCBgnTcmLst_1 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCEndTcmOpt_1': $scope.UTCEndTcmLst_1 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCBgnTcmOpt_2': $scope.UTCBgnTcmLst_2 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCEndTcmOpt_2': $scope.UTCEndTcmLst_2 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCBgnTcmOpt_3': $scope.UTCBgnTcmLst_3 = $scope.UTC_OffSet_MNS[idx]; break;
	                    case 'UTCEndTcmOpt_3': $scope.UTCEndTcmLst_3 = $scope.UTC_OffSet_MNS[idx]; break;
	                }
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            switch (optstr) {
	                case 'UTCBgnTcmOpt_0': $scope.UTCBgnTcmLst_0 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCEndTcmOpt_0': $scope.UTCEndTcmLst_0 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCBgnTcmOpt_1': $scope.UTCBgnTcmLst_1 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCEndTcmOpt_1': $scope.UTCEndTcmLst_1 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCBgnTcmOpt_2': $scope.UTCBgnTcmLst_2 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCEndTcmOpt_2': $scope.UTCEndTcmLst_2 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCBgnTcmOpt_3': $scope.UTCBgnTcmLst_3 = $scope.UTC_OffSet_MNS[0]; break;
	                case 'UTCEndTcmOpt_3': $scope.UTCEndTcmLst_3 = $scope.UTC_OffSet_MNS[0]; break;
	            }
	        }

	    }

	    // FUNCTION: "initialUTCMrdItem" - initialize the selection of time zone "meridiem" configuration in "begin/finish" list
	    function initialUTCMrdItem(theOption, theValue, theIndex) {

	        var siz = $scope.UTC_OffSet_MRD.length;

	        var optstr;
	        var idx;

	        optstr = theOption;
	        optstr = optstr.concat('_');
	        optstr = optstr.concat(theIndex);

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == $scope.UTC_OffSet_MRD[idx].value) {
	                // set the selected item in the list
	                switch (optstr) {
	                    case 'UTCBgnMrdOpt_0': $scope.UTCBgnMrdLst_0 = $scope.UTC_OffSet_MRD[idx]; break;
	                    case 'UTCEndMrdOpt_0': $scope.UTCEndMrdLst_0 = $scope.UTC_OffSet_MRD[idx]; break;
	                    case 'UTCBgnMrdOpt_1': $scope.UTCBgnMrdLst_1 = $scope.UTC_OffSet_MRD[idx]; break;
	                    case 'UTCEndMrdOpt_1': $scope.UTCEndMrdLst_1 = $scope.UTC_OffSet_MRD[idx]; break;
	                    case 'UTCBgnMrdOpt_2': $scope.UTCBgnMrdLst_2 = $scope.UTC_OffSet_MRD[idx]; break;
	                    case 'UTCEndMrdOpt_2': $scope.UTCEndMrdLst_2 = $scope.UTC_OffSet_MRD[idx]; break;
	                    case 'UTCBgnMrdOpt_3': $scope.UTCBgnMrdLst_3 = $scope.UTC_OffSet_MRD[idx]; break;
	                    case 'UTCEndMrdOpt_3': $scope.UTCEndMrdLst_3 = $scope.UTC_OffSet_MRD[idx]; break;
	                }
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            switch (optstr) {
	                case 'UTCBgnMrdOpt_0': $scope.UTCBgnMrdLst_0 = $scope.UTC_OffSet_MRD[0]; break;
	                case 'UTCEndMrdOpt_0': $scope.UTCEndMrdLst_0 = $scope.UTC_OffSet_MRD[0]; break;
	                case 'UTCBgnMrdOpt_1': $scope.UTCBgnMrdLst_1 = $scope.UTC_OffSet_MRD[0]; break;
	                case 'UTCEndMrdOpt_1': $scope.UTCEndMrdLst_1 = $scope.UTC_OffSet_MRD[0]; break;
	                case 'UTCBgnMrdOpt_2': $scope.UTCBgnMrdLst_2 = $scope.UTC_OffSet_MRD[0]; break;
	                case 'UTCEndMrdOpt_2': $scope.UTCEndMrdLst_2 = $scope.UTC_OffSet_MRD[0]; break;
	                case 'UTCBgnMrdOpt_3': $scope.UTCBgnMrdLst_3 = $scope.UTC_OffSet_MRD[0]; break;
	                case 'UTCEndMrdOpt_3': $scope.UTCEndMrdLst_3 = $scope.UTC_OffSet_MRD[0]; break;
	            }
	        }

	    }

	    // FUNCTION: "initialClockColor" - initialize the selection of "color" configuration in list for each clock
	    function initialClockColor(theClock) {

	        var siz = $scope.CLOCK_COLOR.length;
	        var idx;

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theClock.color == $scope.CLOCK_COLOR[idx].code) {
	                // set the selected item in the list
	                switch (theClock.index) {
	                    case '0': $scope.ClockColorLst_0 = $scope.CLOCK_COLOR[idx]; break;
	                    case '1': $scope.ClockColorLst_1 = $scope.CLOCK_COLOR[idx]; break;
	                    case '2': $scope.ClockColorLst_2 = $scope.CLOCK_COLOR[idx]; break;
	                    case '3': $scope.ClockColorLst_3 = $scope.CLOCK_COLOR[idx]; break;
	                }
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            switch (theClock.index) {
	                case '0': $scope.ClockColorLst_0 = $scope.CLOCK_COLOR[0]; break;
	                case '1': $scope.ClockColorLst_1 = $scope.CLOCK_COLOR[0]; break;
	                case '2': $scope.ClockColorLst_2 = $scope.CLOCK_COLOR[0]; break;
	                case '3': $scope.ClockColorLst_3 = $scope.CLOCK_COLOR[0]; break;
	            }
	        }

	    }

	    // FUNCTION: "initialClockFaceDisplay" - initialize the selection of "clock face display" configuration in the list
	    function initialClockFaceDisplay(theValue) {

	        var siz = $scope.CLOCK_FACE_DISPLAY.length;
	        var idx;

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == $scope.CLOCK_FACE_DISPLAY[idx].code) {
	                // set the selected item in the list
	                $scope.clockFaceDisplayLst = $scope.CLOCK_FACE_DISPLAY[idx];
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            $scope.clockFaceDisplayLst = $scope.CLOCK_FACE_DISPLAY[0];
	        }

	    }

	    // FUNCTION: "initialClockFacePlace" - initialize the selection of "clock face location" configuration in the list
	    function initialClockFacePlace(theValue) {

	        var siz = $scope.CLOCK_FACE_PLACE.length;
	        var idx;

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == idx) {
	                // set the selected item in the list
	                $scope.clockFacePlaceLst = $scope.CLOCK_FACE_PLACE[idx];
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            $scope.clockFacePlaceLst = $scope.CLOCK_FACE_PLACE[0];
	        }

	    }

	    // FUNCTION: "initialClockFaceHours" - initialize the selection of "clock face hour" configuration in the list
	    function initialClockFaceHours(theValue) {

	        var siz = $scope.CLOCK_FACE_HOURS.length;
	        var idx;

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == idx) {
	                // set the selected item in the list
	                $scope.clockFaceHoursLst = $scope.CLOCK_FACE_HOURS[idx];
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            $scope.clockFaceHoursLst = $scope.CLOCK_FACE_HOURS[0];
	        }

	    }

	    // FUNCTION: "initialDateType" - initialize the selection of "date type" configuration in the list
	    function initialDateType(theValue) {

	        var siz = $scope.DATE_TYPES.length;
	        var val;
	        var idx;

	        val = parseInt(theValue);

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (val == (idx + 1)) {
	                // set the selected item in the list
	                $scope.dateTypeLst = $scope.DATE_TYPES[idx];
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            $scope.dateTypeLst = $scope.DATE_TYPES[1];
	        }

	    }

	    // FUNCTION: "initialDateTextOrder" - initialize the selection of "date/text order" configuration in the list
	    function initialDateTextOrder(theValue) {

	        var siz = $scope.DATE_TEXT_ORDER.length;
	        var idx;

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == $scope.DATE_TEXT_ORDER[idx].code) {
	                // set the selected item in the list
	                $scope.datetextOrderLst = $scope.DATE_TEXT_ORDER[idx];
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            $scope.datetextOrderLst = $scope.DATE_TEXT_ORDER[0];
	        }

	    }

	    // FUNCTION: "initialDateText" - initialize the selection of "date text" configuration in the list
	    function initialDateText(theValue) {

	        var siz = $scope.DATE_TEXT.length;
	        var idx;

	        // iterate through all of the values in the array looking for a match
	        for (idx = 0; ((idx >= 0) && (idx < siz)); idx++) {
	            // did we find the matching item in the list?
	            if (theValue == $scope.DATE_TEXT[idx].code) {
	                // set the selected item in the list
	                $scope.dateTextLst = $scope.DATE_TEXT[idx];
	                // now quit...
	                idx = siz + 1;
	            }
	        }
	        // set default selection if we did not find matching item...
	        if (idx == siz) {
	            $scope.dateTextLst = $scope.DATE_TEXT[0];
	        }

	    }

	    // FUNCTION: "initialMultipleClockOrder" - initialize the selection of the clock order configuration in the list
	    function initialMultipleClockOrder(theValue) {

	        var idx;
	        var clk;

	        // iterate through each of the three clocks
	        for (idx = 0; (idx <= 2); idx++) {
	            clk = parseInt(theValue.substring(idx, (idx + 1)));
	            // set selected item in the list
	            switch (idx) {
	                case 0: $scope.multipleClockOrderLst_0 = $scope.CLOCK_FACE_MULTIPLE[clk]; break;
	                case 1: $scope.multipleClockOrderLst_1 = $scope.CLOCK_FACE_MULTIPLE[clk]; break;
	                case 2: $scope.multipleClockOrderLst_2 = $scope.CLOCK_FACE_MULTIPLE[clk]; break;
	            }
	        }

	    }

	    // FUNCTION: "setFlag" - convert boolean flag to corresponding character: 'X' (true) / '' (false)
	    function setFlag(theFlag) {

	        var itmflg;

	        if (theFlag == true) {
	            itmflg = 'X';
	        }
	        else if (theFlag == false) {
	            itmflg = '';
	        }
	        else {
	            itmflg = theFlag;
	        }

	        return itmflg;
	    }

	    // FUNCTION: "getFlag" - convert character 'X' (true) / '' (false) to corresponding boolean flag
	    function getFlag(theFlag) {

	        var itmflg;

	        if (theFlag == 'X') {
	            itmflg = true;
	        }
	        else if (theFlag == '') {
	            itmflg = false;
	        }
	        else {
	            itmflg = theFlag;
	        }

	        return itmflg;
	    }

	    // FUNCTION: "loadTheFormats" - load the formats used to display each element comprising a clock face
	    function loadTheFormats() {

	        $scope.boxSize = configService.getValue('boxSize');
	        $scope.formats.clockFacePlace = getFlag(configService.getValue('clockFacePlace'));
	        $scope.formats.multipleClocks = configService.getValue('multipleClocks');
	        $scope.formats.clockFaceHours = configService.getValue('clockFaceHours');

	        initialClockFaceDisplay($scope.formats.multipleClocks);
	        initialClockFacePlace($scope.formats.clockFacePlace);
	        initialClockFaceHours($scope.formats.clockFaceHours);

	        $scope.formats.clockMeridiem = getFlag(configService.getValue('clockMeridiem'));

	        $scope.formats.clockSeparator = configService.getValue('clockSeparator');
	        $scope.formats.dateSeparator = configService.getValue('dateSeparator');
	        $scope.formats.clockSeconds = getFlag(configService.getValue('clockSeconds'));
	        $scope.formats.clockZeroToHour = getFlag(configService.getValue('clockZeroToHour'));

	        $scope.formats.dateCentury = getFlag(configService.getValue('dateCentury'));

	        $scope.formats.dateType = configService.getValue('dateType');
	        initialDateType($scope.formats.dateType);
	        $scope.formats.datetextOrder = configService.getValue('datetextOrder');
	        initialDateTextOrder($scope.formats.datetextOrder);
	        $scope.formats.dateText = configService.getValue('dateText');
	        initialDateText($scope.formats.dateText);

	        $scope.formats.showActiveDST = getFlag(configService.getValue('showActiveDST'));

	        $scope.formats.multipleClockOrder = configService.getValue('multipleClockOrder');
	        initialMultipleClockOrder($scope.formats.multipleClockOrder);

	    }

	    // FUNCTION: "loadTheClock" - load the configurations for the specified clock retrieved from the server
	    function loadTheClock(theClock) {

	        var idx;

	        idx = parseInt(theClock.index);

	        theClock.index = (configService.getClock(idx)).index;
	        theClock.location = (configService.getClock(idx)).location;
	        theClock.isDST = getFlag((configService.getClock(idx)).isDST);
	        theClock.DSTPeriod = (configService.getClock(idx)).DSTPeriod;
	        theClock.DSTbgnOFS = (configService.getClock(idx)).DSTbgnOFS;
	        theClock.DSTbgnMIN = (configService.getClock(idx)).DSTbgnMIN;
	        theClock.DSTbgnRNK = (configService.getClock(idx)).DSTbgnRNK;
	        theClock.DSTbgnDAY = (configService.getClock(idx)).DSTbgnDAY;
	        theClock.DSTbgnMTH = (configService.getClock(idx)).DSTbgnMTH;
	        theClock.DSTbgnTCH = (configService.getClock(idx)).DSTbgnTCH;
	        theClock.DSTbgnTCM = (configService.getClock(idx)).DSTbgnTCM;
	        theClock.DSTbgnMRD = (configService.getClock(idx)).DSTbgnMRD;
	        theClock.DSTendOFS = (configService.getClock(idx)).DSTendOFS;
	        theClock.DSTendRNK = (configService.getClock(idx)).DSTendRNK;
	        theClock.DSTendDAY = (configService.getClock(idx)).DSTendDAY;
	        theClock.DSTendMTH = (configService.getClock(idx)).DSTendMTH;
	        theClock.DSTendMIN = (configService.getClock(idx)).DSTendMIN;
	        theClock.DSTendTCH = (configService.getClock(idx)).DSTendTCH;
	        theClock.DSTendTCM = (configService.getClock(idx)).DSTendTCM;
	        theClock.DSTendMRD = (configService.getClock(idx)).DSTendMRD;
	        theClock.color = (configService.getClock(idx)).color;

	    }

	    // FUNCTION: "InitialTheClock" - display the configurations for each clock in the HTML page
	    function initialTheClock(theClock) {

	        initialUTCPrdItem(theClock);

	        initialUTCOfsItem('UTCBgnOfsOpt', theClock.DSTbgnOFS, theClock.index);
	        initialUTCMinItem('UTCBgnMinOpt', theClock.DSTbgnMIN, theClock.index);
	        initialUTCRnkItem('UTCBgnRnkOpt', theClock.DSTbgnRNK, theClock.index);
	        initialUTCDayItem('UTCBgnDayOpt', theClock.DSTbgnDAY, theClock.index);
	        initialUTCMthItem('UTCBgnMthOpt', theClock.DSTbgnMTH, theClock.index);
	        initialUTCTchItem('UTCBgnTchOpt', theClock.DSTbgnTCH, theClock.index);
	        initialUTCTcmItem('UTCBgnTcmOpt', theClock.DSTbgnTCM, theClock.index);
	        initialUTCMrdItem('UTCBgnMrdOpt', theClock.DSTbgnMRD, theClock.index);

	        initialUTCOfsItem('UTCEndOfsOpt', theClock.DSTendOFS, theClock.index);
	        initialUTCMinItem('UTCEndMinOpt', theClock.DSTendMIN, theClock.index);
	        initialUTCRnkItem('UTCEndRnkOpt', theClock.DSTendRNK, theClock.index);
	        initialUTCDayItem('UTCEndDayOpt', theClock.DSTendDAY, theClock.index);
	        initialUTCMthItem('UTCEndMthOpt', theClock.DSTendMTH, theClock.index);
	        initialUTCTchItem('UTCEndTchOpt', theClock.DSTendTCH, theClock.index);
	        initialUTCTcmItem('UTCEndTcmOpt', theClock.DSTendTCM, theClock.index);
	        initialUTCMrdItem('UTCEndMrdOpt', theClock.DSTendMRD, theClock.index);

	        initialClockColor(theClock);

	    }

	    // load clock format into localized "objects"
	    loadTheFormats();

	    // load clock time zones into localized "objects"
	    loadTheClock($scope.clock_0);
	    loadTheClock($scope.clock_1);
	    loadTheClock($scope.clock_2);
	    loadTheClock($scope.clock_3);

	    // initialize clock configurations
	    initialTheClock($scope.clock_0);
	    initialTheClock($scope.clock_1);
	    initialTheClock($scope.clock_2);
	    initialTheClock($scope.clock_3);

	    // FUNCTION: "reset_click" - reset clock configurations when button "clicked"
	    $scope.reset_click = function() {

          var opt;

	        // reset default time zones
	        configService.getDefaultClock($scope.clock_0);
	        $scope.clock_0.isDST = getFlag($scope.clock_0.isDST);
	        configService.getDefaultClock($scope.clock_1);
	        $scope.clock_1.isDST = getFlag($scope.clock_1.isDST);
	        configService.getDefaultClock($scope.clock_2);
	        $scope.clock_2.isDST = getFlag($scope.clock_2.isDST);
	        configService.getDefaultClock($scope.clock_3);
	        $scope.clock_3.isDST = getFlag($scope.clock_3.isDST);

	        // make sure to toggle "begin" configurations with "end" configurations for "ADELAIDE, S. AU"
	        // to match populating the configuration as if were being loaded in reverse.  When we save
	        // thee configuration we will toggled it back again so as to save values properly in the
	        // structure

	        toggleClockConfig($scope.clock_3);

	        // display default time zone settings each clock
	        for (opt = 0; opt < $scope.UTC_Option_Fields.length; opt++) {
	            $scope.resetTheOption(0, opt);
	            $scope.resetTheOption(1, opt);
	            $scope.resetTheOption(2, opt);
	            $scope.resetTheOption(3, opt);
	        }

	        // reset/display default clock formats
	        $scope.boxSize = configService.getDefaultValue('boxSize');
	        $scope.resetClockFaceDisplay();
	        $scope.resetClockFacePlace();
	        $scope.resetClockFaceHours();
	        $scope.formats.clockMeridiem = getFlag(configService.getDefaultValue('clockMeridiem'));
	        $scope.formats.clockSeparator = configService.getDefaultValue('clockSeparator');
	        $scope.formats.dateSeparator = configService.getDefaultValue('dateSeparator');
	        $scope.formats.clockSeconds = getFlag(configService.getDefaultValue('clockSeconds'));
	        $scope.formats.clockZeroToHour = getFlag(configService.getDefaultValue('clockZeroToHour'));
	        $scope.formats.dateCentury = getFlag(configService.getDefaultValue('dateCentury'));
	        $scope.resetDateType();
	        $scope.resetDateTextOrder();
	        $scope.resetDateText();
	        $scope.formats.showActiveDST = getFlag(configService.getDefaultValue('showActiveDST'));
	        $scope.resetColorOption();
	        $scope.resetMultipleClockOrder();
	    };

	    // FUNCTION: "resetTheOption" - reselects default time zone clock configuration in each of the lists
	    $scope.resetTheOption = function(clk, opt) {

	        var clk_0_bgn = [0, 1, 0, 2, 1, 0, 0, 18, 0];
	        var clk_0_end = [1, 0, 0, 10, 1, 0, 0, 19, 0];
	        var clk_1_bgn = [0, 4, 0, 2, 1, 0, 0, 12, 0];
	        var clk_1_end = [1, 4, 0, 9, 2, 0, 0, 13, 0];
	        var clk_2_bgn = [0, 0, 0, 0, 11, 0, 0, 24, 0];
	        var clk_2_end = [1, 0, 0, 0, 11, 0, 0, 14, 0];
	        var clk_3_bgn = [1, 0, 0, 3, 2, 0, 0, 5, 30];   // this entered in reverse order (end/bgn) for display purposes only
	        var clk_3_end = [0, 0, 0, 9, 1, 0, 0, 4, 30];

	        var itmlst;
	        var optstr;

	        optstr = 'UTCBgn';
	        optstr = optstr.concat($scope.UTC_Option_Fields[opt].value);
	        optstr = optstr.concat('Opt_');
	        optstr = optstr.concat(clk);

	        itmlst = document.getElementById(optstr);
	        switch (clk) {
	            case 0: itmlst.selectedIndex = clk_0_bgn[opt]; break;
	            case 1: itmlst.selectedIndex = clk_1_bgn[opt]; break;
	            case 2: itmlst.selectedIndex = clk_2_bgn[opt]; break;
	            case 3: itmlst.selectedIndex = clk_3_bgn[opt]; break;
	        }

	        optstr = 'UTCEnd';
	        optstr = optstr.concat($scope.UTC_Option_Fields[opt].value);
	        optstr = optstr.concat('Opt_');
	        optstr = optstr.concat(clk);

	        itmlst = document.getElementById(optstr);
	        switch (clk) {
	            case 0: itmlst.selectedIndex = clk_0_end[opt]; break;
	            case 1: itmlst.selectedIndex = clk_1_end[opt]; break;
	            case 2: itmlst.selectedIndex = clk_2_end[opt]; break;
	            case 3: itmlst.selectedIndex = clk_3_end[opt]; break;
	        }
	    };

	    // FUNCTION: "resetColorOption" - reselects default color of clock configuration in each of the lists
	    $scope.resetColorOption = function() {

	        var clk_clr = [0, 0, 5, 2];

	        var itmlst;
	        var optstr;
	        var opt;

	        for (opt = 0; opt < $scope.CLOCK_COLOR.length; opt++) {
	            optstr = 'ClockColorOpt_';
	            optstr = optstr.concat(opt.toString());
	            itmlst = document.getElementById(optstr);
	            switch (opt) {
	                case 0: itmlst.selectedIndex = clk_clr[opt]; break;
	                case 1: itmlst.selectedIndex = clk_clr[opt]; break;
	                case 2: itmlst.selectedIndex = clk_clr[opt]; break;
	                case 3: itmlst.selectedIndex = clk_clr[opt]; break;
	            }
	        }
	    };

	    // FUNCTION: "resetClockFaceDisplay" - resets default clock face display and selects configuration in list
	    $scope.resetClockFaceDisplay = function() {

	        var itmlst;

	        $scope.formats.multipleClocks = configService.getDefaultValue('multipleClocks');

	        // force first item in list to be selected...
	        itmlst = document.getElementById('clockFaceDisplayOpt');
	        itmlst.selectedIndex = 0;

	    };

	    // FUNCTION: "resetClockFacePlace" - resets default clock face location and selects configuration in list
	    $scope.resetClockFacePlace = function() {

	        var itmlst;

	        $scope.formats.clockFacePlace = configService.getDefaultValue('clockFacePlace');

	        // force first item in list to be selected...
	        itmlst = document.getElementById('clockFacePlaceOpt');
	        itmlst.selectedIndex = 0;

	    };

	    // FUNCTION: "resetClockFaceHours" - resets default clock face hours and selects configuration in list
	    $scope.resetClockFaceHours = function() {

	        var itmlst;

	        $scope.formats.clockFaceHours = configService.getDefaultValue('clockFacePlace');

	        // force first item in list to be selected...
	        itmlst = document.getElementById('clockFaceHoursOpt');
	        itmlst.selectedIndex = 0;

	    };

	    // FUNCTION: "resetDateType" - resets default date type and selects configuration in list
	    $scope.resetDateType = function() {

	        var itmlst;

	        $scope.formats.dateType = configService.getDefaultValue('dateType');

	        // force first item in list to be selected...
	        itmlst = document.getElementById('dateTypeOpt');
	        itmlst.selectedIndex = 1;

	    };

	    // FUNCTION: "resetDateTextOrder" - resets default order of date/text displayed in clock face and selects configuration in list
	    $scope.resetDateTextOrder = function() {

	        var itmlst;

	        $scope.formats.datetextOrder = configService.getDefaultValue('datetextOrder');

	        // force first item in list to be selected...
	        itmlst = document.getElementById('datetextOrderOpt');
	        itmlst.selectedIndex = 0;

	    };

	    // FUNCTION: "resetDateText" - resets default date text and selects configuration in list
	    $scope.resetDateText = function() {

	        var itmlst;

	        $scope.formats.dateText = configService.getDefaultValue('dateText');

	        // force first item in list to be selected...
	        itmlst = document.getElementById('dateTextOpt');
	        itmlst.selectedIndex = 1;

	    };

	    // FUNCTION: "resetMultipleClockOrder" - reselects default order of clock configuration in each of the lists
	    $scope.resetMultipleClockOrder = function() {

	        var clk_ord = [2, 3, 4];

	        var itmlst;
	        var optstr;
	        var opt;

	        for (opt = 0; opt < $scope.CLOCK_COLOR.length; opt++) {
	            optstr = 'multipleClockOrderOpt_';
	            optstr = optstr.concat(opt.toString());
	            itmlst = document.getElementById(optstr);
	            switch (opt) {
	                case 0: itmlst.selectedIndex = clk_ord[opt]; break;
	                case 1: itmlst.selectedIndex = clk_ord[opt]; break;
	                case 2: itmlst.selectedIndex = clk_ord[opt]; break;
	            }
	        }
	    };

	    // FUNCTION: "setClockData" - prepares clock data for "saving" according to selected configurations
	    $scope.setClockData = function(theClock) {

	        theClock.isDST = setFlag(theClock.isDST);

	        // if DST is not active, then clear DST "end"
	        if (theClock.isDST == '') {
	            theClock.DSTPeriod = 'B:E';
	            theClock.DSTbgnRNK = '1';
	            theClock.DSTbgnDAY = '0';
	            theClock.DSTbgnMTH = '0';
	            theClock.DSTbgnTCH = '12';
	            theClock.DSTbgnTCM = '00';
	            theClock.DSTbgnMRD = 'AM';
	            theClock.DSTendOFS = 'UTC+0';
	            theClock.DSTendMIN = '00';
	            theClock.DSTendRNK = '1';
	            theClock.DSTendDAY = '0';
	            theClock.DSTendMTH = '0';
	            theClock.DSTendTCH = '12';
	            theClock.DSTendTCM = '00';
	            theClock.DSTendMRD = 'AM';
	        }

	        if (theClock.DSTPeriod == 'E:B') {
	            // toggle "begin" configurations with "end" configurations because DST periods have
	            // been entered "backwards" from how they need to be stored in the structure
	            toggleClockConfig(theClock);
	        }
	    };

	    // FUNCTION: "save_click" - save clock configurations when button "clicked"
	    $scope.save_click = function() {

	        // save clock formats
	        $scope.setClockFaceDisplay();
	        $scope.setClockFacePlace();
	        $scope.setClockFaceHours();
	        configService.setValue('clockSeparator', $scope.formats.clockSeparator);
	        configService.setValue('dateSeparator', $scope.formats.dateSeparator);
	        configService.setValue('clockMeridiem', setFlag($scope.formats.clockMeridiem));
	        configService.setValue('clockSeconds', setFlag($scope.formats.clockSeconds));
	        configService.setValue('clockZeroToHour', setFlag($scope.formats.clockZeroToHour));
	        configService.setValue('dateCentury', setFlag($scope.formats.dateCentury));
	        $scope.setDateType();
	        $scope.setDateTextOrder();
	        $scope.setDateText();
	        configService.setValue('showActiveDST', setFlag($scope.formats.showActiveDST));
	        $scope.setMultipleClockOrder();

	        // prepare time zone settings
	        $scope.setClockData($scope.clock_0);
	        $scope.setClockData($scope.clock_1);
	        $scope.setClockData($scope.clock_2);
	        $scope.setClockData($scope.clock_3);

	        // save clock time zones
	        configService.setClock($scope.clock_0);
	        configService.setClock($scope.clock_1);
	        configService.setClock($scope.clock_2);
	        configService.setClock($scope.clock_3);

	        $scope.$emit('closeSettingsScreen'); // Persisting the settings
	    };

	    // FUNCTION: "setClockFaceDisplay" - set multiple clock flag / box size configurations
	    $scope.setClockFaceDisplay = function() {

	        var itmlst;
	        var itmVal;

	        // save selected index as index of clock face location
	        itmlst = document.getElementById('clockFaceDisplayOpt');
	        itmVal = itmlst.selectedIndex;
	        $scope.formats.multipleClocks = $scope.CLOCK_FACE_DISPLAY[itmVal].code;

	        configService.setValue('multipleClocks', $scope.formats.multipleClocks);

	        // only set clock for large window if multiple clocks being displayed, otherwise default to small window
	        $scope.boxSize = ($scope.formats.multipleClocks == '') ? '1' : '2';
	        configService.setValue('boxSize', $scope.boxSize);
	    };

	    // FUNCTION: "setClockFacePlace" - set selected index of clock face location configuration
	    $scope.setClockFacePlace = function() {

	        var itmlst;

	        // save selected index as index of clock face location
	        itmlst = document.getElementById('clockFacePlaceOpt');
	        $scope.formats.clockFacePlace = itmlst.selectedIndex.toString();

	        configService.setValue('clockFacePlace', $scope.formats.clockFacePlace);
	    };

	    // FUNCTION: "setClockFaceHours" - set selected index of clock face hour configuration
	    $scope.setClockFaceHours = function() {

	        var itmlst;

	        // save selected index as index of clock face location
	        itmlst = document.getElementById('clockFaceHoursOpt');
	        $scope.formats.clockFaceHours = itmlst.selectedIndex.toString();

	        configService.setValue('clockFaceHours', $scope.formats.clockFaceHours);
	    };

	    // FUNCTION: "setDateType" - set selected index of date type configuration
	    $scope.setDateType = function() {

	        var itmlst;
	        var itmVal;

	        // save selected index as index of clock face location
	        itmlst = document.getElementById('dateTypeOpt');
	        itmVal = itmlst.selectedIndex + 1;
	        $scope.formats.dateType = itmVal.toString();

	        configService.setValue('dateType', $scope.formats.dateType);
	    };

	    // FUNCTION: "setDateTextOrder" - set selected index of text/date order configuration
	    $scope.setDateTextOrder = function() {

	        var itmlst;
	        var itmVal;

	        // save selected index as index of text/date order
	        itmlst = document.getElementById('datetextOrderOpt');
	        itmVal = itmlst.selectedIndex;
	        $scope.formats.datetextOrder = $scope.DATE_TEXT_ORDER[itmVal].code;

	        configService.setValue('datetextOrder', $scope.formats.datetextOrder);
	    };

	    // FUNCTION: "setDateText" - set selected index of date text configuration
	    $scope.setDateText = function() {

	        var itmlst;
	        var itmVal;

	        // save selected index as index of clock face location
	        itmlst = document.getElementById('dateTextOpt');
	        itmVal = itmlst.selectedIndex;
	        $scope.formats.dateText = $scope.DATE_TEXT[itmVal].code;

	        configService.setValue('dateText', $scope.formats.dateText);
	    };

	    // FUNCTION: "setMultipleClockOrder" - set selected index of each clock's display order configuration
	    $scope.setMultipleClockOrder = function() {

	        var itmlst;
	        var itmVal = '';

	        // save selected index as index of clock face location
	        itmlst = document.getElementById('multipleClockOrderOpt_0');
	        itmVal = itmVal.concat(itmlst.selectedIndex.toString());
	        itmlst = document.getElementById('multipleClockOrderOpt_1');
	        itmVal = itmVal.concat(itmlst.selectedIndex.toString());
	        itmlst = document.getElementById('multipleClockOrderOpt_2');
	        itmVal = itmVal.concat(itmlst.selectedIndex.toString());

	        $scope.formats.multipleClockOrder = itmVal;
	        configService.setValue('multipleClockOrder', $scope.formats.multipleClockOrder);
	    };

	    // FUNCTION: "ChgUTC_PRD" - set selected value of both "begin/finish" time zone period configurations according to list selection made the user
	    $scope.ChgUTC_PRD = function() {

	        var itmlst1;
	        var itmlst2;
	        var itmstr;

	        itmlst1 = document.activeElement;
	        itmstr = itmlst1.id.substring(0, 12);

	        switch (itmstr) {
	            case 'UTCBgnPrdOpt':
	                itmstr = itmlst1.id.replace('Bgn', 'End');
	                switch (itmstr.substring(13)) {
	                    case '0': $scope.clock_0.DSTPeriod = (itmlst1.selectedIndex == 0) ? 'B:E' : 'E:B'; break;
	                    case '1': $scope.clock_1.DSTPeriod = (itmlst1.selectedIndex == 0) ? 'B:E' : 'E:B'; break;
	                    case '2': $scope.clock_2.DSTPeriod = (itmlst1.selectedIndex == 0) ? 'B:E' : 'E:B'; break;
	                    case '3': $scope.clock_3.DSTPeriod = (itmlst1.selectedIndex == 0) ? 'B:E' : 'E:B'; break;
	                }
	                break;
	            case 'UTCEndPrdOpt':
	                itmstr = itmlst1.id.replace('End', 'Bgn');
	                switch (itmstr.substring(13)) {
	                    case '0': $scope.clock_0.DSTPeriod = (itmlst1.selectedIndex == 0) ? 'E:B' : 'B:E'; break;
	                    case '1': $scope.clock_1.DSTPeriod = (itmlst1.selectedIndex == 0) ? 'E:B' : 'B:E'; break;
	                    case '2': $scope.clock_2.DSTPeriod = (itmlst1.selectedIndex == 0) ? 'E:B' : 'B:E'; break;
	                    case '3': $scope.clock_3.DSTPeriod = (itmlst1.selectedIndex == 0) ? 'E:B' : 'B:E'; break;
	                }
	                break;
	        }

	        // toggle order of the period setting
	        itmlst2 = document.getElementById(itmstr);
	        itmlst2.selectedIndex = (itmlst1.selectedIndex == 0) ? 1 : 0;
	    };

	    // FUNCTION: "ChgUTC_OFS" - set selected value of time zone UTC "hour offset" configuration according to list selection made by the user
	    $scope.ChgUTC_OFS = function() {

	        var itmlst;

	        itmlst = document.activeElement;

	        switch (itmlst.id) {
	            case 'UTCBgnOfsOpt_0': $scope.clock_0.DSTbgnOFS = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndOfsOpt_0': $scope.clock_0.DSTendOFS = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnOfsOpt_1': $scope.clock_1.DSTbgnOFS = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndOfsOpt_1': $scope.clock_1.DSTendOFS = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnOfsOpt_2': $scope.clock_2.DSTbgnOFS = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndOfsOpt_2': $scope.clock_2.DSTendOFS = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnOfsOpt_3': $scope.clock_3.DSTbgnOFS = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndOfsOpt_3': $scope.clock_3.DSTendOFS = itmlst.options[itmlst.selectedIndex].text; break;
	        }
	    };

	    // FUNCTION: "ChgUTC_MIN" - set selected value of time zone UTC "minute offset" configuration according to list selection made by the user
	    $scope.ChgUTC_MIN = function() {

	        var itmlst;

	        itmlst = document.activeElement;

	        switch (itmlst.id) {
	            case 'UTCBgnMinOpt_0': $scope.clock_0.DSTbgnMIN = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndMinOpt_0': $scope.clock_0.DSTendMIN = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnMinOpt_1': $scope.clock_1.DSTbgnMIN = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndMinOpt_1': $scope.clock_1.DSTendMIN = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnMinOpt_2': $scope.clock_2.DSTbgnMIN = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndMinOpt_2': $scope.clock_2.DSTendMIN = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnMinOpt_3': $scope.clock_3.DSTbgnMIN = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndMinOpt_3': $scope.clock_3.DSTendMIN = itmlst.options[itmlst.selectedIndex].text; break;
	        }
	    };

	    // FUNCTION: "ChgUTC_RNK" - set selected value of time zone "weekday ranking" configuration according to list selection made by the user
	    $scope.ChgUTC_RNK = function() {

	        var itmlst;

	        itmlst = document.activeElement;
	        switch (itmlst.id) {
	            case 'UTCBgnRnkOpt_0': $scope.clock_0.DSTbgnRNK = itmlst.selectedIndex + 1; break;
	            case 'UTCEndRnkOpt_0': $scope.clock_0.DSTendRNK = itmlst.selectedIndex + 1; break;
	            case 'UTCBgnRnkOpt_1': $scope.clock_1.DSTbgnRNK = itmlst.selectedIndex + 1; break;
	            case 'UTCEndRnkOpt_1': $scope.clock_1.DSTendRNK = itmlst.selectedIndex + 1; break;
	            case 'UTCBgnRnkOpt_2': $scope.clock_2.DSTbgnRNK = itmlst.selectedIndex + 1; break;
	            case 'UTCEndRnkOpt_2': $scope.clock_2.DSTendRNK = itmlst.selectedIndex + 1; break;
	            case 'UTCBgnRnkOpt_3': $scope.clock_3.DSTbgnRNK = itmlst.selectedIndex + 1; break;
	            case 'UTCEndRnkOpt_3': $scope.clock_3.DSTendRNK = itmlst.selectedIndex + 1; break;
	        }
	    };

	    // FUNCTION: "ChgUTC_DAY" - set selected value of time zone "weekday" configuration according to list selection made by the user
	    $scope.ChgUTC_DAY = function() {

	        var itmlst;

	        itmlst = document.activeElement;
	        switch (itmlst.id) {
	            case 'UTCBgnDayOpt_0': $scope.clock_0.DSTbgnDAY = itmlst.selectedIndex; break;
	            case 'UTCEndDayOpt_0': $scope.clock_0.DSTendDAY = itmlst.selectedIndex; break;
	            case 'UTCBgnDayOpt_1': $scope.clock_1.DSTbgnDAY = itmlst.selectedIndex; break;
	            case 'UTCEndDayOpt_1': $scope.clock_1.DSTendDAY = itmlst.selectedIndex; break;
	            case 'UTCBgnDayOpt_2': $scope.clock_2.DSTbgnDAY = itmlst.selectedIndex; break;
	            case 'UTCEndDayOpt_2': $scope.clock_2.DSTendDAY = itmlst.selectedIndex; break;
	            case 'UTCBgnDayOpt_3': $scope.clock_3.DSTbgnDAY = itmlst.selectedIndex; break;
	            case 'UTCEndDayOpt_3': $scope.clock_3.DSTendDAY = itmlst.selectedIndex; break;
	        }
	    };

	    // FUNCTION: "ChgUTC_MTH" - set selected value of time zone "month" configuration according to list selection made by the user
	    $scope.ChgUTC_MTH = function() {

	        var itmlst;

	        itmlst = document.activeElement;
	        switch (itmlst.id) {
	            case 'UTCBgnMthOpt_0': $scope.clock_0.DSTbgnMTH = itmlst.selectedIndex; break;
	            case 'UTCEndMthOpt_0': $scope.clock_0.DSTendMTH = itmlst.selectedIndex; break;
	            case 'UTCBgnMthOpt_1': $scope.clock_1.DSTbgnMTH = itmlst.selectedIndex; break;
	            case 'UTCEndMthOpt_1': $scope.clock_1.DSTendMTH = itmlst.selectedIndex; break;
	            case 'UTCBgnMthOpt_2': $scope.clock_2.DSTbgnMTH = itmlst.selectedIndex; break;
	            case 'UTCEndMthOpt_2': $scope.clock_2.DSTendMTH = itmlst.selectedIndex; break;
	            case 'UTCBgnMthOpt_3': $scope.clock_3.DSTbgnMTH = itmlst.selectedIndex; break;
	            case 'UTCEndMthOpt_3': $scope.clock_3.DSTendMTH = itmlst.selectedIndex; break;
	        }
	    };

	    // FUNCTION: "ChgUTC_TCH" - set selected value of time zone "time change hour" configuration according to list selection made by the user
	    $scope.ChgUTC_TCH = function() {

	        var itmlst;

	        itmlst = document.activeElement;
	        switch (itmlst.id) {
	            case 'UTCBgnTchOpt_0': $scope.clock_0.DSTbgnTCH = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndTchOpt_0': $scope.clock_0.DSTendTCH = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnTchOpt_1': $scope.clock_1.DSTbgnTCH = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndTchOpt_1': $scope.clock_1.DSTendTCH = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnTchOpt_2': $scope.clock_2.DSTbgnTCH = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndTchOpt_2': $scope.clock_2.DSTendTCH = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnTchOpt_3': $scope.clock_3.DSTbgnTCH = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndTchOpt_3': $scope.clock_3.DSTendTCH = itmlst.options[itmlst.selectedIndex].text; break;
	        }
	    };

	    // FUNCTION: "ChgUTC_TCM" - set selected value of time zone "time change minute" configuration according to list selection made by the user
	    $scope.ChgUTC_TCM = function() {
	        var itmlst;

	        itmlst = document.activeElement;
	        switch (itmlst.id) {
	            case 'UTCBgnTcmOpt_0': $scope.clock_0.DSTbgnTCM = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndTcmOpt_0': $scope.clock_0.DSTendTCM = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnTcmOpt_1': $scope.clock_1.DSTbgnTCM = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndTcmOpt_1': $scope.clock_1.DSTendTCM = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnTcmOpt_2': $scope.clock_2.DSTbgnTCM = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndTcmOpt_2': $scope.clock_2.DSTendTCM = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnTcmOpt_3': $scope.clock_3.DSTbgnTCM = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndTcmOpt_3': $scope.clock_3.DSTendTCM = itmlst.options[itmlst.selectedIndex].text; break;
	        }
	    };

	    // FUNCTION: "ChgUTC_MRD" - set selected value of time zone "meridiem" configuration according to list selection made by the user
	    $scope.ChgUTC_MRD = function() {

	        var itmlst;

	        itmlst = document.activeElement;
	        switch (itmlst.id) {
	            case 'UTCBgnMrdOpt_0': $scope.clock_0.DSTbgnMRD = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndMrdOpt_0': $scope.clock_0.DSTendMRD = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnMrdOpt_1': $scope.clock_1.DSTbgnMRD = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndMrdOpt_1': $scope.clock_1.DSTendMRD = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnMrdOpt_2': $scope.clock_2.DSTbgnMRD = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndMrdOpt_2': $scope.clock_2.DSTendMRD = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCBgnMrdOpt_3': $scope.clock_3.DSTbgnMRD = itmlst.options[itmlst.selectedIndex].text; break;
	            case 'UTCEndMrdOpt_3': $scope.clock_3.DSTendMRD = itmlst.options[itmlst.selectedIndex].text; break;
	        }
	    };

	    // FUNCTION: "ChgCLK_CLR" - set selected value of clock "color" configuration according to list selection made by the user
	    $scope.ChgCLK_CLR = function() {

	        var itmlst;

	        itmlst = document.activeElement;
	        switch (itmlst.id) {
	            case 'ClockColorOpt_0': $scope.clock_0.color = $scope.CLOCK_COLOR[itmlst.selectedIndex].code; break;
	            case 'ClockColorOpt_1': $scope.clock_1.color = $scope.CLOCK_COLOR[itmlst.selectedIndex].code; break;
	            case 'ClockColorOpt_2': $scope.clock_2.color = $scope.CLOCK_COLOR[itmlst.selectedIndex].code; break;
	            case 'ClockColorOpt_3': $scope.clock_3.color = $scope.CLOCK_COLOR[itmlst.selectedIndex].code; break;
	        }
	    };

	} ];
