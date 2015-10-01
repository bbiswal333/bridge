angular.module('app.linklist', ["ui.sortable"]);

angular.module('app.linklist').directive('scrollBottom', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attr){
            $(element).on("click", function(){
/*eslint-disable no-undef*/
                var $id = angular.element(document.querySelector('#' + attr.scrollBottom));
/*eslint-enable no-undef*/
                $id.scrollTop($id[0].scrollHeight + 50);
            });
        }
    };
});

angular.module('app.linklist').directive('droppable', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var dnD = {
                handleDragLeave : function(){
                    element.removeClass("app-linklist-dragEnter");
                },
                handleDragEnter : function(e) {
                    if (e.preventDefault){
                        e.preventDefault();
                    }
                    element.addClass("app-linklist-dragEnter");
                },
                handleDrop : function(e){
                    scope.handleDrop(e, attrs.droppable);
                    scope.$apply();
                }
            };

            element.bind("dragover", dnD.handleDragEnter);
            element.bind("dragleave", dnD.handleDragLeave);
            element[0].addEventListener('drop', dnD.handleDrop, false);

        }
    };
});

angular.module('app.linklist').directive('app.linklist', ['app.linklist.configservice', '$window', function(appLinklistConfig, $window) {

    var directiveController = ['$scope', '$timeout', function ($scope) {

        $scope.box.settingScreenData = {
            templatePath: "linkList/settings.html",
            controller: angular.module('app.linklist').appLinkListSettings
        };
        var linklistConfig = appLinklistConfig.getInstanceForAppId($scope.metadata.guid);
        $scope.config = linklistConfig;

        $scope.box.returnConfig = function () {

            var configCopy = angular.copy(linklistConfig.data);
            delete configCopy.boxSize;

            if(configCopy.listCollection && configCopy.listCollection.length >= 1) {
                for (var i = configCopy.listCollection.length - 1; i >= 0; i--) {
                    var linkList = configCopy.listCollection[i];

                    for (var j = linkList.length - 1; j >= 0; j--){
                        delete linkList[j].$$hashKey;
                        delete linkList[j].editable;
                        delete linkList[j].old;
                        delete linkList[j].sapGuiFile;
                        if (!linkList[j].name){
                            linkList.splice(j, 1);
                        }
                    }
                }
            }

            return configCopy;
        };

        function setDefaultConfig()
        {
            linklistConfig.data.listCollection.length = 0;
            linklistConfig.data.listCollection.push([]);
            linklistConfig.data.listCollection.push([]);
            linklistConfig.data.listCollection.push([]);
            linklistConfig.data.listCollection[0].push({ "name": "Corporate Portal", "url": "https://portal.wdf.sap.corp/irj/portal", "type": "hyperlink" });
            linklistConfig.data.listCollection[0].push({ "name": "Most Popular Links", "url": "https://portal.wdf.sap.corp/go/most-popular-links", "type": "hyperlink"});
            linklistConfig.data.listCollection[0].push({ "name": "Online Payslip", "url": "https://ipp.wdf.sap.corp/sap/bc/webdynpro/sap/hress_a_payslip?sap-language=EN&sap-wd-configId=HRESS_AC_PAYSLIP", "type": "hyperlink" });
            linklistConfig.data.listCollection[0].push({ "name": "Leave Request", "url": "https://ipp.wdf.sap.corp/sap/bc/webdynpro/sap/hress_a_ptarq_leavreq_appl?sap-language=EN&sap-wd-configId=ZHRESS_AC_PTARQ_LEAVREQ#", "type": "hyperlink" });
            linklistConfig.data.listCollection[0].push({ "name": "Lunch Menu NSQ", "url": "http://eurestdining.compass-usa.com/sapamerica/Pages/Home.aspx", "type": "hyperlink" });
            linklistConfig.data.listCollection[0].push({ "name": "Lunch Menu Berlin", "url": "https://portal.wdf.sap.corp/irj/go/km/docs/corporate_portal/Administration%20for%20SAP/Catering/Menu%20%26%20Catering/Menu%20Gesch%c3%a4ftsstellen%20(TeaserBox)/Speiseplan%20Berlin", "type": "hyperlink" });
            linklistConfig.data.listCollection[0].push({ "name": "ISP System", "sid": "ISP", "transaction": "", "parameters": "", "type": "saplink" });
            linklistConfig.data.noNewWindow = false;
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

        if (linklistConfig.isInitialized === false) {
            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.hasOwnProperty('version') && $scope.appConfig.version === 1) {
                linklistConfig.data = angular.copy($scope.appConfig);
                linklistConfig.data.listCollection = eventuallyRemoveDuplicates(linklistConfig.data.listCollection);
            }
            else {
                setDefaultConfig();
            }

            for (; linklistConfig.data.listCollection.length < 3; ) {
                linklistConfig.data.listCollection.push([]);
            }

            linklistConfig.isInitialized = true;
        }

        $scope.containsValidEntries = function(list){
            if (list.length > 0) {
                var validEntrieExists = false;
                list.some(function(entry){
                    if (entry.name) {
                        validEntrieExists = true;
                        return true;
                    }
                });
                return validEntrieExists;
            }
            return false;
        };

        $scope.numberOfValidLists = function(){
            var number = 0;
            linklistConfig.data.listCollection.forEach(function(list){
                if ($scope.containsValidEntries(list)) {
                    number++;
                }
            });
            return number;
        };

        $scope.openBlob = function(link){
            $window.open("https://ifp.wdf.sap.corp/sap/bc/bsp/sap/ZBRIDGE_BSP/saplink.sap?sid=" + link.sid +
                "&client=&transaction=" + (link.transaction === undefined ? "" : link.transaction) +
                "&parameters=" + (link.parameters === undefined ? "" : link.transaction));
        };

        $scope.$watch("config.data", function () {
            if($scope.numberOfValidLists() > 1) {
                $scope.box.boxSize = 2;
            } else {
                $scope.box.boxSize = 1;
            }
        }, true);
    }];

    return {
        restrict: 'E',
        templateUrl: function() { return 'app/linkList/overview.html'; },
        controller: directiveController
    };
}]);
