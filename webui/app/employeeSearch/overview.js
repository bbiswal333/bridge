angular.module('app.employeeSearch', ['bridge.employeeSearch']);

angular.module('app.employeeSearch').directive('app.employeeSearch', function ($modal, $http) {


    var directiveController = ['$scope', function ($scope) {        
        $scope.box.boxSize = "2"; 

	    $scope.copyClipboard = function(text)
		{
			$http.get(window.client.origin + '/api/client/copy?text=' + encodeURIComponent(text));		
		}


	var t1 = false;
	var e = false;
	var t2 = false;
	var r = false;
	var i = false;
	var s = false;

    $(document).keypress(function(e) {
  		//check T
        if (e.which == 84 ){
	 		t1 = true;
	 		console.log('t1 ' + t1);
        }
        else if (e.which == 84 && (e || t2 || r || i || s)){
	 		t1 = false;
	 		e = false;
	 		t2 = false;
	 		r = false;
	 		i = false;
			s = false;
			console.log('t1' + t1);
        }
  
		//check e
        else if (e.which == 101 && (t1) && (!t2 && !r && !i && !s)){
	 		e = true;
	 		console.log('e' + e);
        }
        else if (e.which == 101 && ((!t1) || (t2 || r || i || s))){
	 		t1 = false;
	 		e = false;
	 		t2 = false;
	 		r = false;
	 		i = false;
			s = false;
			console.log('e' + e);
        }


        //check t
        else if (e.which == 116 && (t1 && e) && (!r && !i && !s)){
	 		t2 = true;
	 		console.log('t2' + t2);
        }
        else if (e.which == 116 && ((!t1 || !e) || (r || i || s))){
	 		t1 = false;
	 		e = false;
	 		t2 = false;
	 		r = false;
	 		i = false;
			s = false;
			console.log('t2' + t2);
        }

        //check r
		 else if (e.which == 114 && (t1 && e && t2) && (!i && !s)){
	 		r = true;
	 		console.log('r' + r);
        }
        else if (e.which == 114 && ((!t1 || !e || !t2) || (i || s))){
	 		t1 = false;
	 		e = false;
	 		t2 = false;
	 		r = false;
	 		i = false;
			s = false;
			console.log('r' + r);
        }

        //check i
		else if (e.which == 105 && (t1 && e && t2 && r) && (!s)){
	 		i = true;
	 		console.log('i' + i);
        }
        else if (e.which == 105 && ((!t1 || !e || !t2 || !r) || (s))){
	 		t1 = false;
	 		e = false;
	 		t2 = false;
	 		r = false;
	 		i = false;
			s = false;
			console.log('i' + i);
        }

        //check i
		else if (e.which == 115 && (t1 && e && t2 && r && i)){
	 		s = true;
	 		console.log('s' + s);
        }
        else if (e.which == 115 && (!t1 || !e || !t2 || !r || !i) ){
	 		t1 = false;
	 		e = false;
	 		t2 = false;
	 		r = false;
	 		i = false;
			s = false;
			console.log('s' + s);
        };
        if(t1 && e && t2 && r && i && s){
		

        $scope.modalInstance = $modal.open({
                templateUrl: 'app/employeeSearch/funtime.html',
                windowClass: 'settings-dialog',
            });

	
		t1 = false;
	 	e = false;
	 	t2 = false;
	 	r = false;
	 	i = false;
		s = false;
	}
	
    });
            
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/employeeSearch/overview.html',
        controller: directiveController
    };
});



