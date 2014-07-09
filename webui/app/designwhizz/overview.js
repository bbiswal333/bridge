angular.module('app.designwhizz', []);
angular.module('app.designwhizz').directive('app.designwhizz', function () {

    var directiveController = ['$scope', function ($scope) 
    {
        //put some stuff in here   
		var messages;
		// load quotes
		$.ajax({
		url: "app/designwhizz/DesignQuotes.json",
		success: function (data) {
		  messages=data['Messages'];
		  $('#quote').text($scope.randomQuote());
		  // change periodically
		  window.setInterval(function() {
			$('#quote').text($scope.randomQuote());
			},1000*60*60); // 1h
		}
		});	
		$('#newQuote').click(function() {
			$('#quote').text($scope.randomQuote());
			return false;
		});		
		$('#whizzJam').click(function() {
			window.open('https://go.sap.corp/w');
			return false;
		});	
		$scope.randomQuote = function() {
		var ind=Math.floor(Math.random()*messages.length);
		return messages[ind];
		};
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/designwhizz/overview.html',
        controller: directiveController
    };
});