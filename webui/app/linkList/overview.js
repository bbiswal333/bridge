angular.module('app.linklist', ['ui.sortable']);

angular.module('app.linklist').directive('app.linklist', ['app.linklist.configservice', function(appLinklistConfig) {

    var directiveController = ['$scope', '$timeout', function ($scope, $timeout) {        
        $scope.box.settingScreenData = {
            templatePath: "linkList/settings.html",
            controller: angular.module('app.linklist').appLinkListSettings,
        };        
        $scope.config = appLinklistConfig;

        $scope.box.returnConfig = function () {

            var configCopy = angular.copy(appLinklistConfig.data);
            configCopy.boxSize = $scope.box.boxSize;
            
            if(configCopy.listCollection.length >= 1) {
                for (var i = configCopy.listCollection.length - 1; i >= 0; i--) {  
                    linkList = configCopy.listCollection[i];
                            
                    for (var j = linkList.length - 1; j >= 0; j--){
                        delete linkList[j].$$hashKey;
                        delete linkList[j].editable;
                        delete linkList[j].old;
                        delete linkList[j].sapGuiFile;
                    };
                };

                return configCopy;
            }; 
        };
    }];

    return {
        restrict: 'E',
        templateUrl: function(){return 'app/linkList/overview.html'},
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
            if ($scope.appConfig != undefined && $scope.appConfig != {} && $scope.appConfig.hasOwnProperty('version') && $scope.appConfig.version == 1) {
                if ($scope.appConfig.boxSize) {
                    $scope.box.boxSize = $scope.appConfig.boxSize;
                }
            }
            else {
                setDefaultConfig();
            }

            appLinklistConfig.data.listCollection = $scope.appConfig.listCollection;
            for (var i = appLinklistConfig.data.listCollection.length - 1; i >= 0; i--) {
                linkList = appLinklistConfig.data.listCollection[i];

                for (var j = linkList.length - 1; j >= 0; j--) {
                    link = linkList[j];
                    if (link.type == "saplink") {
                        link.sapGuiFile = appLinklistConfig.generateBlob(link.name, link.sid, link.transaction, link.parameters);
                    } else if (link.type == "hyperlink" && (link.url.indexOf("http") == -1)) {
                        link.url = "http://" + link.url;
                    };
                };
            };

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
                $scope.appConfig = appLinklistConfig;
            };
       
        }

    };
}]);