/**
 * Created by D062653 on 25.08.2015.
 */
angular.module('bridge.app').controller('bridge.LikesCtrl',['bridgeDataService' ,function (bridgeDataService) {
    var userInfo = bridgeDataService.getUserInfo().BNAME;
    /*eslint-disable no-undef */
    likes.setUser(userInfo);
    likes.getLikes();
    /*eslint-enable no-undef */
}]);
