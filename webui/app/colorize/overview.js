angular.module('app.colorize', []);
angular.module('app.colorize').directive('app.colorize', [ 'bridgeDataService', function (bridgeDataService) {

	var directiveController = ['$scope', function ($scope) {
		$scope.appText = "Pretty colorize app.";
		$scope.box.boxSize = "2";
		var bridgeSettings = bridgeDataService.getBridgeSettings();
		if(!bridgeSettings.backgroundColors) {
			bridgeSettings.backgroundColors = [
                '#418AC9',
                '#68A1D4', 
                '#8EB9DF',
                '#B3D0E9',

                '#4EA175',
                '#7AB997',
                '#A7D0BA',
                '#D3E6DC',

                '#D53F26',
                '#DD6551',
                '#E68C7D',
                '#EEB2A8',

                '#8561c5',
                '#a489d4',
                '#c2b0e2',
                '#d2c6e5',

                '#fcb517',
                '#FCC445',
                '#FCD274',
                '#FEE0A1',

                '#E76F24',
                '#EC8948',
                '#F0A470',
                '#F5C099',

                '#707070',
                '#8a8a8a',
                '#a6a6a6',
                '#c3c3c3' 
            ];
		}

		$scope.backgroundColors = bridgeSettings.backgroundColors;

		$scope.r = 1;
		$scope.g = 1;
		$scope.b = 1;
		$scope.a = 1;

		$scope.addColor = function(r,g,b,a){
			$scope.backgroundColors.push('rgba('+ r + ',' + g + ',' + b + ',' + a + ')');
		};

		$scope.removeColor = function(index){
			$scope.backgroundColors.splice(index, 1);
			console.log(index);
		}

		$scope.getbackgroundColors = function(index){
			return $scope.backgroundColors[index];
		};

		$scope.setBackgroundColor = function(index){
			bridgeSettings.selectedBackgroundColorIndex = index;
			$('body').css('background-color', ($scope.backgroundColors[index]));
		};

		if(bridgeSettings.selectedBackgroundColorIndex) {
			$scope.setBackgroundColor(bridgeSettings.selectedBackgroundColorIndex);
		};
	}];




	return {
		restrict: 'E',
		templateUrl: 'app/colorize/overview.html',
		controller: directiveController
	};
}]);
