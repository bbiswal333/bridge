angular.module('bridge.app').service('sortableConfig', ["bridge.service.appCreator", function (appCreator) {
    var that = this;
    this.sortableOptions = {
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        delay: 150,
        scroll: false,
        tolerance: "pointer",
        disabled: false,
        handle: ".box-heading",
        connectWith: ".appDropTarget",
        start: function(event, ui) {
            $('.sortable-item').addClass('zoomOut');
            ui.item.removeClass('zoomOut');
            that.$scope.$apply(function() { that.$scope.appIsDragged = true; });
        },
        update: function (event, dragInfo) {
            $('.sortable-item').removeClass('zoomOut');
            that.$scope.$apply(function() { that.$scope.appIsDragged = false; });
            if(dragInfo.item.sortable.droptarget.hasClass("appDustBin") && appCreator.hasInstanceWithId(dragInfo.item[0].id)) {                
                appCreator.removeInstanceById(dragInfo.item[0].id);
            }
        },
        stop: function () {
            $('.sortable-item').removeClass('zoomOut');
            that.$scope.$apply(function() { that.$scope.appIsDragged = false; });
        },
        deactivate: function () {
            $('.sortable-item').removeClass('zoomOut');
            that.$scope.$apply(function() { that.$scope.appIsDragged = false; });
        }
    };
}]);
