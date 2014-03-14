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

         $scope.settingScreenData = {
            templatePath: "linkList/settings.html",
                controller: angular.module('app.linkList').appLinkListSettings,
                id: $scope.boxId,
            };

            $scope.config = appLinklistConfig;

        $scope.returnConfig = function () {

                        var configCopy = angular.copy(appLinklistConfig);
                        for (var i = configCopy.linkList.length - 1; i >= 0; i--) {
                            delete configCopy.linkList[i].$$hashKey;
                            delete configCopy.linkList[i].editable;
                            delete configCopy.linkList[i].old;
                            delete configCopy.linkList[i].sapGuiFile;
                        };
                        return configCopy;
                    }; 

    }];
    return {
        restrict: 'E',
        templateUrl: 'app/linkList/overview.html',
        controller: directiveController,
        link: function ($scope, $element, $attrs, $modelCtrl) {
                var appConfig = angular.copy(bridgeConfig.getConfigForApp($scope.boxId));
                if (appConfig != undefined) {  

                    appLinklistConfig.linkList = appConfig.linkList;

                    for (var i = appLinklistConfig.linkList.length - 1; i >= 0; i--) 
                    {  
                        link = appLinklistConfig.linkList[i];
                        console.log(link);
                        if(link.type == "saplink") 
                        {
                            link.sapGuiFile = generateBlob(link.name,link.sid,'','');
                            console.log(link.sapGuiFile);
                        }         
                    };
                    console.log(appLinklistConfig.linkList);

                    }

                function generateBlob(name,sid,transaction,parameters)
                {
                     data =     "[System] \n"+
                                "Name="+sid+" \n"+
                                "[User] \n"+
                                "[Function] \n"+
                                "Command=SESSION_MANAGER \n";

                   var blob = new Blob([data]);
                    $scope.sapLinks = [];
                    var saplink = {};
                        saplink.objectURL = window.URL.createObjectURL(blob);                 
                        saplink.name = name;
                        saplink.download =  saplink.name+".sap";
                    return saplink; 
                };//generateBlob

            }
    };
}]);