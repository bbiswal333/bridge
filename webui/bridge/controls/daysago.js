angular.module('bridge.app').directive('bridge.daysago', [function() {
    var ONE_DAY = 86400000;

    return {
        restrict: 'E',
        scope: {
        	date: '='
        },
        templateUrl: 'bridge/controls/daysago.html',
		controller: function($scope) {
            function parseDate(sDate) {
                if(sDate) {
                    sDate = sDate.toString();
                    return new Date(sDate.substr(0, 4), parseInt(sDate.substr(4, 2)) - 1, sDate.substr(6, 2), sDate.substr(8, 2), sDate.substr(10, 2), sDate.substr(12, 2));
                } else {
                    return null;
                }
            }

            $scope.getCriticalityClass = function(sDate) {
                if(!sDate) {
                    return undefined;
                }

                var diff = new Date() - parseDate(sDate);
                if(diff > ONE_DAY * 14) {
                    return "red-font";
                } else if(diff > ONE_DAY * 7) {
                    return "yellow-font";
                } else {
                    return "green-font";
                }
            };

            $scope.getTimeAgo = function(sDate) {
                if(!sDate) {
                    return "";
                }

                return $.timeago(parseDate(sDate).getTime());
            };
        }
    };
}]);
