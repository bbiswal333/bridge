/*$scope.tile value 1 is for Player
                    2 is for Comp*/
angular.module('app.tictactoe', []);
angular.module('app.tictactoe').directive('app.tictactoe', [function() {

    var directiveController = ['$scope', function($scope) {

        $scope.box.boxSize = "2";
        $scope.countUser = 0;
        $scope.countComputer = 0;
        $scope.countDraw = 0;

        //Initializes and resets all variables
        $scope.reset = function() {
            $scope.tile = [];
            for (var i = 0; i < 3; i++) {
                $scope.tile[i] = [];
                for (var j = 0; j < 3; j++) {
                    $scope.tile[i][j] = {};
                    $scope.tile[i][j].id = 0;
                    $scope.tile[i][j].src = "../../app/tictactoe/images/white.png";
                }
            }
            $scope.progress = 0; //To track the progress of the game
            $scope.result = "";
            $scope.resultImg = "../../app/tictactoe/images/play.gif";

            var matchCount = $scope.countUser + $scope.countComputer + $scope.countDraw;
            if (matchCount % 2 !== 0) {
                $scope.compTurn();
            }
        }

        //Player marks on the board
        $scope.markIt = function(i, j) {
            if ($scope.tile[i][j].id == 1 || $scope.tile[i][j].id == 2) //checks if the box is already marked
            {
                return;
            }
            if ($scope.progress < 9 && $scope.checkWinner() == 0) {
                $scope.tile[i][j].src = "../../app/tictactoe/images/cross.png";
                $scope.tile[i][j].id = 1;//Player marks the board 
                $scope.progress++;
            }
            $scope.displayWinner();

            if ($scope.progress < 9 && $scope.checkWinner() == 0) {
                $scope.compTurn();
                $scope.displayWinner();
            }


        };

        //Computer's turn
        $scope.compTurn = function() {
            if ($scope.offendPlay()) {
                $scope.progress++;
                return;
            }
            if ($scope.defendPlay() === true) {
                $scope.progress++;
                return;
            }
            $scope.randomPlay();

        };

        //Computer marks the board
        $scope.markForComp = function(a, b) {
            $scope.tile[a][b].id = 2;
            $scope.tile[a][b].src = "../../app/tictactoe/images/zero.jpg";

        };

        function markwithRespectToPlayer(playerId){
            var count1, count2;
            count1 = 0;
            count2 = 0;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if ($scope.tile[i][j].id === playerId){ //checks row
                        if (++count1 === 2){
                            for (var k = 0; k < 3; k++) {
                                if ($scope.tile[i][k].id === 0) {
                                    $scope.markForComp(i, k);
                                    return true;
                                }
                            }
                        }
                    }

                    if ($scope.tile[j][i].id === playerId) {//checks column
                        if (++count2 === 2){
                            for (k = 0; k < 3; k++) {
                                if ($scope.tile[k][i].id === 0) {
                                    $scope.markForComp(k, i);
                                    return true;
                                }
                            }
                        }
                    }

                }
                count1 = 0;
                count2 = 0;
            }
            for (i = 0; i < 3; i++) //checks cross
            {
                if ($scope.tile[i][i].id === playerId){
                    if (++count1 === 2){
                        for (k = 0; k < 3; k++) {
                            if ($scope.tile[k][k].id === 0) {
                                $scope.markForComp(k, k);
                                return true;
                            }
                        }
                    }
                }

                if ($scope.tile[i][(2 - i)].id === playerId){

                    if (++count2 === 2){
                    for (k = 0; k < 3; k++) {
                        if ($scope.tile[k][(2 - k)].id === 0) {
                            $scope.markForComp(k, (2 - k));
                            return true;
                        }
                    }
                }
             }
            }
            return false;
        };

        //check for the possibility of winning across rows/ columns or cross and mark the board
        $scope.offendPlay = function() {
            return markwithRespectToPlayer(2); // computer player id is :2
        };
  
        //defends player form forming line if there are already two marks in it.
        // return true if changed
        $scope.defendPlay = function() {
            return markwithRespectToPlayer(1); // user player  id  is :1
        };

        //computer makes a random move
        $scope.randomPlay = function() {
            var random1, random2;
            var a = true;
            do {
                random1 = Math.floor(Math.random() * 3);
                random2 = Math.floor(Math.random() * 3);

                if ($scope.tile[random1][random2].id !== 1 && $scope.tile[random1][random2].id !== 2) {
                    $scope.markForComp(random1, random2);
                    $scope.progress++;
                    a = false;
                }
            } while (a);
        };

        //displays winner by calling checkwinner() and checking progress
        $scope.displayWinner = function() {
            if ($scope.checkWinner() === 1) {
                $scope.resultImg = "../../app/tictactoe/images/winner.png";
                $scope.result = "You WIN!!:)";
                $scope.countUser = $scope.countUser + 1;
            } else if ($scope.checkWinner() === 2) {
                $scope.resultImg = "../../app/tictactoe/images/loser.png";
                $scope.countComputer = $scope.countComputer + 1;
                $scope.result = "You LOOSE!!:P";
            } else if ($scope.progress >= 9) {
                $scope.resultImg = "../../app/tictactoe/images/draw.png";
                $scope.result = "DRAW!";
                $scope.countDraw = $scope.countDraw + 1;
            }
        };

        //Returns who is winner or no winner- 1 for X & 2 for O
        $scope.checkWinner = function() {
            for (var v = 1; v <= 2; v++) {
                for (var i = 0; i < 3; i++) {
                    if (($scope.tile[i][0].id === v) &&
                        ($scope.tile[i][1].id === v) &&
                        ($scope.tile[i][2].id === v)){
                        return v;
                    }
                }
                for (i = 0; i < 3; i++) {
                    if (($scope.tile[0][i].id === v) && ($scope.tile[1][i].id === v) && ($scope.tile[2][i].id === v)){
                        return v;
                    }
                    if (($scope.tile[0][0].id === v) && ($scope.tile[1][1].id === v) && ($scope.tile[2][2].id === v)){
                        return v;
                    }
                    if (($scope.tile[0][2].id === v) && ($scope.tile[1][1].id === v) && ($scope.tile[2][0].id === v)){
                        return v;
                    }
                }
            }
            return 0;
        };

        $scope.reset();


    }];

    return {
        restrict: 'E',
        templateUrl: 'app/tictactoe/overview.html',
        controller: directiveController
    };
}]);
