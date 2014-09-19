angular.module('app.jenkins').service("app.jenkins.dataService", ["$http", function($http){

	var jenkinsDataCache = null;
	this.jenkinsData = {
		views: [],
		jobs: []
	};
	this.hasViewData = false;
	this.hasJobData = false;
	var that = this;

	function initialize() {
		jenkinsDataCache = null;
		this.jenkinsData = {
			views: [],
			jobs: []
		};
		this.hasViewData = false;
		this.hasJobData = false;
	}
	initialize();

	function setJenkinsData(data) {
		if(data) {
			if(data.views) {
				that.hasViewData = true;
				that.jenkinsData.views = data.views;
			}
			if(data.jobs) {
				that.hasJobData  = true;
				that.jenkinsData.jobs = data.jobs;
			}
		} else {
			initialize();
		}
	}

	// http://vecrmhybrisi2.dhcp.wdf.sap.corp:8080/jenkins/api/json?depth=1&tree=views[name,url]
	this.getJenkinsViews = function(jenkinsUrl){
		if(!jenkinsDataCache) {
			//$http.get('/api/get?url=' + encodeURIComponent(jenkinsUrl + "/api/json?depth=1&tree=views[name,url]"), {withCredentials: false})
			$http.get('/api/get?url=' + encodeURIComponent(jenkinsUrl + "/api/json?depth=1&tree=views[name,url]"), {withCredentials: false})
				.success(function (data) {
					setJenkinsData(data);
				}).error(function() {
					initialize();
			});
		} else {
			setJenkinsData(jenkinsDataCache);
		}
	};

	this.getJenkinsJobs = function(jenkinsUrl){
		if(!jenkinsDataCache) {
			//$http.get('/api/get?url=' + encodeURIComponent(jenkinsUrl + "/api/json?depth=1&tree=jobs[name,url,color]"), {withCredentials: false})
			$http.get('/api/get?url=' + encodeURIComponent(jenkinsUrl + "/api/json?depth=1&tree=jobs[name,url,color]"), {withCredentials: false})
				.success(function (data) {
					setJenkinsData(data);
				}).error(function() {
					initialize();
			});
		} else {
			setJenkinsData(jenkinsDataCache);
		}
	};

	// http://vecrmhybrisi2.dhcp.wdf.sap.corp:8080/jenkins/view/Chameleon_53/api/json
	this.getJenkinsJobsForView = function(viewUrl){
		$http.get('/api/get?url=' + encodeURIComponent(viewUrl + "/api/json"), {withCredentials: false})
			.success(function (data) {
				if(data) {
					that.hasJobData = true;
				}
				that.jenkinsData.jobs = data.jobs;
			}).error(function() {
				that.hasJobData = false;
				that.jenkinsData.jobs = [];
		});
	};
}]);
