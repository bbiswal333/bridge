angular.module('bridge.service').service('employeeService', [ '$http', '$window', '$q', '$modal', 'bridgeBuildingSearch', function($http, $window, $q, $modal, bridgeBuildingSearch){
	var buffer = {};
	var url = 'https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON';

	this.showEmployeeModal = function(oEmployeeDetails){
		$modal.open({
			templateUrl: 'bridge/controls/employeeInput/employeeDetails.html',
			controller: function($scope) {
				$scope.selectedEmployee = oEmployeeDetails;
			},
			size: "sm"
		});
	};

	this.getData = function(user){
		var defer = $q.defer();
		if( buffer[user] ){
			defer.resolve(buffer[user]);
		}else{
			var resp = {};
			$http.get( url + '?id=' + user + '&origin=' + $window.location.origin).then(function (response) {
				resp = response.data.DATA;
				if(resp.length === 0) {
					return;
				}
				resp.TELNR = resp.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
				resp.TELNR_MOB = resp.TELNR_MOBILE.replace(/ /g, '').replace(/-/g, '');
				resp.fullName =  resp.VORNA + ' ' + resp.NACHN;
				resp.url = 'https://people.wdf.sap.corp/profiles/' + user;
				resp.ID = resp.BNAME;
				resp.mail = resp.SMTP_MAIL;

				if (resp.BUILDING !== undefined) {
					bridgeBuildingSearch.searchBuildingById(resp.BUILDING).then(function (aBuildings) {
						if (aBuildings.length > 0) {
							resp.building_url = aBuildings[0].geolinkB;
							resp.city = aBuildings[0].city;
							resp.street = aBuildings[0].street;
						}

						buffer[user] = resp;
						defer.resolve(resp);
					});
				} else {
					buffer[user] = resp;
					defer.resolve(resp);
				}
			});
		}

		return defer.promise;
	};

}]);
