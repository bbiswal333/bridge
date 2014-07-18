angular.module('app.im').controller('app.rooms.detailController', [
  '$scope', 
  '$http',
  function Controller($scope, $http) {

    $scope.$parent.titleExtension = "Book Room";

    
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
  var d = new Date();
  d.setHours(d.getHours()+1);
  d.setMinutes(0);
  $scope.mytime = d;

  $scope.hours = d.getHours();
  $scope.minutes = "0";
    var mockData = {

    };


    var events = [
        {
          room: "MR KAR01 KE.01",
          capacity: 15,          
          isCurrent: true,
          start: new Date(),
          end: new Date(),
          startTime: "12",
          endTime: "3",
          startRe: "jhrfhdsgfhds",
          subject: "hell owlrl",
          location: "keller",
          timezone: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
          endRel: "2h 2m",
          endTime: "18:00",
          $$hashKey: "0A6"
        },
        {
          room: "MR WDF03 B1.02",
          capacity: 8,          
          isCurrent: true,
          start: new Date(),
          end: new Date(),
          startTime: "12",
          endTime: "3",
          startRe: "jhrfhdsgfhds",
          subject: "hell owlrl",
          location: "keller",
          timezone: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
          endRel: "2h 2m",
          endTime: "18:00",
          $$hashKey: "0B6"
        }

     ];
    $scope.box = {
      boxSize: 2
    };
    $scope.upComingEvents = function() {
      return events;
}
  }
  ]
);

