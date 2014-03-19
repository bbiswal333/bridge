angular.module('app.linkList', ['ui.sortable']);

  angular.module('app.linkList').config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob):/);  //make blob safe
}]);

angular.module('app.linkList').directive('app.linkList',
        ['app.linkList.configservice','bridgeConfig',
        function(appLinklistConfig, bridgeConfig) {

    var directiveController = ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.boxTitle = "Linklist";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;'; 
        $scope.customCSSFile = "app/linkList/style.css";
        console.log($scope);
        $scope.settingScreenData = {
            templatePath: "linkList/settings.html",
            controller: angular.module('app.linkList').appLinkListSettings,
        };

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


                if (appConfig != undefined && 'version' in appConfig) 
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
                                    link.sapGuiFile = appLinklistConfig.generateBlob(link.name,link.sid,link.transaction,'');
                                }         
                            };   
                        };
                    }
                    else
                    {
                       appLinklistConfig.listCollection.push([]);
                        appConfig =  appLinklistConfig; 
                    }
                }  
                else if (!('version' in appConfig))  
                {
                    console.log("wrong linkList config version");
                    appLinklistConfig.listCollection.push([]);
                    appConfig =  appLinklistConfig;
                } 

                else
                {
                    console.log("no linkList Config");
                    appLinklistConfig.listCollection.push([]);
                }        
            }
    };
}]);