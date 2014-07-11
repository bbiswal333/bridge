angular.module('bridge.app').service('sortableConfig', function () {
    this.sortableOptions = {
        // forceHelperSize: true,
        //helper: "clone",
        placeholder: "sortable-placeholder",
        forcePlaceholderSize: true,
        delay: 150,
        scroll: false,
        tolerance: "pointer",
        disabled: true,
        update: function () {
        },
        stop: function () {
        }
    };
});