angular.module('app.rooms').service('ifpservice', [
  '$http',
  "bridgeDataService",
  function($http, dataService) {

    var user = dataService.getUserInfo().BNAME;
    var ISP_ROOMS = "https://ifp.wdf.sap.corp/sap/bc/bridge/MY_ROOM_RESERVATIONS";

    function extractDates(reservation) {

      var datePattern = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/;
      var m = reservation.VALIDFROM.toString(10).match(datePattern);
      reservation.VALIDFROMDATE = new Date(parseInt(m[1]),parseInt(m[2])-1,parseInt(m[3]),parseInt(m[4]),parseInt(m[5]));
      m = reservation.VALIDTO.toString().match(datePattern);
      reservation.VALIDTODATE = new Date(parseInt(m[1]),parseInt(m[2])-1,parseInt(m[3]),parseInt(m[4]),parseInt(m[5]));
    }

    function _loadFromIsp(from, to, callback) {
      $http({
        method: 'GET',
        url: ISP_ROOMS + '?' + 'origin=' + location.origin + '&from=' + from + '&to=' + to + '&user=' + user
     }).success(function(data){
        data.RESERVATIONS.forEach(extractDates);
        alert(JSON.stringify(data));
        callback(data);
      }).error(function(){
          alert("error");
      });
    }

    return {
      loadFromIsp: _loadFromIsp
    }
  }
])
