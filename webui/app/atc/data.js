angular.module('app.atc').factory('app.atc.dataservice', ["$http", function ($http) {
    return {
        data: {
            prio1: 0,
            prio2: 0,
            prio3: 0,
            prio4: 0,
        },

        detailsData: [],

        getResultForConfig: function ($scope, config, dataService) {
            $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });

            var that = this;
            $http.get('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RES_CN?query=' + config.getQueryString() + '&count_prios=X&format=json&origin='+location.origin)
            .success(function (data) {

                that.data = {
                    prio1: data.PRIOS.PRIO1,
                    prio2: data.PRIOS.PRIO2,
                    prio3: data.PRIOS.PRIO3,
                    prio4: data.PRIOS.PRIO4,
                };
                $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
            });
        },

        getDetailsForConfig: function (config, $scope) {
            $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: true });

            var that = this;
            $http.get('https://ifp.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RESULT?query=' + config.getQueryString() + '&format=json&origin='+location.origin)
            .success(function (data) {

                //$scope.atcDetails = data.DATA;
                //that.detailsData.length = 0;
                //for (var i=0; i < data.DATA.length
                that.detailsData = data.DATA;

                $scope.$emit('changeLoadingStatusRequested', { showLoadingBar: false });
            });
        },
    };
}]);
