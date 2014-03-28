angular.module('app.linkList', ['ui.sortable']);

angular.module('app.linkList').directive('app.linkList',
        ['app.linkList.configservice','bridgeConfig',
        function(appLinklistConfig, bridgeConfig) {

    var directiveController = ['$scope', '$timeout', 'bridgeCounter', function ($scope, $timeout, bridgeCounter) {
        $scope.boxTitle = "Linklist";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe803;'; 
        $scope.customCSSFile = "app/linkList/style.css";
        $scope.settingScreenData = {
            templatePath: "linkList/settings.html",
            controller: angular.module('app.linkList').appLinkListSettings,
        };
        bridgeCounter.CollectWebStats('LINKLIST', 'APPLOAD');

            $scope.config = appLinklistConfig;

    $scope.returnConfig = function () {

        var configCopy = angular.copy(appLinklistConfig);
            
            if(configCopy.listCollection.length >= 1)
            {
                for (var i = configCopy.listCollection.length - 1; i >= 0; i--) 
                {  
                    linkList = configCopy.listCollection[i];
                            
                        for (var j = linkList.length - 1; j >= 0; j--)
                        {
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
                var appConfig = angular.copy(bridgeConfig.getConfigForApp($scope.boxId));

            if(appConfig != undefined && appConfig != {})
            {
                if ('version' in appConfig) 
                { 
                    if(appConfig.version == 1)
                    {
                        appLinklistConfig.listCollection = appConfig.listCollection;
                        for (var i = appLinklistConfig.listCollection.length - 1; i >= 0; i--) 
                        {
                            linkList = appLinklistConfig.listCollection[i];
                        
                            for (var j = linkList.length - 1; j >= 0; j--) 
                            {  
                                link = linkList[j];
                                if(link.type == "saplink") 
                                {
                                    link.sapGuiFile = appLinklistConfig.generateBlob(link.name,link.sid,link.transaction,link.parameters);
                                }         
                            };   
                        };
                    }
                    else
                    {
                        setDefaultConfig()
                    }
                }
                else
                {
                    setDefaultConfig()
                }
            }
            else
            {
                setDefaultConfig()
            }

            function setDefaultConfig()
            {
                appLinklistConfig.listCollection.push([]);
                appLinklistConfig.listCollection[0].push({"name":"Corporate Portal","url":"https://portal.wdf.sap.corp/irj/portal","type":"hyperlink"});
                appLinklistConfig.listCollection[0].push({"name":"Online Payslip","url":"https://ipp.wdf.sap.corp/sap/bc/webdynpro/sap/hress_a_payslip?sap-language=EN&sap-wd-configId=HRESS_AC_PAYSLIP","type":"hyperlink"});                
                appLinklistConfig.listCollection[0].push({"name":"Bridge Github Repo","url":"https://github.wdf.sap.corp/bridge/bridge","type":"hyperlink"});                
                appConfig =  appLinklistConfig;
            };
       
        }

    };
}]);