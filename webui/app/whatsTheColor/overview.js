angular.module('app.whatsTheColor', []);
angular.module('app.whatsTheColor').directive('app.whatsTheColor',[function () {

	//inspired by http://whatcolourisit.scn9a.org/, though this algorithm uses the full domain of RGB.

	var directiveController = ['$timeout', function ($timeout) {

		var timeToRGB = function(hours,mins,secs){
			var rgb1 = parseInt(hours / 24 * 255);
			var rgb2 = parseInt(mins / 60 * 255);
			var rgb3 = parseInt(secs / 60 * 255);

			return [rgb1,rgb2,rgb3];
		};

		var rgbToHex = function(R,G,B) {
			// taken from http://www.javascripter.net/faq/rgbtohex.htm
			var toHex = function(n){
				n = parseInt(n,10);
				if (isNaN(n)) {return "00"; }
				n = Math.max(0,Math.min(n,255));
				return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
			};
			return toHex(R) + toHex(G) + toHex(B);
		};

		var updateColor = function(){
			var oDate = new Date();
			var iHours = oDate.getHours();
			var iMins = oDate.getMinutes();
			var iSecs = oDate.getSeconds();

			var aColor = timeToRGB(iHours,iMins,iSecs);
			var sHex = "#" + rgbToHex(aColor[0],aColor[1],aColor[2]);
			var sRgbText = "rgb(" + aColor[0] + "," + aColor[1] + "," + aColor[2] + ")";

			if (iHours < 10){iHours = "0" + iHours; }
			if (iMins < 10){iMins = "0" + iMins; }
			if (iSecs < 10){iSecs = "0" + iSecs; }

			$("#whats-the-color-t").html(iHours + " : " + iMins + " : " + iSecs); //hard set, as binding is async
			$("#whats-the-color-h").html(sRgbText + "<br>" + sHex);

			$("#whats-the-color-b").css("background-color", sHex);

			$timeout(updateColor, 1000);
    	};

		updateColor();
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/whatsTheColor/overview.html',
		controller: directiveController
	};
}]);
