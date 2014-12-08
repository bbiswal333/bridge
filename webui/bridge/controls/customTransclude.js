angular.module('bridge.app').directive( 'customTransclude', ["$tooltip", function($tooltip) {
    return {
        restrict: 'EAC',
        link: function( $scope, $element, $attrs, controller, $transclude ) {
            function addTextTooltip(parent, element, attrs) {
                if(attrs.addTextTooltip === "true") {
                    var tooltipScope = $tooltip(parent, {title: element.text(), trigger: "hover", placement: "bottom", container: "body"}).$scope;
                    tooltipScope.$on('tooltip.show.before', function() {
                        tooltipScope.title = element.text();
                    });
                }
            }

            if (!$transclude) {
                throw new Error('customTransclude, orphan',
                    'Illegal use of customTransclude directive in the template! ' +
                    'No parent directive that requires a transclusion found.');
            }

            var iScopeType = $attrs.customTransclude || 'sibling';

            switch ( iScopeType ) {
                case 'sibling':
                    $transclude( function( clone ) {
                        $element.empty();
                        addTextTooltip($element, clone, $attrs);
                        $element.append( clone );
                    });
                    break;
                case 'parent':
                    $transclude( $scope, function( clone ) {
                        $element.empty();
                        addTextTooltip($element, clone, $attrs);
                        $element.append( clone );
                    });
                    break;
                case 'child':
                    var iChildScope = $scope.$new();
                    $transclude( iChildScope, function( clone ) {
                        $element.empty();
                        addTextTooltip($element, clone, $attrs);
                        $element.append( clone );
                        $element.on( '$destroy', function() {
                            iChildScope.$destroy();
                        });
                    });
                    break;
            }
        }
    };
}]);
