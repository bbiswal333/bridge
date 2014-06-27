//loader module with load service
angular.module('loader',[]);
angular.module('loader').factory('loadservice',["$http", "$location", function ($http, $location) {

  return{ 
    load: function()
    {      
      $http.get('/api/modules').success(function (data) {                      
        
        //get all modules
        modules = data.modules;
        for (var i = 0; i < data.app.length; i++)
        {          
          if( data.app[i]['module_name'] !== undefined )
          {
            modules.push(data.app[i]['module_name']);
          }
        };
        
        angular.module('bridge.service', ['ui.bootstrap']);
        angular.module('bridge.service').provider("bridge.service.loader", function()         
        {                    
          this.apps   = data.app;          
          this.$get = function() { return this; };
        });        
        angular.module('bridge.app', modules);  

        var loaded_script = 0;

        //callback when js files are loaded
        var script_loaded = function(combined)
        {
          loaded_script = loaded_script + 1;
          
          var number_of_files = data.js_files.length;
          if(combined) number_of_files = 1;

          if( loaded_script < number_of_files )
          {
            return;
          }

          angular.bootstrap(document, ['bridge.app']);
        }

        /*function uncachifyUrl(Url) {
          var resultUrl = Url + "?" + new Date().toISOString();
          if(Url.indexOf("?") >= 0) {
            resultUrl = Url + "&" + new Date().toISOString();
          }
          return resultUrl;
        }*/

        function load_scripts(array,callback)
        {  
          var loader = function(src,handler){  
              var script = document.createElement("script");  

              script.src = src;  
              script.onload = script.onreadystatechange = function () {
                  // in IE, ready State must be "loaded", in Chrome ready state is undefined and we do not have to take care of it
                  if (script.readyState == undefined || script.readyState == 'loaded') {
                      script.onreadystatechange = script.onload = null;
                      // in IE 10 we need a delayed loading of the next resource, otherwise the execution order is messed up and we get angular injector errors ('module not found...')
                      if (/MSIE ([0-9]+\.\d+);/.test(navigator.userAgent)) {
                          window.setTimeout(function () { handler(); }, 8, this);
                      }
                      else {
                          handler();
                      }
                  }
              }  
              var head = document.getElementsByTagName("head")[0];  
              (head || document.body).appendChild( script );  
          };  
          (function(){  
              if(array.length!=0){  
                      loader(array.shift(),arguments.callee);  
              }else{  
                      callback && callback();  
              }  
          })();  
        }  


       function load_styles(array,callback)
        {  
          var loader = function(src,handler){  
              var style = document.createElement("link");            
              style.rel = "stylesheet";
              style.type = "text/css";  
              style.href = src;                
              var head = document.getElementsByTagName("head")[0];  
              (head || document.body).appendChild( style ); 
              handler(); 
          };  
          (function(){  
              if(array.length!=0){  
                      loader(array.shift(),arguments.callee);  
              }else{  
                      callback && callback();  
              }  
          })();  
        } 
              
        if ($location.search().debug === "true")        
        {

          load_styles(data.css_files, function(){});
          load_scripts(data.js_files, function(){ script_loaded(false) });                                        
        }
        else
        {          
          load_styles(["/api/modules?format=css"], function(){});
          load_scripts(["/api/modules?format=js"], function(){ script_loaded(true) });                                                  
        }

        }).error(function(data, status, headers, config) {
          console.log("modules could not be loaded");       
        });
      }
  }

}]);

//when document is ready, run loader module, load service and remove loader module
var loadingContainer = document.createElement('div');

angular.module('loader').run(function (loadservice) { 
    loadservice.load();
    // element.remove does not work in IE10, use jQuery remove instead
    //loadingContainer.remove();  
  $(loadingContainer).remove();
});

angular.element(document).ready(function() {         
  angular.bootstrap(loadingContainer, ['loader']);
});
