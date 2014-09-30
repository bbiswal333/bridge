angular.module('bridge.app').service('sortableConfig', function () {
    this.sortableOptions = {
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        delay: 150,
        scroll: false,
        tolerance: "pointer",
        disabled: false,
        handle: ".box-heading",
        start: function(event, ui) {
            //$('.sortable-list').addClass('zoomOut');
            $('.sortable-item').addClass('zoomOut');
            ui.item.removeClass('zoomOut');
            //ui.item.addClass('zoomIn');
        },
        update: function () {
            $('.sortable-item').removeClass('zoomOut');
            //$('.sortable-list').removeClass('zoomOut');
        },
        stop: function () {
            $('.sortable-item').removeClass('zoomOut');
            //$('.sortable-list').removeClass('zoomOut');
        },
        deactivate: function () {
            $('.sortable-item').removeClass('zoomOut');
            //$('.sortable-list').removeClass('zoomOut');
        }
    };
});
