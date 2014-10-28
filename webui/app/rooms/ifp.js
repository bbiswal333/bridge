angular.module('app.rooms').service('ifpservice', [
    '$http',
    "bridgeDataService",
    "lib.utils.calUtils",
    function($http, dataService, calUtils) {
		var self = this;

        //var user
        //if (typeof dataService.getUserInfo() == "undefined") {
        //	user = dataService.getUserInfo().BNAME;
        //}
        var ISP_ROOMS = "https://ifp.wdf.sap.corp/sap/bc/bridge/MY_ROOM_RESERVATIONS";
		var ISP_CANCELROOM = "https://ifp.wdf.sap.corp/sap/bc/bridge/CANCEL_ROOM_RESERVATION";

        function extractDates(reservation) {

            var datePattern = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/;
            var m = reservation.VALIDFROM.toString(10).match(datePattern);
            reservation.VALIDFROMDATE = new Date(parseInt(m[1]),parseInt(m[2])-1,parseInt(m[3]),parseInt(m[4]),parseInt(m[5]));
            m = reservation.VALIDTO.toString().match(datePattern);
            reservation.VALIDTODATE = new Date(parseInt(m[1]),parseInt(m[2])-1,parseInt(m[3]),parseInt(m[4]),parseInt(m[5]));
        }

        function extractRoom(reservation) {
            var regex = ".*\-(.*)[\/|\-].*\/(.*)$"
            var roomId = reservation.OOIDEXT;
            reservation.BUILDING = roomId.match(regex)[1];
            reservation.ROOM = roomId.match(regex)[2];
			reservation.LOCATION= reservation.BUILDING + ", " + reservation.ROOM;
        }
		
		function extractVenues(reservation, data) {
			for (var venueid in data.VENUES) {
				if (data.VENUES[venueid].OOIDEXT == reservation.OOIDEXT) {
					reservation.EMAIL = data.VENUES[venueid].MAIL;
					reservation.ROOMDISPLAYNAME = data.VENUES[venueid].DISPLAYNAME;
				}
			}

		}

		function _loadFromIsp(from, to) {
            return $http({
                method: 'GET',
                url: ISP_ROOMS + '?' + 'origin=' + location.origin + '&from=' + _formatDateForQuery(from) + '&to=' + _formatDateForQuery(to)
            }).success(function(data){
                data.RESERVATIONS.forEach(extractDates);
                data.RESERVATIONS.forEach(extractRoom);
				data.RESERVATIONS.forEach(extractVenues, data);
                //alert(JSON.stringify(data));
                return data;
            });
        }

        function _formatDateForQuery(date) {
            var year = date.getFullYear();
            var month = calUtils.useNDigits(date.getMonth()+1, 2);
            var day = calUtils.useNDigits(date.getDate(), 2);
            var hour = calUtils.useNDigits(date.getHours(), 2);
            var minutes = calUtils.useNDigits(date.getMinutes(), 2);
            var seconds = calUtils.useNDigits(date.getSeconds(), 2);

            return year + month + day + hour + minutes + seconds;
        }

				
		function _cancelRoom(room) {
			var data = { reservationId : room.RESERVATION_ID }; // EXHANGE_UID, EXHANGE_ID, RESERVATION_ID
			
			return $http({
				method: 'POST',
				url: ISP_CANCELROOM + '?' + 'origin=' + location.origin ,
				transformRequest: __transformRequest,
				data: data
			}).success(function(data){
				return data;
			});

		}
		function __transformRequest( data, headers ) {
			headers()[ "Content-Type" ] = "application/x-www-form-urlencoded; charset=utf-8";

			if (! _.isObject( data) ) {
				return ( _.isEmpty(data) ? "" : _.toString(data)) ;
			}
			var md = _.values(_.mapValues(data, function(value, key) {
				return encodeURIComponent(key) + "=" + encodeURIComponent(value);
			})).join("&");
			return md;

		};

		
        return {
            loadFromIsp: _loadFromIsp,
			cancelRoom: _cancelRoom
        }
    }
])
