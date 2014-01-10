var boxInstances = {};

var initializationInterval = setInterval(function () {
    var numberOfBoxInstances = 0;
    var numberOfBoxInstancesWhichDontNeedToBeInstantiated = 0;
    for (var box in boxInstances) {
        numberOfBoxInstances++;
        if (boxInstances[box].initializationTries > 50 || boxInstances[box].initialized == true) {
            numberOfBoxInstancesWhichDontNeedToBeInstantiated++;
            continue;
        }
        if (boxInstances[box].scope.loadData && boxInstances[box].dataLoadCalled != true) {
            boxInstances[box].scope.loadData();
            boxInstances[box].dataLoadCalled = true;
        } else {
            boxInstances[box].initializationTries++;
        }
    }

    if (numberOfBoxInstances == numberOfBoxInstancesWhichDontNeedToBeInstantiated && numberOfBoxInstances != 0) {
        clearInterval(initializationInterval);
        createRefreshInterval();
        hideLoadingAnimation();
    }
}, 100);

function hideLoadingAnimation() {
    window.setTimeout(function() { document.getElementById("loadingAnimation").style.opacity = 0.9; }, 50);
    window.setTimeout(function() { document.getElementById("loadingAnimation").style.opacity = 0.7; }, 100);
    window.setTimeout(function() { document.getElementById("loadingAnimation").style.opacity = 0.5; }, 150);
    window.setTimeout(function() { document.getElementById("loadingAnimation").style.opacity = 0.4; }, 200);
    window.setTimeout(function() { document.getElementById("loadingAnimation").style.opacity = 0.3; }, 250);
    window.setTimeout(function() { document.getElementById("loadingAnimation").style.opacity = 0.1; }, 300);
    window.setTimeout(function() { document.getElementById("loadingAnimation").parentNode.removeChild(document.getElementById("loadingAnimation")); }, 350);
}

function createRefreshInterval() {
    setInterval(function () {
        for (var box in boxInstances) {
            if (boxInstances[box].scope && boxInstances[box].scope.loadData) {
                boxInstances[box].scope.loadData();
            }
        }
    }, 5000);
}

bridgeApp.directive('box', function ($compile) {

    var directiveController = ['$scope', function ($scope) {}];

    return {
        restrict: 'E',
        templateUrl: 'control/box/BoxDirective.html',
        controller: directiveController,
        scope: true,
        link: function ($scope, $element, $attrs, $modelCtrl) {

            if ($attrs.id) {
                if (!boxInstances[$attrs.id]) {
                    boxInstances[$attrs.id] = {
                        scope: $scope,
                        initializationTries: 0,
                    };
                }
            }
            else {
                console.error("Box has no id!");
            }

            var newElement = $compile("<" + $attrs.content + "/>")($scope);
            $element.children().append(newElement);

            if ($attrs.id) {
                boxInstances[$attrs.id].element = newElement;
            }
        }
    };
});