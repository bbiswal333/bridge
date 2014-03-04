angular.module('bridge.app', [
    //external stuff
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'googlechart',
    'ui.bootstrap',
    'mgcrea.ngStrap',
    'ngTable',
    'ng-scrollbar',
    // bridge modules
    'bridge.employeeSearch',
    'bridge.box',
    // bridge apps
    'app.test',
    'app.atc',
    'app.im',
    'app.jira',
    'app.employeeSearch', 
    'app.meetings',
    'app.cats',
    'app.lunchWalldorf',
    'app.githubMilestone',
    'ui.sortable']);

angular.module('bridge.app').directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  }
});

angular.module('bridge.app').controller('bridgeController', ['$scope', '$modal', '$http', '$route', '$location', '$timeout', '$q', '$log', 'bridgeDataService', 'bridgeConfig',
    function ($scope, $modal, $http, $route, $location, $timeout, $q, $log, bridgeDataService, bridgeConfig) {
        $http.get('http://localhost:8000/client').success(function (data, status) {            
        }).error(function (data, status, header, config) {            
            //alert('light mode detected');
        });

        if ($location.path() == "" || $location.path() == "/")
            $scope.showLoadingAnimation = true;


        /*---- SORT START ----*/                                             
          $scope.sortableOptions = {
            //placeholder: "sortable-placeholder",
            //forceHelperSize: true,
            //forcePlaceholderSize: true,
            //helper: "clone",
            delay: 50,
            scroll: false,
            tolerance: "pointer",
            disabled: true,

            update: function(e, ui) {
               bridgeConfig.config.bridgeSettings = $scope.list;  
            },

            stop: function(e, ui) {
            }
          };

          $scope.toggleDragging = function(){
            if( !$scope.sortableOptions.disabled )
            {
              bridgeConfig.persistInBackend();  
            }
            $scope.sortableOptions.disabled = ! $scope.sortableOptions.disabled;
          }
          //ONLY FOR TESTING PURPOSE
          window.resetSort = function(){
            $scope.list = [                                        
            {content: "app.cats", id: 1, size:"box-2"},
            {content: "app.lunch-walldorf", id: 2, size:"box-1"},
            {content: "app.jira", id: 3, size:"box-2"},

            {content: "app.atc", id:4,  size:"box-2"},
            {content: "app.employee-search", id: 5, size:"box-2"},
            {content: "app.meetings", id: 6, size:"box-1"},

            {content: "app.github-milestone", id: 7, size:"box-2"},
            {content: "app.im", id: 8, size:"box-2"},
            {content: "app.test", id: 9, size:"box-1"}
                            ]; 
            bridgeConfig.config.bridgeSettings = $scope.list; 
            bridgeConfig.persistInBackend();
          }
          //ONLY FOR TESTING PURPOSE
          window.addApp = function(content, id, size){
            var newApp =  {content: content, id: id, size:size};
            $scope.list.push(newApp);
            bridgeConfig.config.bridgeSettings = $scope.list; 
            bridgeConfig.persistInBackend();
          }

        /*---- SORT END----*/

          $scope.settings_click = function (boxId) {
            var templateString;
            var templateController;
            var boxController;
            var boxScope;

            for (var boxProperty in bridgeDataService.boxInstances) {
                if (bridgeDataService.boxInstances[boxProperty].scope.boxId == boxId) {
                    templateString = bridgeDataService.boxInstances[boxProperty].scope.settingScreenData.templatePath;
                    templateController = bridgeDataService.boxInstances[boxProperty].scope.settingScreenData.controller;
                    boxController = bridgeDataService.boxInstances[boxProperty];
                    boxScope = bridgeDataService.boxInstances[boxProperty].scope;
                }
            }

            window.modalInstance = $modal.open({
                templateUrl: 'view/settings.html',
                controller: angular.module('bridge.app').settingsController,
                resolve: {
                    templateString: function () {
                        return templateString;
                    },
                    templateController: function () {
                        return templateController;
                    },
                    boxController: function () {
                        return boxController;
                    },
                    boxScope: function () {
                        return boxScope;
                    },
                }
            });

            // save the config in the backend no matter if the result was ok or cancel -> we have no cancel button at the moment, but clicking on the faded screen = cancel
            modalInstance.result.then(function (selectedItem) {
                bridgeConfig.persistInBackend(bridgeDataService.boxInstances);
            }, function () {
                bridgeConfig.persistInBackend(bridgeDataService.boxInstances);
            });
        };

        $scope.overview_click = function () {
            $location.path('/');
            document.getElementById('overview-button').classList.add('selected');
            document.getElementById('projects-button').classList.remove('selected');
        };

        $scope.projects_click = function () {
            $location.path('/projects');
            document.getElementById('overview-button').classList.remove('selected');
            document.getElementById('projects-button').classList.add('selected');
        };

       /* Load the config for App order */
        $scope.$on('bridgeConfigLoadedReceived', function (event, args) {
                if (bridgeConfig.config.bridgeSettings != {})
                { 
                    $scope.list = bridgeConfig.config.bridgeSettings; 
                }
                else 
                {
                    $scope.list = [                                        
                    {content: "app.cats", id: 1, size:"box-2"},
                    {content: "app.lunch-walldorf", id: 2, size:"box-1"},
                    {content: "app.jira", id: 3, size:"box-2"},

                    {content: "app.atc", id:4,  size:"box-2"},
                    {content: "app.employee-search", id: 5, size:"box-2"},
                    {content: "app.meetings", id: 6, size:"box-1"},

                    {content: "app.github-milestone", id: 7, size:"box-2"},
                    {content: "app.im", id: 8, size:"box-2"},
                    {content: "app.test", id: 9, size:"box-1"}
                                    ]; 
                }


                    $scope.configLoadingFinished = true;
                    $scope.showLoadingAnimation = false;   
                });
        }]);


angular.module('bridge.app').config(function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        templateUrl: 'view/overview.html',
    });
    $routeProvider.when("/projects", { templateUrl: 'view/projects.html' });

    $routeProvider.when("/detail/im/", { templateUrl: 'app/im/detail.html', controller: 'app.im.detailController' });
    //$routeProvider.when("/settings", { templateUrl: 'view/settings.html', controller: 'bridgeSettingsController' });
    $routeProvider.when("/detail/atc/", { templateUrl: 'app/atc/detail.html', controller: 'app.atc.detailcontroller' });
    $routeProvider.when("/detail/jira/", { templateUrl: 'app/jira/detail.html', controller: 'app.jira.detailController' });



});

angular.module('bridge.app').run(function ($rootScope, $q, $templateCache, bridgeConfig) {
    var loadingRequests = 0;

    //Receive emitted message and broadcast it.
    //Event names must be distinct or browser will blow up!
    $rootScope.$on('bridgeConfigLoaded', function (event, args) {
        $rootScope.$broadcast('bridgeConfigLoadedReceived', args);
    });
    $rootScope.$on('changeLoadingStatusRequested', function (event, args) {
        var oldLoadingRequests = loadingRequests;

        args.showLoadingBar ? loadingRequests++ : loadingRequests--;
        if (loadingRequests > 0 && oldLoadingRequests == 0)
            $rootScope.showLoadingBar = true;
        else if (loadingRequests == 0 && oldLoadingRequests > 0)
            $rootScope.showLoadingBar = false;
    });

    var deferred = $q.defer();
    var promise = bridgeConfig.loadFromBackend(deferred);

    promise.then(function (config) {
        // if the config is not an object, then the user has no configuration stored in the backend
        if (angular.isObject(config))
            bridgeConfig.config = config;
        $rootScope.$emit('bridgeConfigLoaded', {});
    }, function () { // promise rejected = config load failed
        alert("Bridge could not load your configuration from system IFP. Make sure that you are connected to the network and refresh the page.");
    });
});


angular.module('bridge.app').filter("decodeIcon", function () {
    return function (str) {
        if (str == undefined)
            return "";
        var el = document.createElement("div");
        el.innerHTML = str;
        str = el.innerText || el.textContent;
        return str;
    }
});