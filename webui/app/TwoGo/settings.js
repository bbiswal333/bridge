angular.module('app.TwoGo').appTwoGoSettings =
	['$scope', function ($scope) {



	$scope.save_click = function () {
        Distance.distancefromorigin=  document.getElementById("Km").options[document.getElementById("Km").selectedIndex].value;
        localStorage.setItem("distancefromorigin", Distance.distancefromorigin);
        Distance.distancefromdestination = document.getElementById("Km1").options[document.getElementById("Km1").selectedIndex].value;
        localStorage.setItem("distancefromdestination", Distance.distancefromdestination);


        $(function (){

            PARAMS.checkBrowser();

        });

		$scope.$emit('closeSettingsScreen'); // Persisting the settings


	};
}];
