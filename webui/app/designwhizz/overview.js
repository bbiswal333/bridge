angular.module('app.designwhizz', []);
angular.module('app.designwhizz').directive('app.designwhizz', function () {

    var directiveController = ['$scope', function ($scope) 
    {	// load quotes
		var messages;
		$.ajax({
		url: "app/designwhizz/DesignQuotes.json",
		success: function (data) {
		  messages=data['Messages'];
		  $scope.updateQuote();
		  // change periodically
		  window.setInterval(function() {
			$scope.updateQuote();
			},1000*60*60); // 1h
		}
		});	
        $scope.updateQuote = function() {
			var q=$scope.randomQuote();
			$('#quote').text(q.quote);
			$('#author').text(q.author);
		};
		$scope.randomQuote = function() {
		var ind=Math.floor(Math.random()*messages.length);
		var quoteauthor=messages[ind].split('//');
		if(quoteauthor.length>1)
			return { quote:quoteauthor[0],author:quoteauthor[1]};
		else
			return { quote:quoteauthor,author:""};
		};
		$('#newQuote').click(function() {
			$scope.updateQuote();
			return false;
		});		
		$('.designwhizz-icon').click(function() {
			window.open('https://go.sap.corp/w');
			return false;
		});	
		$('#author').click(function() {
			window.open('https://google.com/#q='+$('#quote').text());
			return false;
		});	
		$('#quote').click(function() {
			window.open('https://google.com/#q='+$('#quote').text());
			return false;
		});
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/designwhizz/overview.html',
        controller: directiveController
    };
});