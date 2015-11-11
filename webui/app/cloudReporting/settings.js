angular.module('app.cloudReporting').appCloudReportingSettings =
['$scope', '$http',  '$window', '$location', 'app.cloudReporting.configservice',
	function ($scope, $http, $window, $location, CloudReportingConfigService) {
	$scope.currentConfigValues = CloudReportingConfigService.getConfigForAppId($scope.boxScope.metadata.guid);

    $scope.items = [];
    $scope.selected_kpis = $scope.currentConfigValues.configItem.kpis;

    if ($scope.selected_kpis.length === 0) {
        $scope.selected_kpis = [];
    }

    var sURL = $scope.currentConfigValues.getUrl();

    $http.get(sURL + '/bc/mdrs/cdo?type=crp_bdb&entity=view_config' + '&origin=' + $window.location.origin).success(function(response) {
        var result = response.DATA.VIEWS;
        $scope.items = result;
        //console.log($scope.items);
    });

    $scope.search_kpis = function(){
        $scope.items = [];
        $http.get(sURL + '/bc/mdrs/cdo?type=crp_bdb&entity=view_config&search=' + $('#search_text .bridge-input').val() + '&origin=' + $window.location.origin).success(function(response) {
        var result = response.DATA.VIEWS;
        $scope.items = result;
        //console.log($scope.items);
        });
    };

    $scope.selectKPI = function (kpi) {
        if ($scope.selected_kpis.length < 10) {
            $scope.selected_kpis.push(kpi[0]);
        }
        else {
            $window.alert("Please select maximum 10 KPIs per tile instance!");
        }
        $scope.currentConfigValues.configItem.kpis = $scope.selected_kpis;
    };

    $scope.removeKPI = function (kpi) {
        var index = -1;
        var i = 0;
        $scope.selected_kpis.forEach(function(entry) {
            if (entry.ID === kpi[0].ID){
                index = i;
            }
            i++;
        });

        if (index > -1) {
            $scope.selected_kpis.splice(index, 1);
        }
        $scope.currentConfigValues.configItem.kpis = $scope.selected_kpis;
       // console.log($scope.selected_kpis);
    };

    $scope.save_click = function () {
        if ($scope.currentConfigValues.configItem.kpis.length > 4) {
            $scope.currentConfigValues.configItem.boxSize = '2';
        }
        else {
            $scope.currentConfigValues.configItem.boxSize = '1';
        }
        $scope.$emit('closeSettingsScreen');
    };

    $scope.getLocationName = function(object, index){
    	return Object.getOwnPropertyNames(object)[index];
    };

}];
