(function () {

    //loader module with load service
    angular.module('loader', []);
    angular.module('loader').factory('loadservice', ["$http", "$location", "$log", "$window", function ($http, $location, $log, $window) {

        return {
            load: function () {
                $http.get('/api/modules').success(function (data)
                {

                    function fetchUserInfo(callback)
                    {
                        $http({
                            url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GET_MY_DATA?origin=' + encodeURIComponent($window.location.origin),
                            withCredentials: "true",
                            method: "GET"
                        }).success(function (data) {
                            callback(data.USERINFO.BNAME);
                        }).error(function(){

                        });
                    }

                    function instantiateSerachProviders(injector) {
                        if(!data.searchProviders) {
                            return;
                        }

                        var bridgeSearch, bridgeMobileSearch;
                        injector.invoke(['bridge.search', 'bridge.mobileSearch', function(search, mobileSearch) {
                            bridgeSearch = search;
                            bridgeMobileSearch = mobileSearch;
                        }]);

                        data.searchProviders.map(function(searchProvider) {
                            injector.invoke([searchProvider, function(searchProviderInstance){
                                bridgeSearch.addSearchProvider(searchProviderInstance);
                                bridgeMobileSearch.addSearchProvider(searchProviderInstance);
                            }]);
                        });
                    }

                    fetchUserInfo(function(user)
                    {

                        //get all modules
                        var modules = data.modules;
                        var apps = [];

                        for (var i = 0; i < data.app.length; i++) {
                            if (data.app[i].hasOwnProperty('module_name') && data.app[i].module_name !== undefined)
                            {

                                //either not a beta app, or current user in list of beta users
                                if(data.app[i].hasOwnProperty('beta_users') === false)
                                {
                                    modules.push(data.app[i].module_name);
                                    apps.push(data.app[i]);
                                }
                                else
                                {
                                     if(data.app[i].beta_users.indexOf(user) > -1)
                                     {
                                        modules.push(data.app[i].module_name);
                                        apps.push(data.app[i]);
                                     }
                                }
                            }
                        }

                        angular.module('bridge.service', ["ui.bootstrap.modal", "ui.bootstrap.tpls"]);
                        angular.module('bridge.service').provider("bridge.service.loader", function () {
                            this.apps = apps;
                            this.$get = function () { return this; };
                        });
                        angular.module('bridge.app', modules);

                        var loaded_script = 0;

                        //callback when js files are loaded
                        var script_loaded = function (combined) {
                            loaded_script = loaded_script + 1;

                            var number_of_files = data.js_files.length;
                            if (combined) {
                                number_of_files = 1;
                            }

                            if (loaded_script < number_of_files) {
                                return;
                            }

                            var injector = angular.bootstrap($window.document, ['bridge.app']);
                            instantiateSerachProviders(injector);
                        };

                        function load_scripts(array, callback) {

                            function loader(src, handler) {
                                var script = $window.document.createElement("script");

                                script.src = src;
                                script.onload = script.onreadystatechange = function () {
                                    // in IE, ready State must be "loaded" or "complete", in Chrome ready state is undefined and we do not have to take care of it
                                    if (script.readyState === undefined || script.readyState === 'loaded' || script.readyState === 'complete') {
                                        script.onreadystatechange = script.onload = null;
                                        // in IE 10 we need a delayed loading of the next resource, otherwise the execution order is messed up and we get angular injector errors ('module not found...')
                                        if (/MSIE ([0-9]+\.\d+);/.test($window.navigator.userAgent)) {
                                            $window.setTimeout(function () { handler(); }, 8, this);
                                        } else {
                                            handler();
                                        }
                                    }
                                };

                                var head = $window.document.getElementsByTagName("head")[0];
                                (head || $window.document.body).appendChild(script);
                            }
                            var loadNextScript = function () {
                                if (array.length !== 0) {
                                    loader(array.shift(), loadNextScript);
                                } else {
                                    callback();
                                }
                            };

                            loadNextScript();
                        }


                        function load_styles(array, callback) {
                            var loader = function (src, handler) {
                                var style = $window.document.createElement("link");
                                style.rel = "stylesheet";
                                style.type = "text/css";
                                style.href = src;
                                var head = $window.document.getElementsByTagName("head")[0];
                                (head || $window.document.body).appendChild(style);
                                handler();
                            };
                            function loadNextStyle() {
                                if (array.length !== 0) {
                                    loader(array.shift(), loadNextStyle);
                                } else {
                                    callback();
                                }
                            }

                            loadNextStyle();
                        }

                        if ($location.search().debug === "true") {

                            load_styles(data.css_files, function () { });
                            load_scripts(data.js_files, function () { script_loaded(false); });
                        }
                        else {
                            load_styles(["/api/modules?format=css"], function () { });
                            load_scripts(["/api/modules?format=js"], function () { script_loaded(true); });
                        }
                    });

                }).error(function () {
                    $log.log("modules could not be loaded");
                });
            }
        };

    }]);

    //when document is ready, run loader module, load service and remove loader module
    /*eslint-disable no-undef */
    var loadingContainer = document.createElement('div');
    /*eslint-enable no-undef */

    angular.module('loader').run(function (loadservice) {
        loadservice.load();
        //loadservice.load();
        // element.remove does not work in IE10, use jQuery remove instead
        $(loadingContainer).remove();
    });

/*eslint-disable no-undef */
    angular.element(document).ready(function () {
/*eslint-enable no-undef */
        angular.bootstrap(loadingContainer, ['loader']);
    });
})();
