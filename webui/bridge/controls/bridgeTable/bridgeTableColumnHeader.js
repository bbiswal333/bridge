angular.module('bridge.controls').directive('bridge.tableColumnHeader', [function() {
    function targetIsMovedAfterNext(target, next) {
        return next.position() && angular.element(target).position().left > next.position().left;
    }

    function targetIsMovedBeforePrevious(target, previous) {
        return previous.position() && angular.element(target).position().left < previous.position().left;
    }

    function getNextElement(target, element) {
        var nextElement = element.next();
        while(angular.element(target).position().left > nextElement.position().left && nextElement.next().length > 0 && angular.element(target).position().left > nextElement.next().position().left) {
            nextElement = nextElement.next();
        }
        return nextElement;
    }

    function getPreviousElement(target, element) {
        var prevElement = element.prev();
        while(angular.element(target).position().left < prevElement.position().left && prevElement.prev().length > 0 && angular.element(target).position().left < prevElement.prev().position().left) {
            prevElement = prevElement.prev();
        }
        return prevElement;
    }

    var previouslyAlteredElement;

    function resetPreviouslyAlteredElementBorder() {
        if(previouslyAlteredElement) {
            previouslyAlteredElement.css({"border-left": "", "border-right": ""});
        }
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'bridge/controls/bridgeTable/bridgeTableColumnHeader.html',
        link: function(scope, element) {
            element.draggable({
                axis: 'x',
                drag: function (event) {
                    resetPreviouslyAlteredElementBorder();

                    if(targetIsMovedAfterNext(event.target, element.next())) {
                        var nextElement = getNextElement(event.target, element);
                        nextElement.css({"border-right": "2px dotted #ff0000"});
                        previouslyAlteredElement = nextElement;
                    } else if(targetIsMovedBeforePrevious(event.target, element.prev())) {
                        var prevElement = getPreviousElement(event.target, element);
                        prevElement.css({"border-left": "2px dotted #ff0000"});
                        previouslyAlteredElement = prevElement;
                    }
                },
                stop: function (event) {
                    resetPreviouslyAlteredElementBorder();

                    if(targetIsMovedAfterNext(event.target, element.next())) {
                        var nextElement = getNextElement(event.target, element);
                        scope.$apply(function() {
                            angular.element(event.target).scope().column.columnOrder = nextElement.scope().column.columnOrder;
                            nextElement.scope().column.columnOrder--;
                        });
                    } else if(targetIsMovedBeforePrevious(event.target, element.prev())) {
                        var prevElement = getPreviousElement(event.target, element);
                        scope.$apply(function() {
                            angular.element(event.target).scope().column.columnOrder = prevElement.scope().column.columnOrder;
                            prevElement.scope().column.columnOrder++;
                        });
                    }
                    angular.element(event.target).css({left: 0});
                }
            });
        }
    };
}]);
