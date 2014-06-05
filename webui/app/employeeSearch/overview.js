angular.module('app.employeeSearch', ['bridge.employeeSearch']);

angular.module('app.employeeSearch').directive('app.employeeSearch', function () {

    var directiveController = ['$scope', function ($scope) {        
        $scope.box.boxSize = "2";        
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeSearch/overview.html',
        controller: directiveController
    };
});



$(document).ready(function()
{

	var t1 = false;
	var e = false;
	var t2 = false;
	var r = false;
	var i = false;
	var s = false;
    $(document).keypress(function(e) {

        if (e.which == 84 )
        {
        	t1 = true;
        }
        else if (e.which == 101 )
        {
        	e = true;
        }
        else if (e.which == 116 )
        {
        	t2 = true;
        }
        else if (e.which == 114 )
        {
        	r = true;
        }
        else if (e.which == 105 )
        {
        	i = true;
        }
        else if (e.which == 115 &&  t1 && e && t2 && r && i )
        {
           	alert("glueckwunsch, jetzt sollte tetris starten");  
           	t1 = false;
	 		e = false;
	 		t2 = false;
	 		r = false;
	 		i = false;
			s = false;
			
        }
         
 
    });
});