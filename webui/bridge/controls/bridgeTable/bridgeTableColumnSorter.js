angular.module('bridge.controls').directive('bridge.tableColumnSorter', [function() {
    function getMetadataForColumn(sId, oMetadata) {
        var result;
        oMetadata.map(function(item) {
            if(item.id.toString() === sId) {
                result = item;
            }
        });
        return result;
    }

    function sortElements(children, columnMetadata) {
        children.sort(function(a, b) {
            var aMetadata = getMetadataForColumn(a.attributes["column-id"].value, columnMetadata);
            var bMetadata = getMetadataForColumn(b.attributes["column-id"].value, columnMetadata);
            var columnOrderA = (aMetadata && aMetadata.columnOrder !== undefined) ? parseInt(aMetadata.columnOrder) : 9999999;
            var columnOrderB = (bMetadata && bMetadata.columnOrder !== undefined) ? parseInt(bMetadata.columnOrder) : 9999999;

            if(columnOrderA > columnOrderB) {
                return 1;
            } else if(columnOrderA < columnOrderB) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    return {
        restrict: 'E',
        priority: 150000,
        link: function(scope, element) {
            var parent = element.parent();
            var columnsElements = element.children();
            sortElements(columnsElements, scope.columns);
            parent.empty();
            parent.append(columnsElements);
            scope.$watch('columns', function(newValue) {
                sortElements(columnsElements, newValue);
                parent.empty();
                parent.append(columnsElements);
            }, true);
        }
    };
}]);
