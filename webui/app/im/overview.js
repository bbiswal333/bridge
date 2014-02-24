angular.module('app.im', []);

angular.module('app.im').directive('app.im', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Internal Messages";
        $scope.initialized = true;
        $scope.settingsTitle = "Settings";
        $scope.boxIcon = '&#xe0d3;';

        $scope.settings = {
            templatePath: "im/settings.html",
            controller: undefined,
            id: $scope.boxId,      
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/im/overview.html',
        controller: directiveController
    };
});

    angular.module('app.im').run(function ($rootScope) {
});

angular.module('app.im').controller('app.im.directiveController', ['$scope', '$http',
    function Controller($scope, $http) {

        $scope.prioarr = [0,0,0,0];
        $scope.prionr = [1,2,3,4];
        $scope.disableChart = 0; 

        $scope.$parent.titleExtension = " - Internal Messages";
        $scope.lastElement = ""; 
        $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });
        $http.get('http://localhost:8000/api/get?url=' + encodeURI('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS') + '&json=true'
            ).success(function(data) {
                
                $scope.imData = data["asx:abap"];
                $scope.imData = $scope.imData["asx:values"];
                $scope.imData = $scope.imData[0];
                $scope.tempobject = [];
                
                if ($scope.imData.INTCOMP_LONG[0] !== "") {
                                _.each($scope.imData.INTCOMP_LONG[0].DEVDB_MESSAGE_OUT, function (n) {$scope.tempobject.push(n); });                  
                }

                    _.each($scope.tempobject, function (n) { 
                            _.each($scope.prionr, function (u,i) {
                                i = i + 1;
                                if(n.PRIO[0] == i)
                                    $scope.prioarr[i-1] ++;
                            });
                    });
                   
                    if ( ($scope.prioarr[0] + $scope.prioarr[1] + $scope.prioarr[2] + $scope.prioarr[3]) == 0) {
                        $scope.lastElement="You have no internal messages to display!"; 
                        $scope.disableChart = 1;
                    }


                $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });

            }).error(function(data) {
                $scope.imData = [];
                $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
            });
   
            var updateimChart = function ($scope) {
            var chart1 = {};
                 
        chart1.type = "PieChart";
        chart1.cssStyle = "height:150px; width:100%;";
        chart1.displayed = true;
    

    
    chart1.data = {
        "cols": [
            { id: "prio", label: "Priority", type: "string" },
            { id: "numberMessages", label: "Message(s)", type: "number" },
        ], "rows": [
            {
                c: [
                   { v: "Prio 1 (" + $scope.prioarr[0] + ")"},
                   { v: $scope.prioarr[0], f: $scope.prioarr[0] + " Messages" }
                ]
            },
            {
                c: [
                   { v: "Prio 2 (" + $scope.prioarr[1] + ")"},
                   { v: $scope.prioarr[1], f: $scope.prioarr[1] + " Messages" }
                ]
            },
            {
                c: [
                   { v: "Prio 3 (" + $scope.prioarr[2] + ")"},
                   { v:  $scope.prioarr[2], f: $scope.prioarr[2] + " Messages"  }
                ]
            },
            {
                c: [
                   { v: "Prio 4 (" + $scope.prioarr[3] + ")"},
                   { v:  $scope.prioarr[3], f: $scope.prioarr[3] + " Messages"  }
                ]
            }
    ]};

    chart1.options = {
        "title": "",
        "sliceVisibilityThreshold": 0,
        "colors": ['#097AC5', '#5CCCFF', '#AFE5FF', '#E6F7FF'],
        "pieHole": 0.75,
        "fill": 10,
        "displayExactValues": false,
    };


    chart1.formatters = {};
    $scope.imChart = chart1;

}
            

            $scope.$watch('imData', function () {
            updateimChart($scope);
            $scope.initialized = true;
        });          
        
        } ] ) ;
    
