angular.module('bridge.service').service('employeeService', [ '$http', '$window', function($http, $window){
	var buffer = [];
	var url = 'https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON';
	
	this.getData = function(user){
	
		if( buffer[user] ){
			return buffer[user];
		}else{
			var resp = {};
			$http.get( url + '?id=' + user + '&origin=' + $window.location.origin).then(function (response) {
				resp = response.data.DATA;
				resp.TELNR = resp.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
				buffer[user] = resp;
			});
			return resp;
		}
	};

}]);
