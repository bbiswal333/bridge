angular.module("app.querytracker").service("app.querytracker.queryData",
    ["$rootScope","$http", 'bridgeDataService', function($rootScope, $http, bridgeDataService){
        this.queryData = [];
        this.isInitialized = { value: false };

        function setDeadlineMarker(oData){
            var current_date = new Date();
            oData.forEach(function (query){
                var time_diff = Date.parse(query.Deadline) - current_date;
                var days_to_deadline = Math.ceil(time_diff / (1000 * 3600 * 24));
                if( days_to_deadline < 2)
                {
                    query.deadline_marker = true;

                }
                else
                {
                    query.deadline_marker = false;
                }

            });
        }

        this.getQueriesWithinDeadline = function(){
            return _.where(this.queryData, { "deadline_marker": true });
        };

        this.loadQueryData = function(){
            var userInfo = bridgeDataService.getUserInfo();
            $http.get('https://qtservices.pgdev.sap.corp/api/queries/answerer/' + userInfo.BNAME).success(function(data){
            //$http.get('https://qtservices.pgdev.sap.corp/api/queries/answerer/' + "I311164").success(function(data){ // users for testing: I311164, D050570
                if (angular.isArray(data)) {
                    setDeadlineMarker(data);
                    data.sort(function(a, b){
                        return new Date(a.Deadline) - new Date(b.Deadline);
                    });

                    this.queryData.length = 0;

                    data.forEach(function(dataItem){
                        this.queryData.push(dataItem);
                    }.bind(this));
                    this.isInitialized.value = true;
                }
            }.bind(this));
        };
    }]);
