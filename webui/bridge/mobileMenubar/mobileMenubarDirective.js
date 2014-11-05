'use strict';

angular.module("bridge.app").directive("bridge.mobileMenubar", [
    function() {
        return {
            restrict: "E",
            templateUrl: "bridge/mobileMenubar/MobileMenuBar.html",
            controller: function ($scope, $rootScope) {

                var menuBarIcons = [$('#feedbackResult'), $('#weatherResult')];
                var $mobileMenuBarSearchfield = $('#mobileMenuBar-searchfield');

                $scope.openSearch = function() {
                    if(!$mobileMenuBarSearchfield.is(':visible')) {

                        slideUpIcons();

                        $mobileMenuBarSearchfield.show('slide', {direction: 'left'}, 500, function() {
                            $('.bridge-mobileSearchInput').focus();
                        });
                        $('.mobileIcons').fadeOut(200, function() {
                            $('#cancel_search').fadeIn(300);
                        });
                        $('#bridge-mobileSearchOutput').fadeIn(300);
                    }
                };

                $scope.closeSearch = function() {
                    $('#cancel_search').fadeOut(300, function() {
                        $('.mobileIcons').fadeIn(200);
                    });
                    $mobileMenuBarSearchfield.hide('slide', {direction: 'left'}, 500);
                    $('#bridge-mobileSearchOutput').fadeOut(300);
                };

                $scope.clearSearch = function() {
                    $('.bridge-mobileSearchInput').val('');
                };

                $scope.showFeedback = function() {
                    toggleIcon('#feedbackResult');
                };

                $scope.showWeather = function() {
                    toggleIcon('#weatherResult');
                };

                $scope.showNotifications = function() {
                    toggleIcon('#notificationsResult');
                };

                function toggleIcon(except) {
                    var $iconResult = $('.iconResult');
                    var count = $iconResult.length - 1;
                    var i = 0;
                    $iconResult.not(except).slideUp(300, function() {
                        i++;
                        if(count === i) {
                            $(except).slideToggle(300);
                        }
                    });
                }

                function slideUpIcons() {
                    $('.iconResult').slideUp(300);
                }

                $rootScope.hideIcons = function() {
                    slideUpIcons();
                };

            }
        };
    }]);