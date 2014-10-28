angular.module('bridge.service').service('bridge.service.bridgeDownload', function ($modal) {
    return {
        show_download: function()
        {
            $modal.open({
                templateUrl: 'bridge/menubar/download/download.html',
                windowClass: 'download-dialog',
                controller: angular.module('bridge.app').downloadController
            });
        }
    };
});
