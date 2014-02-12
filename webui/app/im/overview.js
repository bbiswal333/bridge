angular.module('app.im', []);

angular.module('app.im').directive('app.im', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Internal Messages";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;';


        $scope.settings = {
            templatePath: "app/im/imBoxSettingsTemplate.html",
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
    var i = 1;
});


angular.module('app.im').controller('app.im.directiveController', ['$scope', '$http',
    function Controller($scope, $http) {

      


    
        $scope.$parent.titleExtension = " - Internal Messages";
        $scope.lastElement = ""; 
        $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });
        $http.get('http://localhost:8000/api/get?url=' + encodeURI('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS') + '&json=true'
            ).success(function(data) {
                
                $scope.imData = data["asx:abap"];
                $scope.imData = $scope.imData["asx:values"];
                $scope.imData = $scope.imData[0];
                $scope.groesse = new Array();
                /************************************************************************************
                Daten für den ersten View **********************************************************/


                /*$scope.groesse[0] = parseInt($scope.imData.INTAUTHACTION_SHORT[0].PRIO1)        //?????
                        + parseInt($scope.imData.INTAUTHACTION_SHORT[0].PRIO2) 
                        + parseInt($scope.imData.INTAUTHACTION_SHORT[0].PRIO3) 
                        + parseInt($scope.imData.INTAUTHACTION_SHORT[0].PRIO4);

                $scope.groesse[1] = parseInt($scope.imData.INTCOMPCOLLEAGUES_SHORT[0].PRIO1) //Assigned to Colleagues
                        + parseInt($scope.imData.INTCOMPCOLLEAGUES_SHORT[0].PRIO2) 
                        + parseInt($scope.imData.INTCOMPCOLLEAGUES_SHORT[0].PRIO3) 
                        + parseInt($scope.imData.INTCOMPCOLLEAGUES_SHORT[0].PRIO4);

                * Priorität aller selected Component Messages wird ermittelt und gezählt (für Chart)
                    */
                $scope.groesse[2] = parseInt($scope.imData.INTCOMP_SHORT[0].PRIO1)          //Selected Comp
                        + parseInt($scope.imData.INTCOMP_SHORT[0].PRIO2) 
                        + parseInt($scope.imData.INTCOMP_SHORT[0].PRIO3) 
                        + parseInt($scope.imData.INTCOMP_SHORT[0].PRIO4);
                /*
                $scope.groesse[3] = parseInt($scope.imData.INTCREATED_SHORT[0].PRIO1)       //Created by me
                        + parseInt($scope.imData.INTCREATED_SHORT[0].PRIO2)
                        + parseInt($scope.imData.INTCREATED_SHORT[0].PRIO3) 
                        + parseInt($scope.imData.INTCREATED_SHORT[0].PRIO4);

                $scope.groesse[4] = parseInt($scope.imData.INTPERS_SHORT[0].PRIO1)          //personal Msg
                        + parseInt($scope.imData.INTPERS_SHORT[0].PRIO2) 
                        + parseInt($scope.imData.INTPERS_SHORT[0].PRIO3) 
                        + parseInt($scope.imData.INTPERS_SHORT[0].PRIO4);
                */
                $scope.groesse[5] = $scope.groesse[0] + $scope.groesse[1] + $scope.groesse[2] + $scope.groesse[3] + $scope.groesse[4];
               
                var forlast = $scope.groesse[5];
                

                 $scope.tempobject = [];
               if ($scope.imData.INTCOMP_LONG[0] !== "") {
                        var i = 0;
                                while (i<$scope.imData.INTCOMP_LONG[0].DEVDB_MESSAGE_OUT.length) {

                                $scope.tempobject.push($scope.imData.INTCOMP_LONG[0].DEVDB_MESSAGE_OUT[i]);
                                i++;
                            }
                            

                
               }
                /* Falls man alle Nachrichten in dem Chart nach Prio Sortiert angezeigt haben möchte --> einkommentieren
               if ($scope.imData.INTCOMPCOLLEAGUES_LONG[0] !== "") {
                        var i = 0;

                        while (i < $scope.imData.INTCOMPCOLLEAGUES_LONG[0].DEVDB_INTMESSAGE_OUT.length) {                                       
                                                                        
                            $scope.tempobject.push($scope.imData.INTCOMPCOLLEAGUES_LONG[0].DEVDB_INTMESSAGE_OUT[i]);
                            i++;

                        }
                        
               }

            
                 if($scope.imData.INTAUTHACTION_LONG[0] !== "") {
                        var i = 0;
                        while (i < $scope.imData.INTAUTHACTION_LONG[0].DEVDB_INTMESSAGE_OUT.length) {
                            $scope.tempobject.push($scope.imData.INTAUTHACTION_LONG[0].DEVDB_INTMESSAGE_OUT[i]);
                            i++;
                        }

               }

               if($scope.imData.INTCREATED_LONG[0] !== "") {
                        var i = 0;

                        while (i < $scope.imData.INTCREATED_LONG[0].DEVDB_INTMESSAGE_OUT.length)    {
                            $scope.tempobject.push($scope.imData.INTCREATED_LONG[0].DEVDB_INTMESSAGE_OUT[i]);
                            i++;
                        }
               }
                

               
                */
                /*******************************************************************************************************************
                "View 1 Setter******************************************************************************************************/

            
                if ( ($scope.prioone + $scope.priotwo + $scope.priothree + $scope.priofour) == 0) {
                     $scope.lastElement="You have no internal messages to display!";
                                        
                }
                else {

                /**********************************************************************************************************************
                *GoogleChart Setter***************************************************************************************************/
                
                    var i = 0;
                    $scope.prioone = 0;
                    $scope.priotwo = 0;
                    $scope.priothree = 0;
                    $scope.priofour = 0;

                    while ( i < $scope.tempobject.length ) {
                
                        if ($scope.tempobject[i].PRIO[0] == 1) {
                            $scope.prioone = $scope.prioone+1;
                        }
                        if ($scope.tempobject[i].PRIO[0] == 2) {
                            $scope.priotwo = $scope.priotwo+1;
                        }
                        if ($scope.tempobject[i].PRIO[0] == 3) {
                            $scope.priothree = $scope.priothree+1;
                        }
                        if ($scope.tempobject[i].PRIO[0] == 4) {
                            $scope.priofour = $scope.priofour+1;
                        }
                        i++;
                    }

                }
                
                $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });

            }).error(function(data) {
                $scope.imData = [];
                $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
            });

            var updateimChart = function ($scope) {
            var chart1 = {};


    chart1.type = "PieChart";
    chart1.displayed = true;
    chart1.cssStyle = "height:150px; width:100%;";
    chart1.data = {
        "cols": [
            { id: "prio", label: "Priority", type: "string" },
            { id: "numberMessages", label: "Message(s)", type: "number" },
        ], "rows": [
            {
                c: [
                   { v: "Prio 1 (" + $scope.prioone + ")"},
                   { v: $scope.prioone, f: $scope.prioone + " Messages" }
                ]
            },
            {
                c: [
                   { v: "Prio 2 (" + $scope.priotwo + ")"},
                   { v: $scope.priotwo, f: $scope.priotwo + " Messages" }
                ]
            },
            {
                c: [
                   { v: "Prio 3 (" + $scope.priothree + ")"},
                   { v:  $scope.priothree, f: $scope.priothree + " Messages"  }
                ]
            },
            {
                c: [
                   { v: "Prio 4 (" + $scope.priofour + ")"},
                   { v:  $scope.priofour, f: $scope.priofour + " Messages"  }
                ]
            }
    ]};
    

    chart1.options = {
        "title": "",
        "sliceVisibilityThreshold": 0,
        "colors": ['#FF0000', '#FF9900', '#FFFF33', '#00FF00'],
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