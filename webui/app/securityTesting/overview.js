/*eslint-disable eqeqeq*/
angular.module('app.securityTesting', ["app.securityTesting.data"]);
angular.module('app.securityTesting')
    .directive('app.securityTesting', ['app.securityTesting.configservice','app.securityTesting.dataService', '$window', function (appSecurityTestingConfig,dataService, $window) {

        var directiveController = ['$scope',  function ($scope)
        {
            var config = appSecurityTestingConfig.getConfigInstanceForAppId($scope.metadata.guid);

            //Settings Screen
            $scope.box.settingsTitle = "Configure Security Testing Results";
            $scope.box.settingScreenData = {
                templatePath: "securityTesting/settings.html",
                controller: angular.module('app.securityTesting').appSecurityTestingSettings,
                id: $scope.boxId
            };
            $scope.box.boxSize = "2";

            $scope.box.returnConfig = function () {
                return config;
            };

            $scope.handleSecurityTestingResults = function () {
                $scope.config = config;

                dataService.getAuthorised(config).then(function () {
                    //sure, you can override this in your browser, but you still can't get results
                    // :-)
                    config.auth = dataService.data.auth;

                    dataService.loadData(config).then(function () {
                        $scope.fortify_closed_issues = 0;
                        $scope.coverity_closed_issues = 0;
                        $scope.fortify_open_issues = 0;
                        $scope.coverity_open_issues = 0;
                        $scope.abap_open_issues = 0;
                        $scope.abap_closed_issues = 0;
                        $scope.fortifyIssueProgress = 100;
                        $scope.coverityIssueProgress = 100;
                        $scope.abapIssueProgress = 100;
                        $scope.fortifyText = "All findings are audited";
                        $scope.coverityText = "All findings are audited";
                        $scope.abapText = "All findings are audited";
                        $scope.fortifyIssueColour = "#4FB81C";
                        $scope.coverityIssueColour = "#4FB81C";
                        $scope.abapIssueColour = "#4FB81C";

                        function abbreviateNumber(value) {
                            var newValue = value;
                            if (value >= 1000) {
                                var suffixes = ["", "k", "m", "b", "t"];
                                var suffixNum = Math.floor(("" + value).length / 3);
                                var shortValue = '';
                                for (var precision = 2; precision >= 1; precision--) {
                                    shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
                                    var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
                                    if (dotLessShortValue.length <= 2) { break; }
                                }
                                // shortNum is never used later on
                                //if (shortValue % 1 != 0){ shortNum = shortValue.toFixed(1); }
                                newValue = shortValue + suffixes[suffixNum];
                            }
                            return newValue;
                        }
                        $.each(dataService.data.securityTestingData, function (index, element) {

                            if (element.objecttype == 'codescan.fort') {
                                $scope.fortify_open_issues = abbreviateNumber(parseFloat(element.opencount));
                                $scope.fortify_closed_issues = abbreviateNumber(parseFloat(element.closedcount));
                                $scope.fortifyIssueProgress = Math.floor(parseFloat(element.opencount) / (parseFloat(element.opencount) + parseFloat(element.closedcount)) * 100);
                                if ($scope.fortifyIssueProgress == 0) {
                                    $scope.fortifyIssueProgress = 100;
                                    $scope.fortifyIssueColour = "#4FB81C";
                                    $scope.fortifyText = "All findings are audited";
                                }
                                else {
                                    $scope.fortifyIssueColour = "#0076CB";
                                    $scope.fortifyText = "";
                                }

                            }
                            if (element.objecttype == 'codescan.cove') {
                                $scope.coverity_open_issues = abbreviateNumber(parseFloat(element.opencount));
                                $scope.coverity_closed_issues = abbreviateNumber(parseFloat(element.closedcount));

                                $scope.coverityIssueProgress = Math.floor(parseFloat(element.opencount) / (parseFloat(element.opencount) + parseFloat(element.closedcount)) * 100);
                                if ($scope.coverityIssueProgress == 0) {
                                    $scope.coverityIssueProgress = 100;
                                    $scope.coverityIssueColour = "#4FB81C";
                                    $scope.coverityText = "All findings are triaged";
                                }
                                else {
                                    $scope.coverityIssueColour = "#0076CB";
                                    $scope.coverityText = "";
                                }
                            }

                            if (element.objecttype == 'codescan.abap') {
                                $scope.abap_open_issues = abbreviateNumber(parseFloat(element.opencount));
                                $scope.abap_closed_issues = abbreviateNumber(parseFloat(element.closedcount));
                                $scope.abapIssueProgress = Math.floor(parseFloat(element.opencount) / (parseFloat(element.opencount) + parseFloat(element.closedcount)) * 100);
                                if ($scope.abapIssueProgress == 0) {
                                    $scope.abapIssueProgress = 100;
                                    $scope.abapIssueColour = "#4FB81C";
                                    $scope.abapText = "All findings are audited";
                                }
                                else {
                                    $scope.abapIssueColour = "#0076CB";
                                    $scope.abapText = "";
                                }

                            }

                        });
                    });
                });
            };

            //Watch for changes in the config
            $scope.$watch('config', function () {
                $scope.handleSecurityTestingResults();
            }, true);
            $scope.box.reloadApp($scope.handleSecurityTestingResults, 60 * 5);

            $scope.launch = function (){
                $window.open('blah.html');
                $window.alert('ff');
            };
        }];

        return {
            restrict: 'E',
            templateUrl: 'app/securityTesting/overview.html',
            controller: directiveController,
            link: function ($scope) {

                if ($scope.appConfig !== undefined && JSON.stringify($scope.appConfig) !== "{}") {
                    var config = appSecurityTestingConfig.getConfigInstanceForAppId($scope.metadata.guid);
                    config.filters = $scope.appConfig.filters;
                }
            }
        };


    }]);
/*eslint-enable eqeqeq*/
