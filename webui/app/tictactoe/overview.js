/*$scope.tile value 1 is for Player
					2 is for Comp*/
angular.module('app.tictactoe', []);
angular.module('app.tictactoe').directive('app.tictactoe',[function () {

	var directiveController = ['$scope', function ($scope) {

			$scope.box.boxSize = "2";
		$scope.countUser = 0;
		$scope.countComputer = 0;
		$scope.countDraw = 0;
		$scope.reset = function(){
		$scope.tile = [];
		$scope.tile[0] = [];
		$scope.tile[0][0] = {};
		$scope.tile[0][1] = {};
		$scope.tile[0][2] = {};

		$scope.tile[0][0].id = 0;
		$scope.tile[0][1].id = 0;
		$scope.tile[0][2].id = 0;

		$scope.tile[1] = [];
		$scope.tile[1][0] = {};
		$scope.tile[1][1] = {};
		$scope.tile[1][2] = {};

		$scope.tile[1][0].id = 0;
		$scope.tile[1][1].id = 0;
		$scope.tile[1][2].id = 0;

		$scope.tile[2] = [];
		$scope.tile[2][0] = {};
		$scope.tile[2][1] = {};
		$scope.tile[2][2] = {};

		$scope.tile[2][0].id = 0;
		$scope.tile[2][1].id = 0;
		$scope.tile[2][2].id = 0;

		$scope.tile[0][0].src = "../../app/tictactoe/images/white.png";
		$scope.tile[0][1].src = "../../app/tictactoe/images/white.png";
		$scope.tile[0][2].src = "../../app/tictactoe/images/white.png";
		$scope.tile[1][0].src = "../../app/tictactoe/images/white.png";
		$scope.tile[1][1].src = "../../app/tictactoe/images/white.png";
		$scope.tile[1][2].src = "../../app/tictactoe/images/white.png";
		$scope.tile[2][0].src = "../../app/tictactoe/images/white.png";
		$scope.tile[2][1].src = "../../app/tictactoe/images/white.png";
		$scope.tile[2][2].src = "../../app/tictactoe/images/white.png";

		$scope.progress=0;				//To track the progress of the game
		$scope.result = "";
		$scope.resultImg = "../../app/tictactoe/images/play.gif";
		}

		$scope.reset();

		$scope.markIt = function(i,j){
			if($scope.progress<9 && $scope.checkWinner()==0)
			{
				$scope.tile[i][j].src = "https://lh5.ggpht.com/x8JYjQ4sh-nkdMMJLsELJcvYJIDpObNbMJP0YjEJilF_1qNEVPRCNZv4PnzCSv3o1A=w300";
				$scope.tile[i][j].id = 1;   //Player marks the board 
				$scope.progress++;
			}
			$scope.displayWinner();
			//console.log("The Winner is ",$scope.checkWinner());
			if($scope.progress<9 && $scope.checkWinner()==0){
				$scope.compTurn();		
				$scope.displayWinner();
			}


		};

		$scope.compTurn = function(){
			if($scope.offendPlay())
			{
				$scope.progress++;
				return;
			}
			
			if($scope.defendPlay())
			{
				$scope.progress++;
				return;
			}
			$scope.randomPlay();
			
		};
		$scope.markForComp = function(a,b){
					$scope.tile[a][b].id=2;	//Computer marks the board
					$scope.tile[a][b].src="http://s1.hubimg.com/u/7406806_f260.jpg";

		};

		$scope.randomPlay = function(){
			var random1,random2;
			var a=true;
			console.log("randomPlay");
			do{
				random1=Math.floor(Math.random()*3)
				random2=Math.floor(Math.random()*3)
				
				if($scope.tile[random1][random2].id!=1 && $scope.tile[random1][random2].id!=2)
				{
					$scope.markForComp(random1,random2);
					$scope.progress++;
					a=false;
				}
				console.log("Marking ",random1,random2, "Game progress is ",$scope.progress);
			}while(a);
		};


		$scope.offendPlay = function(){
				var count1,count2;
		count1=0;
		count2=0;
		var Q=2;//id used for Comp
		for(var i=0;i<3;i++)
		{
			for(var j=0;j<3;j++)
			{
				if($scope.tile[i][j].id==Q)											//checks row
					if(++count1==2)	
						for(var k=0;k<3;k++)								
						{if($scope.tile[i][k].id==0)
						{$scope.markForComp(i,k);	return true;}
						}
					
				if($scope.tile[j][i].id==Q)											//checks column
					if(++count2==2)
						for(var k=0;k<3;k++)								
						{if($scope.tile[k][i].id==0)
						{$scope.markForComp(k,i);	return true;}
						}
					
			}
			count1=0;	count2=0;
		}
		for(var i=0;i<3;i++)												//checks cross
		{
			if($scope.tile[i][i].id==Q)
				if(++count1==2)
					for(var k=0;k<3;k++)								
					{if($scope.tile[k][k].id==0)
					{$scope.markForComp(k,k);	return true;}
					}
			if($scope.tile[i][(2-i)].id==Q)
				if(++count2==2)
					for(var k=0;k<3;k++)								
					{if($scope.tile[k][(2-k)].id==0)
					{$scope.markForComp(k,(2-k));	return true;}
					}		
		}
		return false;
	

		};/**/


	$scope.defendPlay = function()						//defends player form forming line if there are already two points in it and return true if changed
	{
	var P=1;//id used for Player	
	var count1,count2;
	count1=0;count2=0;
		for(var i=0;i<3;i++)
		{
			for(var j=0;j<3;j++)
			{
				if($scope.tile[i][j].id==P)											//checks row
					if(++count1==2)	
						for(var k=0;k<3;k++)								
						{if($scope.tile[i][k].id==0)
						{$scope.markForComp(i,k);	return true;}
						}
					
				if($scope.tile[j][i].id==P)											//checks column
					if(++count2==2)
						for(var k=0;k<3;k++)								
						{if($scope.tile[k][i].id==0)
						{$scope.markForComp(k,i);	return true;}
						}
					
			}
			count1=0;	count2=0;
		}
		for(var i=0;i<3;i++)												//checks cross
		{
			if($scope.tile[i][i].id==P)
				if(++count1==2)
					for(var k=0;k<3;k++)								
					{if($scope.tile[k][k].id==0)
					{$scope.markForComp(k,k);	return true;}
					}
			if($scope.tile[i][(2-i)]==P)
				if(++count2==2)
					for(var k=0;k<3;k++)								
					{if($scope.tile[k][(2-k)]==0)
					{$scope.markForComp(k,(2-k));	return true;}
					}		
		}
		return false;
	}

		$scope.displayWinner=function(){
			if($scope.checkWinner() == 1){
				$scope.resultImg = "../../app/tictactoe/images/winner.png";
				$scope.result="You WIN!!:)";
			
				$scope.countUser = $scope.countUser + 1;
			}else if ($scope.checkWinner() == 2 ){
				$scope.resultImg = "../../app/tictactoe/images/loser.png";
				$scope.countComputer = $scope.countComputer + 1;
				$scope.result="You LOOSE!!:P";
			}else if( $scope.progress >= 9){
				$scope.resultImg = "../../app/tictactoe/images/draw.png";
				$scope.result = "DRAW!";
				$scope.countDraw = $scope.countDraw + 1;
			}
		};

		//Returns who is winner or no winner- 1 for X & 2 for O
		$scope.checkWinner=function(){
				for(var v=1;v<=2;v++)
				{
					for(var i=0;i<3;i++){
						if(($scope.tile[i][0].id==v)&&
							($scope.tile[i][1].id==v)&&
							($scope.tile[i][2].id==v) )
							return v;}
					for(var i=0;i<3;i++){
						if(($scope.tile[0][i].id==v)&&($scope.tile[1][i].id==v)&&($scope.tile[2][i].id==v))
							return v;	
						if(($scope.tile[0][0].id==v)&&($scope.tile[1][1].id==v)&&($scope.tile[2][2].id==v))
							return v;	
						if(($scope.tile[0][2].id==v)&&($scope.tile[1][1].id==v)&&($scope.tile[2][0].id==v))		
							return v;
						}
				}
				return 0;
			};




		
		
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/tictactoe/overview.html',
		controller: directiveController
	};
}]);
