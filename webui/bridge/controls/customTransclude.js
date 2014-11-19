angular.module('bridge.app').directive( 'customTransclude', function() {
    return {
        restrict: 'EAC',
        link: function( $scope, $element, $attrs, controller, $transclude ) {
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
                        $element.append( clone );
                    });
                    break;
                case 'parent':
                    $transclude( $scope, function( clone ) {
                        $element.empty();
                        $element.append( clone );
                    });
                    break;
                case 'child':
                    var iChildScope = $scope.$new();
                    $transclude( iChildScope, function( clone ) {
                        $element.empty();
                        $element.append( clone );
                        $element.on( '$destroy', function() {
                            iChildScope.$destroy();
                        });
                    });
                    break;
            }
        }
    };
});
