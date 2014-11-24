angular.module('app.tile', []);
angular.module('app.tile').directive('app.tile',['$http','app.tile.configService',function ($http,configService) {
	
	var directiveController = ['$scope', function ($scope) {
		
		// Required information to get settings icon/ screen
		$scope.box.settingsTitle = "Configure Tile";
		$scope.box.settingScreenData = {
			templatePath: "tile/settings.html",
				controller: angular.module('app.tile').appTileSettings,
				id: $scope.boxId
		};

		// Bridge framework function to enable saving the config
		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};

		//Load the color pallette
		$http.get('app/tile/pallette.json').success(function(response){
			$scope._colors = response;
		}); 	
				
		//Initialize the App
		$scope.init = function(){
		
		    // Close Timer if it's in progress
			if($scope.time != 60)
				window.clearInterval($scope.timer);
			
			$scope.time = 60;
			$scope.counter = 1;//Array Size Counter->Will be linked to setting
			$scope.colorIndex = 1;//Index of the color pallete
			$scope.random = 0;//Index of the Dirty Cell
			$scope.hits = 0;//No. Of Hits-->Score
			$scope.data = [];//Color Codes for active cells
			$scope.gameInProgress = false;
			$scope.gamePaused = false;
			$scope.showInfo = true;
		};
			
		$scope.init( );
		
		//Start timer
		$scope.startTimer = function(){
		    document.getElementById("timer").innerHTML = $scope.time;
					$scope.timer = window.setInterval(function(){
					
						if( $scope.gameInProgress && !$scope.gamePaused ){					
							$scope.time--;
							if(document.getElementById("timer")){
								document.getElementById("timer").innerHTML = $scope.time;
							}
							
							if($scope.time <= 0){
								$scope.gameInProgress = false;
								//Adjust Box Size
								$scope.box.boxSize = 1;
								window.clearInterval($scope.timer);
							}
					}
				}
			,1000);
		};
		
		//Get Random Cell Index
		$scope.getRandomNumber = function(){
			return  Math.floor((Math.random() * $scope.counter * $scope.counter));
		};
		
		//Generate Data for active cells
		$scope.generateData = function(){
			$scope.data = [];
			$scope.random = $scope.getRandomNumber( );
			
			for( var i=0;i<$scope.counter*$scope.counter;i++)
			{
				var set = {};
                set = jQuery.extend({}, $scope._colors[$scope.colorIndex]);		

				if( i == $scope.random){
					set.X = set.Y;
				}
				$scope.data.push(set);
			}
		};
		
		//Shuffle the color pallette
		$scope.shuffle = function shuffle(o){
			for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		};

		//Handle Click
		$scope.click = function(i){	

			if(i == $scope.random){
				if($scope.counter <= $scope.comp)		
					$scope.counter++;
				
				$scope.hits++;
				$scope.colorIndex ++;
				$scope.generateData( );
			}
		};
		
		//Pause Game
		$scope.pauseGame = function(){
			$scope.gamePaused = true;
		};
		
		//Resume Game
		$scope.resumeGame = function(){
			$scope.gamePaused = false;
		}
		
		//Start new game
		$scope.startGame = function(){
			
			//Initialize the Game
			$scope.init();
			
			$scope.showInfo = false;
			$scope.gameInProgress = true;
			$scope.counter++;
			
			//Shuffle the Color Pallette
			$scope.shuffle($scope._colors);

			//Start Timer
			$scope.startTimer();	
			
			//Generate Data
			$scope.generateData();
				
			//Adjust Box Size
            $scope.box.boxSize = 2;			
		};
	}];

		var linkFn = function ($scope) {

		// get own instance of config service, $scope.appConfig contains the configuration from the backend
		configService.initialize($scope.appConfig);

		// watch on any changes in the settings screen
		$scope.$watch("appConfig.values.comp", function () {
			$scope.comp = $scope.appConfig.values.comp;
		}, true);
	};
	
	return {
		restrict: 'E',
		templateUrl: 'app/tile/overview.html',
		controller: directiveController,
		link: linkFn
	};
}]);
