angular.module('bridge.app').downloadController = function ($scope, $modalInstance) {
    
    function getOS()
    {
    	var OSName="Unknown";
        if (navigator.appVersion.indexOf("Win")!=-1) return "Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1) return "Mac";
        if (navigator.appVersion.indexOf("X11")!=-1) return "UNIX";
        if (navigator.appVersion.indexOf("Linux")!=-1) return "Linux";
        return OSName;
    };

    $scope.os = getOS();
    if($scope.os == "Windows" || $scope.os == "Mac")
    {
    	$scope.os_supported = true;
    }
    else
    {
    	$scope.os_supported = false;
    }

    if($scope.os == "Mac")
    {
    	$scope.download_url = "https://github.wdf.sap.corp/pages/bridge/bridge-mac/Bridge.app.zip";
    }

    if($scope.os == "Windows")
    {
    	$scope.download_url = "https://github.wdf.sap.corp/pages/bridge/bridge-win/setup.zip";
    }

    $scope.download = function () {
        $modalInstance.close();
        window.location.href = $scope.download_url;
    };

    $scope.close = function () {    
    	$modalInstance.close();      	
  };
};