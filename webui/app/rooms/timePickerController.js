var TimepickerDemoCtrl = function ($scope) {
  var d = new Date();
  d.setHours(d.getHours()+1);
  d.setMinutes(0);
  $scope.mytime = d;

  $scope.hours = d.getHours();
  $scope.minutes = "0";

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = false;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  var update = function() {
    var d = new Date();
//    d.setHours( 14 );
//    d.setMinutes( 0 );
    d.setHours(d.getHours+1);
    d.setMinutes(0);
    //$scope.mytime = d;
    return d;
  };

  $scope.changed = function () {
    console.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };


};