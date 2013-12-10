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

dashboardServices.factory('JiraQuery', [
    function (){
        return 'id in projectRankedIssues(I2MASEDEV) AND fixVersion in (2013_S24) order by "Project Rank" ASC, Key ASC';
    }]);

dashboardServices.factory('JiraDataProvider', ['$http',
   function ($http) {
       return new JiraDataProvider($http);
   }]);

dashboardServices.factory('ATCDataProvider', ['$http',
   function ($http) {
       return new ATCDataProvider($http);
   }]);

dashboardServices.factory('EmployeeSearch', ['$http',
   function ($http) {
       return new EmployeeSearch($http);
       //return $resource('https://ifd.wdf.sap.corp/sap/bc/zxa/find_employee_json', {}, { query: { method: 'GET', cache: true, params: { query: "", maxrow: "25" }, isArray: false } });
   }]);