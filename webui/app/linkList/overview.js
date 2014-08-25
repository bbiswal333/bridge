angular.module('app.linklist', ['ui.sortable']);

angular.module('app.linklist').directive('app.linklist', ['app.linklist.configservice', function(appLinklistConfig) {

    var directiveController = ['$scope', '$timeout', function ($scope) {
         
        $scope.box.settingScreenData = {
            templatePath: "linkList/settings.html",
            controller: angular.module('app.linklist').appLinkListSettings
        };
        $scope.config = appLinklistConfig;

        $scope.box.returnConfig = function () {

            var configCopy = angular.copy(appLinklistConfig.data);

            if(configCopy.listCollection && configCopy.listCollection.length >= 1) {
                for (var i = configCopy.listCollection.length - 1; i >= 0; i--) {  
                    var linkList = configCopy.listCollection[i];

                    for (var j = linkList.length - 1; j >= 0; j--){
                        delete linkList[j].$$hashKey;
                        delete linkList[j].editable;
                        delete linkList[j].old;
                        delete linkList[j].sapGuiFile;
                    }
                }
                return configCopy;
            }
        };
    }];

    return {
        restrict: 'E',
        templateUrl: function() { return 'app/linkList/overview.html';},
        controller: directiveController,
        link: function ($scope) {

            function setDefaultConfig()
            {
                appLinklistConfig.data.listCollection.push([]);
                appLinklistConfig.data.listCollection[0].push({ "name": "Corporate Portal", "url": "https://portal.wdf.sap.corp/irj/portal", "type": "hyperlink" });
                appLinklistConfig.data.listCollection[0].push({ "name": "Online Payslip", "url": "https://ipp.wdf.sap.corp/sap/bc/webdynpro/sap/hress_a_payslip?sap-language=EN&sap-wd-configId=HRESS_AC_PAYSLIP", "type": "hyperlink" });
                appLinklistConfig.data.listCollection[0].push({ "name": "Leave Request", "url": "https://ipp.wdf.sap.corp/sap/bc/gui/sap/its/zleaveoverview", "type": "hyperlink" });
                appLinklistConfig.data.listCollection[0].push({ "name": "Bridge Github Repo", "url": "https://github.wdf.sap.corp/bridge/bridge", "type": "hyperlink" });
                appLinklistConfig.data.listCollection[0].push({ "name": "Lunch Menu NSQ", "url": "http://eurestdining.compass-usa.com/sapamerica/Pages/Home.aspx", "type": "hyperlink" });
                appLinklistConfig.data.listCollection[0].push({ "name": "Lunch Menu Berlin", "url": "https://portal.wdf.sap.corp/irj/go/km/docs/corporate_portal/Administration%20for%20SAP/Catering/Menu%20%26%20Catering/Menu%20Gesch%c3%a4ftsstellen%20(TeaserBox)/Speiseplan%20Berlin", "type": "hyperlink" });
                appLinklistConfig.data.listCollection[0].push({ "name": "ISP System", "sid": "ISP", "transaction": "", "parameters": "", "type": "saplink" });
                appLinklistConfig.data.boxSize = 1;
                $scope.appConfig = appLinklistConfig.data;
            }

            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.hasOwnProperty('version') && $scope.appConfig.version === 1) {
                if($scope.appConfig.listCollection.length > 1) {
                    $scope.box.boxSize = 2;
                } else {
                    $scope.box.boxSize = 1;
                }
            }
            else {
                setDefaultConfig();
            }

            function eventuallyRemoveDuplicates(listCollection) {
                for (var a = listCollection.length - 1; a >= 0; a--) {
                    var linkListForDuplicateSearch = listCollection[a];
                    for (var b = linkListForDuplicateSearch.length - 1; b >= 0; b--) {
                        var link1 = linkListForDuplicateSearch[b];
                        for (var c = linkListForDuplicateSearch.length - 1; c >= 0; c--) {
                            var link2 = linkListForDuplicateSearch[c];
                            if (b !== c &&
                                link1.type        === link2.type &&
                                link1.name        === link2.name &&
                                link1.url         === link2.url &&
                                link1.sid         === link2.sid &&
                                link1.transaction === link2.transaction) {
                                linkListForDuplicateSearch.splice(b, 1);
                            }
                        }
                    }
                }
                return listCollection;
            }

            if($scope.appConfig) {

                $scope.appConfig.listCollection = eventuallyRemoveDuplicates($scope.appConfig.listCollection);
                appLinklistConfig.data.listCollection = $scope.appConfig.listCollection;

                for (var i = appLinklistConfig.data.listCollection.length - 1; i >= 0; i--) {
                    var linkList = appLinklistConfig.data.listCollection[i];
                    for (var j = linkList.length - 1; j >= 0; j--) {
                        var link = linkList[j];
                        if (link.type === "saplink") {
                            link.sapGuiFile = appLinklistConfig.generateBlob(link.name, link.sid, link.transaction, link.parameters);
                        } else if (link.type === "hyperlink" && (link.url.indexOf("http") === -1)) {
                            link.url = "http://" + link.url;
                        }
                    }
                }
            }

            $scope.openBlob = function(sapGuiFile){
                saveAs(sapGuiFile.blob, "systemlink.sap");
            };

            $scope.$watch("appConfig.listCollection", function () {
                if($scope.appConfig.listCollection.length > 1) {
                    $scope.box.boxSize = 2;
                } else {
                    $scope.box.boxSize = 1;
                }
            }, true);
        }
    };
}]);