angular.module('bridge.diagnosis').controller('bridge.diagnosis.statusController', ["$scope", "$http", function ($scope, $http) {

    $scope.status = {};

    var getLatestTag = function(callback)
    {
        $http.get('https://github.wdf.sap.corp/api/v3/repos/bridge/bridge/tags', {'withCredentials':false}).success(function (data)
        {
            var gitTags = data;
            var latest_tag = 'v0.0';

            for (var i = 0; i < gitTags.length; i++) {
                if (gitTags[i].name[1] > latest_tag[1] || (gitTags[i].name[1] === latest_tag[1] && parseInt(gitTags[i].name.substring(3)) > parseInt(latest_tag.substring(3)))) {
                    latest_tag = gitTags[i].name;
                }
            }
            return callback(latest_tag);                        
        });

    };

    var compareTagMaster = function(tag)
    {
        $http.get('https://github.wdf.sap.corp/api/v3/repos/bridge/bridge/compare/' + tag + '...master', {'withCredentials':false}).success(function (data)
        {
            var result = {};
            result.tag = tag;
            result.html_url = data.html_url;
            result.ahead_by = data.ahead_by;
            result.commits = data.commits;
                        
            $scope.status = result;
        });

    };

    getLatestTag(compareTagMaster);      
}]);
