angular.module('docsIsolateScopeDirective', ['sapCharts'])
  .controller('Ctrl', function ($scope, $timeout) {

      var dataCreator = new DataCreator();
      //$scope.sourceData = dataCreator.generateDashedData(99);
      //$scope.sourceData = dataCreator.generateMonthData();
      $scope.sourceData = dataCreator.generateSapUI5Data();
      //$timeout(function(){timer(dataCreator, $scope, $timeout)}, 2000);



  });
  var toggle = true;
  function timer(dataCreator, $scope, $timeout) {
      var handler = new DataHandler();
      if (toggle) {
          $scope.sourceData = dataCreator.generateDashedData(99);
          handler. getChartDescription("chart1").reveredAxis = "false";
          toggle = false;
      }
      else {
          $scope.sourceData = dataCreator.generateData(55);
          handler. getChartDescription("chart1").reveredAxis = "true";
          toggle = true;
      }
          $timeout(function(){timer(dataCreator, $scope, $timeout)}, 3000);         
      }