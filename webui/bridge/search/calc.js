/**
 * Created by D062753 on 16.02.2015.
 */
angular.module('bridge.search').service('bridge.search.calc', ['$http', '$window', function ($http, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-calculator",
            name: "Calculator",
            defaultSelected: true
        };
    };

    this.findMatches = function(query, resultArray) {
        var success = true;
        var erg;



        try {
            math.eval(query);

        } catch (e) {
            if(e instanceof SyntaxError || e instanceof ReferenceError || e instanceof TypeError || e instanceof Error){
                erg = "NaN";
                success = false;

            }
        }

        if(success){
            erg = math.eval(query);
        }

        resultArray.push({title: '' + erg });


    };


    this.getCallbackFn = function() {
        return function(selectedItem) {

                $window.prompt("Copy result", "" + selectedItem.title);

            }
        };
}]);