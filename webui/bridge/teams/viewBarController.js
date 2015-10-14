angular.module("bridge.teams").controller("bridge.viewBar.Controller", ["$scope", "$rootScope", "$modal", "bridgeDataService", "$http", "$q", "bridgeInstance", "$window", "$log", "bridgeInBrowserNotification", "$timeout", "$location", "$route",
	function($scope, $rootScope, $modal, bridgeDataService, $http, $q, bridgeInstance, $window, $log, bridgeInBrowserNotification, $timeout, $location, $route) {
    $scope.views = bridgeDataService.getProjects();

    function setScrollInformation() {
        $timeout(function() {
            if($('.projectTabContainer').length > 0) {
                $rootScope.projectTabContainerWidth = $('.projectTabContainer').width() + $('.viewScroller').width();
                $rootScope.projectTabContainerScrollWidth = $('.projectTabContainer')[0].scrollWidth;
            }
        }, 500);
    }

    $scope.scrollLeft = function() {
        $scope.projectTabContainerWidth = $('.projectTabContainer')[0].scrollLeft += -50;
    };

    $scope.scrollRight = function() {
        $scope.projectTabContainerWidth = $('.projectTabContainer')[0].scrollLeft += 50;
    };

    $scope.openNewViewModal = function() {
        $modal.open({
            templateUrl: 'bridge/teams/newView.html',
            size: 'sm',
            windowClass: 'teamview-dialog'
        });
    };

    $scope.$watch('views.length', function() {
        setScrollInformation();
    });

    $scope.deleteView = function(viewId) {
    	var deferred = $q.defer();
    	var found = false;
    	bridgeDataService.getProjects().map(function(view) {
    		if(view.owner === bridgeDataService.getUserInfo().BNAME && view.view === viewId) {
    			found = true;
    			$http.get('https://ifd.wdf.sap.corp/sap/bc/bridge/DELETE_VIEW?view=' + viewId + '&instance=' + bridgeInstance.getCurrentInstance() + '&origin=' + encodeURIComponent($window.location.origin)).success(function (data) {
                    $log.log("view deleted successfully");
                    bridgeDataService.getProjects().splice(bridgeDataService.getProjects().indexOf(view), 1);
                    setScrollInformation();
                    deferred.resolve(data);
                }).error(function (data) {
                    $log.log("Error deleting the view!");
                    deferred.reject(data);
                });
    		} else if(view.view === viewId) {
    			found = true;
    			bridgeDataService.getProjects().splice(bridgeDataService.getProjects().indexOf(view), 1);
                setScrollInformation();
    			deferred.resolve();
    		}
    	});
    	if(found === false) {
    		$timeout(function() {
    			deferred.reject();
    			bridgeInBrowserNotification.addAlert("danger", "View not found", 600);
    		}, 100);
    	}
    	return deferred.promise;
    };

    function loadView(owner, id) {
        if(bridgeDataService.hasProject(owner, id)) {
            bridgeDataService.setSelectedProject(bridgeDataService.getProject(owner, id));
            $rootScope.selectedProject = bridgeDataService.getProject(owner, id);
        } else {
            var deferred = bridgeDataService.addProjectFromOwner(id, owner);
            if(deferred) {
                deferred.then(function(project) {
                    bridgeDataService.setSelectedProject(project);
                    $rootScope.selectedProject = project;
                });
            }
        }
    }

    if($route && $route.current && $route.current.originalPath === "/view/:owner/:id") {
        loadView($route.current.params.owner, $route.current.params.id);
    }

    $rootScope.$on('$routeChangeStart', function (event, route) {
        if(route && route.originalPath && route.originalPath === "/view/:owner/:id") {
            loadView(route.params.owner, route.params.id);
        }
    });

    if(!$rootScope.projectTabContainerWidth) {
        setScrollInformation();
    }

    angular.element($window).bind('resize', function() {
        setScrollInformation();
    });

    $scope.setSelectedProject = function(project) {
        if(!project.owner && !project.view) {
            $location.path("/");
            bridgeDataService.setSelectedProject(project);
            $rootScope.selectedProject = project;
        } else {
            $location.path("/view/" + project.owner + "/" + project.view);
        }
    };
}]);
