angular.module('app.linkList', ['ui.sortable']);

angular.module('app.linkList').directive('app.linkList',
        ['app.linkList.configservice',
        function(appLinklistConfig) {

    var directiveController = ['$scope', '$timeout', 'bridgeCounter', function ($scope, $timeout, bridgeCounter) {
        $scope.boxTitle = "Linklist";
        $scope.boxIcon = '&#x1f4cc;'; 
        $scope.boxIconClass = 'icon-bookmark-empty';
        $scope.customCSSFile = "app/linkList/style.css";
        $scope.settingScreenData = {
            templatePath: "linkList/settings.html",
            controller: angular.module('app.linkList').appLinkListSettings,
        };
        bridgeCounter.CollectWebStats('LINKLIST', 'APPLOAD');

            $scope.config = appLinklistConfig;

    $scope.returnConfig = function () {

        var configCopy = angular.copy(appLinklistConfig);
        configCopy.boxSize = $scope.boxSize;
            
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
            if ($scope.appConfig != undefined && $scope.appConfig != {})
            {
                if ($scope.appConfig.boxSize)
                    $scope.boxSize = $scope.appConfig.boxSize;

                if ('version' in $scope.appConfig)
                { 
                    if ($scope.appConfig.version == 1)
                    {
                        appLinklistConfig.listCollection = $scope.appConfig.listCollection;
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
                $scope.appConfig = appLinklistConfig;
            };
       
        }

    };
}]);