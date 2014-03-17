angular.module('bridge.service').service('bridgeDownload', function ($http, $modal) {

    this.modalInstance = $modal.open({
        templateUrl: 'view/download.html',
        controller: angular.module('bridge.app').downloadController        
    });
});