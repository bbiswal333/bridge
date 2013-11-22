'use strict';

/* Services */

var dashboardServices = angular.module('atcServices', ['ngResource']);

dashboardServices.factory('Config', [
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

dashboardServices.factory('ATCDataProvider', ['$http',
   function ($http) {
       return new ATCDataProvider($http);
   }]);

dashboardServices.factory('FindEmployee', ['$resource',
   function ($resource) {
       //return $resource('https://ifd.wdf.sap.corp/sap/bc/abapcq/user_data_json', {}, { query: { method: 'GET', cache: true, params: { search: "" }, isArray: false } });
   }]);