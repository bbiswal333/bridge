angular.module('app.securityTesting', ["app.securityTesting.data"]);
angular.module('app.securityTesting').directive('app.securityTesting', ['app.securityTesting.dataService', function (dataService) {

	var directiveController = ['$scope', function ($scope)
	{
		$scope.box.boxSize = "2";
		$scope.handleSecurityTestingResults = function() {
                    dataService.loadData().then(function () {
                        $scope.fortify_closed_issues = 0;
                        $scope.coverity_closed_issues = 0;
                        $scope.fortify_open_issues = 0;
                        $scope.coverity_open_issues = 0;
                        function abbreviateNumber(value) {
                            var newValue = value;
                            if (value >= 1000) {
                                var suffixes = ["", "k", "m", "b", "t"];
                                var suffixNum = Math.floor(("" + value).length / 3);
                                var shortValue = '';
                                for (var precision = 2; precision >= 1; precision--) {
                                    shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
                                    var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
                                    if (dotLessShortValue.length <= 2) { break; }
                                }
                                if (shortValue % 1 != 0) shortNum = shortValue.toFixed(1);
                                newValue = shortValue + suffixes[suffixNum];
                            }
                            return newValue;
                        }
                        $.each(dataService.data.securityTestingData, function (index, element) {
                       
                            if (element.objecttype == 'codescan.fort') {
                                $scope.fortify_open_issues = abbreviateNumber(parseFloat(element.opencount));
                                $scope.fortify_closed_issues = abbreviateNumber(parseFloat(element.closedcount));
                                $scope.fortifyIssueProgress = Math.floor(parseFloat(element.opencount) / (parseFloat(element.opencount) + parseFloat(element.closedcount)) * 100);

                                
                            }
                            if (element.objecttype == 'codescan.cove') {
                                $scope.coverity_open_issues =   abbreviateNumber(parseFloat(element.opencount));
                                $scope.coverity_closed_issues = abbreviateNumber(parseFloat(element.closedcount));

                                $scope.coverityIssueProgress = Math.floor(parseFloat(element.opencount) / (parseFloat(element.opencount) + parseFloat(element.closedcount)) * 100);
                                
                            }
                            
                            
                        });
                    });
		};
		$scope.handleSecurityTestingResults();
		$scope.box.reloadApp($scope.handleSecurityTestingResults, 60 * 5);
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/securityTesting/overview.html',
		controller: directiveController
	};
}]);
