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
		require: '?ngModel',
		link: function(scope, element, attrs, ngModel) {
			var savedNodes;

			$(element).fixedSortable({
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
		            scope.$apply(function() { dragInfo.appIsDragged = true; });

					ui.item.sortable = {
						index: ui.item.index(),
						cancel: function () {
							ui.item.sortable._isCanceled = true;
						},
						isCanceled: function () {
							return ui.item.sortable._isCanceled;
						},
						_isCanceled: false
					};
		        },
		        activate: function(/*e, ui*/) {
					savedNodes = element.contents();

					var placeholder = element.fixedSortable('option','placeholder');
					if (placeholder && placeholder.element && typeof placeholder.element === 'function') {
						var phElement = placeholder.element();
						if (!phElement.jquery) {
							phElement = angular.element(phElement);
						}

						var excludes = element.find('[class="' + phElement.attr('class') + '"]');

						savedNodes = savedNodes.not(excludes);
					}
		        },
		        receive: function(event, dragInfo) {
		        	dragInfo.item.sortable.received = true;

		        	$('.sortable-item').removeClass('zoomOut');
		            scope.$apply(function() { dragInfo.appIsDragged = false; });
		            if($(event.target).hasClass("appDustBin") && appCreator.hasInstanceWithId(dragInfo.item[0].id)) {
		                appCreator.removeInstanceById(dragInfo.item[0].id);
		                bridgeDataService.removeAppById(dragInfo.item[0].id);
		            }
		        },
		        remove: function(e, ui) {
					if (!ui.item.sortable.isCanceled()) {
						scope.$apply(function () {
							ui.item.sortable.moved = ngModel.$modelValue.splice(
							ui.item.sortable.index, 1)[0];
						});
					}
		        },
		        stop: function (event, ui) {
		            $('.sortable-item').removeClass('zoomOut');
		            ui.item.css({marginTop:'0px'});
		            scope.$apply(function() { dragInfo.appIsDragged = false; });

					if(!ui.item.sortable.received && ('dropindex' in ui.item.sortable) && !ui.item.sortable.isCanceled()) {
						scope.$apply(function () {
							ngModel.$modelValue.splice(
							ui.item.sortable.dropindex, 0,
							ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]);
						});
					} else {
						if((!('dropindex' in ui.item.sortable) || ui.item.sortable.isCanceled()) && element.fixedSortable('option','helper') !== 'clone') {
							savedNodes.appendTo(element);
						}
					}

					$('.sortable-placeholder').remove();
		        },
		        update: function(e, ui) {
					if(!ui.item.sortable.received) {
						ui.item.sortable.dropindex = ui.item.index();
						ui.item.sortable.droptarget = ui.item.parent();

						element.fixedSortable('cancel');
					}

					if (element.fixedSortable('option','helper') === 'clone') {
						savedNodes = savedNodes.not(savedNodes.last());
					}
					savedNodes.appendTo(element);

					if(ui.item.sortable.received && !ui.item.sortable.isCanceled()) {
						scope.$apply(function () {
							ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0,
							ui.item.sortable.moved);
						});
					}

					bridgeConfig.store(bridgeDataService);
		        },
		        deactivate: function () {
		            $('.sortable-item').removeClass('zoomOut');
		            scope.$apply(function() { dragInfo.appIsDragged = false; });
		        }
			});
		}
	};
}]).service("bridge.appDragInfo", function() {
	this.appIsDragged = false;
});
