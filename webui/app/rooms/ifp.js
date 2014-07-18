angular.module('app.rooms').service('ifpservice', [
    '$http',
    "bridgeDataService",
    "lib.utils.calUtils",
    function($http, dataService, calUtils) {

        var user = dataService.getUserInfo().BNAME;
        var ISP_ROOMS = "https://ifp.wdf.sap.corp/sap/bc/bridge/MY_ROOM_RESERVATIONS";

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
        }

        function _loadFromIsp(from, to, callback) {
            $http({
                method: 'GET',
                url: ISP_ROOMS + '?' + 'origin=' + location.origin + '&from=' + _formatDateForQuery(from) + '&to=' + _formatDateForQuery(to) + '&user=' + user
            }).success(function(data){
                data.RESERVATIONS.forEach(extractDates);
                data.RESERVATIONS.forEach(extractRoom);
                //alert(JSON.stringify(data));
                callback(data);
            }).error(function(){
                alert("error");
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

        return {
            loadFromIsp: _loadFromIsp
        }
    }
])
