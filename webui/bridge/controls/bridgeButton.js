/*globals window*/
angular.module('bridge.app').directive('bridge.button', [function() {

	var requestAnimFrame = 	window.requestAnimationFrame       ||
							window.mozRequestAnimationFrame    ||
							window.oRequestAnimationFrame      ||
							window.msRequestAnimationFrame     ||
							function (callback) {
								window.setTimeout(callback, 1000 / 60);
							};

    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/bridgeButton.html',
        replace: true,
        transclude: true,
        scope: {
        	state: '@'
        },
        controller: function($scope, $element) {
		    centerX = 0,
		    centerY = 0,
		    color = '',
		    rectColor = '',
		    context = {},
		    element = {},
		    radius = 0;

		    $scope.canvas = $('canvas', $element)[0];

		    function resetFade(){
				$('canvas').removeClass('fadeOut');
			}

			function draw() {
				context.beginPath();
				context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
				context.fillStyle = rectColor;
				context.fill();
				radius += 10;
				if (radius < element.width) {
					resetFade();
					requestAnimFrame(draw);
				}
				if (radius >= element.width){
					$('canvas').addClass('fadeOut');
					window.setTimeout(function() {
						context.clearRect(0, 0, element.width, element.height);
					}, 50);
				}
			}

        	$scope.canvasClick = function(event) {
        		color = event.toElement.parentElement.dataset.color;
				if (color === 'light'){
					rectColor = '#fff';
				}
				else if (color === 'dark'){
					rectColor = '#000';
				}
				else if (color === 'disabled'){
					rectColor = '#e1e1e1';
				}
				else {
					rectColor = '#999';
				}
				element = event.toElement;
				context = element.getContext('2d');
				radius = 0;
				centerX = event.offsetX;
				centerY = event.offsetY;
				draw();
				context.clearRect(0, 0, element.width, element.height);
        	};
        }
    };
}]);
