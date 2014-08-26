var app = angular.module("app.sirius", ["app.sirius.siriusDirectives"])
    .filter('oldProgramSign', [function () {
    return function (isOldProgram) {
        return (isOldProgram === 'X') ? "(from Program Repository)" : "";
    };
}]);
app.directive("app.sirius",["app.sirius.configservice",'$filter',function (siriusConfigService,$filter) {

    var directiveController = ['$scope','$http',function ($scope,$http)
    {

        var _init = function () {
            $scope.showGrid = false;
            $scope.program = new siriusUtils.SiriusObject();
            $scope.programLeads=[];
            $scope.programLeadsString="";
        };

        $scope.box.settingsTitle = "Configure Program and Delivery Detail";
        $scope.box.settingScreenData = {
            templatePath: "sirius/settings.html",
            controller: angular.module('app.sirius').appSiriusSettings,
            id: $scope.boxId
        };
        $scope.configService = siriusConfigService;

        $scope.box.returnConfig = function(){
            return angular.copy($scope.configService);
        };

        // Search as-you-type on type ahead
        $scope.startSearchAsYouType = function () {
            var searchString=$scope.searchString;
            return $http.get(siriusUtils.adjustURLForRunningEnvironment()+'/program?maxHits=50&query='+searchString+'&sap-language=en').then(function (response)  {
                var programs=[];
                programs=response.data.data;
                programs.sort(_sortProgs);
                programs.forEach(function(program) {
                    program.DISPLAY_TEXT += ' ' + $filter('oldProgramSign')(program.IS_OLD_PROGRAM);
                });

                return programs;
            });
        };

        //if searchString is empty, set back the program details
        $scope.$watch('searchString', function (value) {
            if (value === '') {
                $scope.showGrid = false;
                $scope.programLeads=[];
                $scope.programLeadsString="Program Leads: ";
            }
        });

       //get data for program details
        $scope.onSelect = function ($item) {
            _viewSettings($item)
            _loadProgramLeadData($item);
            _loadProgramDetailsData($item);
        };

        $scope.getTrafficLightStatusCssClass = function(className) {
            if (className === 'trafficLightStatusGreen')
                return 'fa fa-chevron-circle-up';
            else if (className === 'trafficLightStatusRed')
                return 'fa fa-chevron-circle-down';
            else if (className === 'trafficLightStatusYellow')
                return 'fa fa-chevron-circle-right';
            return "noCssClassFound";
        };

        // differentiate between old and new program.
        // If old program true,then show link
        // else show program lead and program details
        var _viewSettings=function($item){
            if($item.IS_OLD_PROGRAM){
                window.open(siriusUtils.OLD_PR_URL()+$item.GUID, '_blank');
                $scope.showGrid=false;
            }
            else{
                $scope.showGrid=true;
            }
        };
        // get data of program lead
        var _loadProgramLeadData=function($item) {

            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + $item.GUID + '/role?sap-language=en&roleType=PROGRAM_LEAD').then(function (response) {
               var programLeads = [];
                $scope.programLeads=[];
               programLeads = response.data.data;

               programLeads.forEach(function (programLead) {
                       _getUser4UI(programLead.LOAD_STATE.USER_ID);
                   });


            });
        };

        var _getUser4UI=function(userID){
            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/user/' + userID + '?sap-language=en').then(function (response) {
                $scope.programLeads.push(response.data.data);
                return response.data.data;
            }).then(function () {
                $scope.programLeadsString=$scope.programLeads[0].DISPLAY_TEXT;
                for(var i=1; i<$scope.programLeads.length;i++){
                    $scope.programLeadsString=$scope.programLeadsString+";"+$scope.programLeads[i].DISPLAY_TEXT;
                };
                $scope.programLeadsString="Program Lead:"+$scope.programLeadsString;
            });
        };

        // get data of program lead
        var _loadProgramDetailsData=function($item){

            if(!$item.IS_OLD_PROGRAM) {
                return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + $item.GUID + '?sap-language=en').then(function (response) {
                    $scope.program.WORKING_STATE = response.data.data.WORKING_STATE;
                    var a = $scope.program.WORKING_STATE.KEY_MESSAGE;

                }).then(function () {
                    switch ($scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS) {
                        case "":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "Not Applicate";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusGrey'
                            break;
                        case "E":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusEmpty'
                            break;
                        case "G":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "on Track";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusGreen'
                            break;
                        case "Y":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "Critical";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusYellow'
                            break;
                        case "R":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "Very Critical";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusRed'
                            break;
                        default :
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusEmpty'
                            break;
                    }
                })
            }
        };

        // get data of program lead
        var _openProgramRepository = function ($item) {
            window.open(siriusUtils.OLD_PR_URL()+$item.GUID, '_blank');
        };

        var _sortProgs = function(a,b){
            if (a.DISPLAY_TEXT.toLowerCase() < b.DISPLAY_TEXT.toLowerCase()) {return -1;}
            if (a.DISPLAY_TEXT.toLowerCase() > b.DISPLAY_TEXT.toLowerCase()) {return 1;}
            return 0;
        };

        _init();
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/sirius/overview.html',
        controller: directiveController,
        link: function ($scope)
        {
            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem)
            {
               siriusConfigService.configItem = $scope.appConfig.configItem;

            } else {
                $scope.appConfig.configItem = siriusConfigService.configItem;
            }

            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.tasks)
            {
                siriusConfigService.tasks = $scope.appConfig.tasks;

            } else {
                $scope.appConfig.tasks = siriusConfigService.tasks;
            }

            $scope.box.boxSize = siriusConfigService.configItem.boxSize;
        }
    };
}]);
