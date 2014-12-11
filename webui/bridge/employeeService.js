angular.module('bridge.service').service('employeeService', [ '$http', '$window', '$q', function($http, $window, $q){
	var buffer = [];
	var url = 'https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON';

	this.getData = function(user){
		var defer = $q.defer();

		if( buffer[user] ){
			defer.resolve(buffer[user]);
		}else{
			var resp = {};
			$http.get( url + '?id=' + user + '&origin=' + $window.location.origin).then(function (response) {
				resp = response.data.DATA;
				resp.TELNR = resp.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
				resp.TELNR_MOB = resp.TELNR_MOBILE.replace(/ /g, '').replace(/-/g, '');
				resp.fullName =  resp.VORNA + ' ' + resp.NACHN;
				resp.url = 'https://people.wdf.sap.corp/profiles/' + user;
				resp.mail = resp.SMTP_MAIL;

				$http.get('/bridge/search/buildings.xml').then(function (buildingResponse) {
					var data = new X2JS().xml_str2json(buildingResponse.data);
					for(var i = 0; i < data.items.item.length; i++)
					{
						if(data.items.item[i].objidshort === resp.BUILDING && data.items.item[i].geolinkB !== undefined)
						{
							resp.building_url = data.items.item[i].geolinkB;
							resp.city = data.items.item[i].city;
							resp.street = data.items.item[i].street;
						}
					}

					buffer[user] = resp;
					defer.resolve(resp);
				});

			});
		}

		return defer.promise;
	};

}]);
