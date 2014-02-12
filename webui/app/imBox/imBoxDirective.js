var imBoxApp = angular.module('imBoxApp', []);

imBoxApp.directive('imbox', function () {

    var directiveController = ['$scope', function ($scope) {
        $scope.boxTitle = "Internal Messages";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe05c;';


        $scope.settings = {
            templatePath: "app/imBox/imBoxSettingsTemplate.html",
            controller: undefined,
            id: $scope.boxId,

        
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/imBox/imBoxDirective.html',
        controller: directiveController
    };
});

    imBoxApp.run(function ($rootScope) {
    var i = 1;
});


imBoxApp.controller('imDirectiveController', ['$scope', '$http',
    function Controller($scope, $http) {

      


    
        $scope.$parent.titleExtension = " - Internal Messages";
        $scope.lastElement = ""; 
        $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });
        $http.get('http://localhost:8000/api/get?url=' + encodeURI('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS') + '&json=true'
       //   $http.get('http://localhost:8000/api/get?url=' + encodeURI('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?format=json')
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
                

                //Testing
               //console.log($scope.imData.INTAUTHACTION_LONG.length);
               //console.log($scope.imData.INTAUTHACTION_LONG[0].length);
               //console.log($scope.imData);
               //console.log($scope.imData.INTCOMPCOLLEAGUES_LONG[0].DEVDB_INTMESSAGE_OUT[0]);
                //console.log($scope.groesse[5]);


                /*********************************************************
               Ansatz**************************************************************
               if ( $scope.imData.INTAUTHACTION_LONG[0] !== "") {
                    
                   while ( i < $scope.imData.INTAUTHACTION_LONG[0].DEVDB_INTMESSAGE_OUT.length ) {
                        tempobject = ($scope.imData.INTAUTHACTION_LONG[0].DEVDB_INTMESSAGE_OUT[i]);
                        i++;
                   }

               }

               i = 0;
               if ( $scope.imData.INTCOMPCOLLEAGUES_LONG[0] !== "") {
                    
                   while ( i < $scope.imData.INTCOMPCOLLEAGUES_LONG[0].DEVDB_INTMESSAGE_OUT.length ) {
                        tempobject.push($scope.imData.INTCOMPCOLLEAGUES_LONG[0].DEVDB_INTMESSAGE_OUT[i]);
                        i++;
                   }

               }*********************************************************************/
               /***************************************************************
               Alle Meldungen in 1 Objekt packen *****************************/

               
    
              /* if ($scope.imData.INTAUTHACTION_LONG[0] !== "") {
                    
    
                        tempobject = ($scope.imData.INTAUTHACTION_LONG[0].DEVDB_INTMESSAGE_OUT);
                        i++;
                   

               }*/

             $scope.tempobject = [];
               if ($scope.imData.INTCOMP_LONG[0] !== "") {
                        var i = 0;
                                while (i<$scope.imData.INTCOMP_LONG[0].DEVDB_MESSAGE_OUT.length) {

                                $scope.tempobject.push($scope.imData.INTCOMP_LONG[0].DEVDB_MESSAGE_OUT[i]);
                                i++;
                            }
                            

                
               }
            /*
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

               //console.log($scope.tempobject);

                /*******************************************************************************************************************
                "View 1 Setter******************************************************************************************************/

                if(forlast == 0 ) {

                    //$scope.lastElement = "You have no internal messages to display!";
                                        
                }
                else {
                    /******************* Für die Textausgabe der Directive (momentan Auskommentiert)********************************/
                    /* 
                    $scope.lastElement = "You have internal messages (" + forlast + ")!"; 
                    $scope.ezero       = "All Messages (" + forlast + ").";         
                    $scope.eone        = "Selected Components (" + $scope.groesse[2] + ").";       
                    $scope.etwo        = "Assigned To Colleagues (" + $scope.groesse[1] + ")."; 
                    $scope.ethree      = "Assigned To Me (" + $scope.groesse[4] + ").";         
                    $scope.efour       = "Created By Me (" + $scope.groesse[3] + ")."; 

                    */         
                

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
                            $scope.priotwo= $scope.priotwo+1;
                        }
                        if ($scope.tempobject[i].PRIO[0] == 3) {
                            $scope.priothree= $scope.priothree+1;
                        }
                        if ($scope.tempobject[i].PRIO[0] == 4) {
                            $scope.priofour= $scope.priofour+1;
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

    // Falls keine Daten übergeben werden/keine Nachrichten verfügbar sind
    if ( ($scope.prioone + $scope.priotwo + $scope.priothree + $scope.priofour) == 0)
        $scope.lastElement="You have no internal messages to display!";
    
  
}


            $scope.$watch('imData', function () {
            updateimChart($scope);
            $scope.initialized = true;
        });

            
        
        } ] ) ;