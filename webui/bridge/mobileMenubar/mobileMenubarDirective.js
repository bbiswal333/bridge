'use strict';

angular.module("bridge.app").directive("bridge.mobileMenubar", [
    function() {
        return {
            restrict: "E",
            templateUrl: "bridge/mobileMenubar/MobileMenuBar.html",
            controller: function ($scope) {

                var $mobileMenuBarSearchfield = $('#mobileMenuBar-searchfield');

                $scope.openSearch = function() {
                    if(!$mobileMenuBarSearchfield.is(':visible')) {
                        $mobileMenuBarSearchfield.show('slide', {direction: 'right'}, 500, function() {
                            $('.bridge-mobileSearchInput').focus();
                        });
                    }
                };

                $scope.closeSearch = function() {
                    $mobileMenuBarSearchfield.hide('slide', {direction: 'right'}, 500);
                };
            }
        };
    }]);