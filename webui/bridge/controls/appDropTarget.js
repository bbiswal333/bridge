angular.module('bridge.app').directive("bridge.appDropTarget", ["bridge.service.appCreator", "bridgeConfig", "bridgeDataService", "bridge.appDragInfo", "$window", function (appCreator, bridgeConfig, bridgeDataService, dragInfo, $window) {
	$.widget("ui.fixedSortable", $.ui.sortable, {
        _init: function () {
            this.element.data("sortable", this.element.data("fixedSortable"));
            return $.ui.sortable.prototype._init.apply(this, arguments);
        },
        _create:function() {
            var result = $.ui.sortable.prototype._create.apply(this, arguments);
            this.containerCache.sortable = this;
            return result;
        },
        _intersectsWithPointer: function () {
			var hitTest = $('.appDustBin').hitTestPoint({x: this.position.left, y: this.position.top + $window.scrollY});
			if(hitTest) {
				$('.appDustBinIcon').removeClass("grey-60");
				$('.appDustBinIcon').addClass("red-60");
	            if (this.element.hasClass("app-container")) {
	                return false;
	            }
			} else {
				$('.appDustBinIcon').addClass("grey-60");
				$('.appDustBinIcon').removeClass("red-60");
			}
            return $.ui.sortable.prototype._intersectsWithPointer.apply(this, arguments);
        },
        _intersectsWith: function(containerCache) {
            if (containerCache.sortable.element.hasClass("app-container") && $('.appDustBin').hitTestPoint({x: this.position.left, y: this.position.top + $window.scrollY})) {
                return false;
            }
            return $.ui.sortable.prototype._intersectsWith.apply(this, arguments);
        }
    });

	return {
		restrict: 'E',
		templateUrl: "bridge/controls/appDropTarget.html",
		transclude: true,
		replace: true,
		controller: function($scope, $element) {
			$($element).fixedSortable({
				placeholder: "sortable-placeholder",
		        forcePlaceholderSize: true,
		        cursorAt: {left: 0, top: 0},
		        delay: 150,
		        scroll: false,
		        tolerance: "pointer",
		        disabled: false,
		        handle: ".box-heading",
		        connectWith: ".appDropTarget",
		        start: function(event, ui) {
		            $('.sortable-item').addClass('zoomOut');
		            ui.item.removeClass('zoomOut');
		            $('.sortable-placeholder').addClass('zoomOut');
		            ui.item.css({marginTop:$window.scrollY + 'px'});
		            $scope.$apply(function() { dragInfo.appIsDragged = true; });
		        },
		        receive: function(event, dragInfo) {
		        	$('.sortable-item').removeClass('zoomOut');
		            $scope.$apply(function() { dragInfo.appIsDragged = false; });
		            if($(event.target).hasClass("appDustBin") && appCreator.hasInstanceWithId(dragInfo.item[0].id)) {
		                appCreator.removeInstanceById(dragInfo.item[0].id);
		                bridgeDataService.removeAppById(dragInfo.item[0].id);
		            }
		        },
		        stop: function (event, ui) {
		        	bridgeConfig.store(bridgeDataService);
		            $('.sortable-item').removeClass('zoomOut');
		            ui.item.css({marginTop:'0px'});
		            $scope.$apply(function() { dragInfo.appIsDragged = false; });
		        },
		        deactivate: function () {
		            $('.sortable-item').removeClass('zoomOut');
		            $scope.$apply(function() { dragInfo.appIsDragged = false; });
		        }
			});
		}
	};
}]).service("bridge.appDragInfo", function() {
	this.appIsDragged = false;
});
