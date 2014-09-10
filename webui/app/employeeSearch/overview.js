angular.module('app.employeeSearch', ['bridge.employeeSearch']);

angular.module('app.employeeSearch').directive('app.employeeSearch', ['bridge.search', '$modal', '$http', '$window', function (bridgeSearch, $modal, $http, $window) {

    var directiveController = ['$scope', function ($scope) {
        $scope.box.boxSize = "2";

	    $scope.copyClipboard = function(text)
		{
			$http.get($window.client.origin + '/api/client/copy?text=' + encodeURIComponent(text));
		};

		$scope.$watch('selectedEmployee', function () {
            if($scope.selectedEmployee === "tetris")
            {
            	$window.location.href = '#/tetris';
            }
        }, true);

        $scope.onSelect = function ($item) {
            // FIND_EMPLOYEE_JSON service call with id as a parameter returns more details about the user. We need TELNR.
            $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + $item.BNAME + '&origin=' + $window.location.origin).then(function (response) {
                $scope.selectedEmployee = response.data.DATA;
                $scope.selectedEmployee.TELNR = $scope.selectedEmployee.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                $scope.selectedEmployee.TELNR_MOB = $scope.selectedEmployee.TELNR_MOBILE.replace(/ /g, '').replace(/-/g, '');

                $http.get('/bridge/employeeSearch/buildings.xml').then(function (response) {
                var data = new X2JS().xml_str2json(response.data);
                for(var i = 0; i < data.items.item.length; i++)
                {
                    if(data.items.item[i].objidshort === $item.BUILDING && data.items.item[i].geolinkB !== undefined)
                    {
                        $scope.selectedEmployee.building_url = data.items.item[i].geolinkB;
                        $scope.selectedEmployee.city = data.items.item[i].city;
                        $scope.selectedEmployee.street = data.items.item[i].street;
                    }
                }
                });

            });
        };

        function getSearchName(username) {
            //support format "Jeschke, Christian" <christian.jeschke@sap.com>' from mail clients like outlook
            var searchname = username;
            var outlook_support = username.split('"');
            if(outlook_support.length === 3 && outlook_support[0] === "")
            {
                searchname = outlook_support[1];
            }
            return searchname;
        }

        bridgeSearch.addSearchProvider({
            getSourceName: function() {
                return "SAP Employees";
            },
            findMatches: function(query, resultArray) {
                var deffered = $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?maxrow=18&query=' + getSearchName(query) + '&origin=' + $window.location.origin);
                deffered.then(function (response) {
                    return response.data.DATA.map(function(employee) {
                        resultArray.push({title: employee.VORNA + " " + employee.NACHN, description: employee.BNAME, originalEmployee: employee});
                    });
                });
                return deffered.promise;
            },
            getCallbackFn: function() {
                return function(selectedEmployee) {
                    $scope.onSelect(selectedEmployee.originalEmployee);
                };
            }
        });
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeSearch/overview.html',
        controller: directiveController
    };
}]);
