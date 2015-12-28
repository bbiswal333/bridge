/**
 * Created by D062653 on 25.08.2015.
 */
angular.module('bridge.app').controller('bridge.LikesCtrl',['bridgeDataService', '$scope',
	function (bridgeDataService, $scope) {
    var userInfo = bridgeDataService.getUserInfo().BNAME;
    /*eslint-disable no-undef */
    if (typeof likes !== 'undefined') {
        $scope.likesIsLoaded = true;
        likes.setUser(userInfo);
        likes.getLikes();
    }
    /*eslint-enable no-undef */
}]);
