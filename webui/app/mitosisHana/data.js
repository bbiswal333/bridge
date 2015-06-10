angular.module('app.mitosisHana').service('app.mitosisHana.dataService',["$http", "$window","app.mitosisHana.configService" , function ($http,$window,mitosisHanaConfig) {

	var that = this;
    this.availableContents = [];
	this.contentToDisplay = {
        red: [],
        yellow: [],
        green: []
    };
    this.content = [];
    this.contentDetails = [];
    this.statusCount = {
        red : 0,
        yellow : 0,
        green : 0
    };
    this.numberOfContents = 0;
	this.isInitialized = {value: false};

	this.getJobsToDisplay = function(){
		return that.contentToDisplay;
	};

	this.getAvailableContents = function () {
        var promise = $http.get('https://ld2025.wdf.sap.corp/irep/reporting/bridge/mitosisContentStatus.xsodata/Items?$format=json&$filter=SUB_CONTENT eq \'ALL\'&origin=' + $window.location.origin)
    		.success(function (data) {
                data = that.insertStatusIcon(data);
                that.content = data.d.results;
                that.updateContentToDisplay();
                mitosisHanaConfig.lastDataUpdate = new Date();
        });
        return promise;
    };

    this.getContentDetails = function (content) {
        that.contentDetails = [];
        var promise = $http.get('https://ld2025.wdf.sap.corp/irep/reporting/bridge/mitosisContentStatus.xsodata/Items?$format=json&$filter=CONTENT eq \'' + content + '\'&$orderby=RANK desc&origin=' + $window.location.origin)
            .success(function (data) {
                data = that.insertStatusIcon(data);
                that.contentDetails = data.d.results;
        });
        return promise;
    };


    this.insertStatusIcon = function (data){
        for (var i = 0; i < data.d.results.length; i++) {
                    if(data.d.results[i].STATUS === 'RED'){
                        data.d.results[i].statusIcon = 'fa-exclamation';
                    }
                    else if(data.d.results[i].STATUS === 'GREEN'){
                        data.d.results[i].statusIcon = 'fa-check';
                    }
                    else if(data.d.results[i].STATUS === 'YELLOW'){
                        data.d.results[i].statusIcon = 'fa-circle-o';
                    }
                }
        return data;
    };

    this.updateContentToDisplay = function(){
        var data = that.content;
        var config = mitosisHanaConfig.values.content;
        that.contentToDisplay = {
            red: [],
            yellow: [],
            green: []
        };
        that.statusCount = {
            red : 0,
            yellow : 0,
            green : 0
        };
        that.numberOfContents = data.length;
        that.availableContents = [];
        for(var content in data) {
                that.availableContents.push(data[content]);
                if(config[data[content].CONTENT] && config[data[content].CONTENT].active === 1){
                    if(data[content].STATUS === "RED") {
                        that.statusCount.red += 1;
                        that.contentToDisplay.red.push(data[content]);
                    } else if(data[content].STATUS === "YELLOW") {
                       that.statusCount.yellow += 1;
                       that.contentToDisplay.yellow.push(data[content]);
                    } else if(data[content].STATUS === "GREEN") {
                       that.statusCount.green += 1;
                       that.contentToDisplay.green.push(data[content]);
                    }
                }
            }
    };


    this.initialize = function (sAppIdentifier) {
            this.sAppIdentifier = sAppIdentifier;

            var loadContentPromise = this.getAvailableContents();
            loadContentPromise.then(function success() {
                that.isInitialized.value = true;
            });

            return loadContentPromise;
        };
}]);
