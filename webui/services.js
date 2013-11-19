'use strict';

/* Services */

var atcServices = angular.module('atcServices', ['ngResource']);

atcServices.factory('Config', [
  function(){
	  var configItem = new ConfigItem();
	  configItem.srcSystem = "CI3";
	  configItem.displayPrio1 = true;
	  configItem.displayPrio2 = true;
	  configItem.displayPrio3 = true;
	  configItem.displayPrio4 = true;
	  
	  var config = new Config();
	  config.addConfigItem(configItem);
	  
	  return config;
  }]);

atcServices.factory('ATCDataProvider', ['$http',
   function ($http) {
       return new ATCDataProvider($http);
   }]);

atcServices.factory('FindEmployee', ['$resource',
   function ($resource) {
       return $resource('https://ifd.wdf.sap.corp/sap/bc/abapcq/user_data_json', {}, { query: { method: 'GET', cache: true, params: { search: "" }, isArray: false } });
   }]);