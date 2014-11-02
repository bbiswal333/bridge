angular.module("bridge.app").directive("bridge.mobileMenubar", [
    function() {
        return {
            restrict: "E",
            templateUrl: "bridge/mobileMenubar/MobileMenuBar.html",
            controller: function ($scope) {

                var $mobileMenuBarSearchfield = $('#mobileMenuBar-searchfield');

                $scope.openSearch = function() {
                    if(!$mobileMenuBarSearchfield.is(':visible')) {
                        $mobileMenuBarSearchfield.show('slide', {direction: 'left'}, 500, function() {
                            $('.bridge-mobileSearchInput').focus();
                        });
                        $('#cancel_search').fadeIn(300);
                        $('#bridge-mobileSearchOutput').fadeIn(300);
                    }
                };

                $scope.closeSearch = function() {
                    $('#cancel_search').fadeOut(300);
                    $mobileMenuBarSearchfield.hide('slide', {direction: 'left'}, 500);
                    $('#bridge-mobileSearchOutput').fadeOut(300);
                };

                $scope.clearSearch = function() {
                    $('.bridge-mobileSearchInput').val('');
                };
            }
        };
    }]);
