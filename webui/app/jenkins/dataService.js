angular.module("app.jenkins").service("app.jenkins.dataService", ["$http", "$q", "$log", "notifier", "$window", function($http, $q, $log, notifier, $window) {

	var that = this;

	this.jobsToDisplay = [];

	this.jenkinsUrl = "";

	this.jenkinsData = {
		url: "",
		urlIsValid: false,
		view: "",
		job: "",
		views: [],
		viewsAreLoading: false,
		jobs: [],
		jobsForView: [],
		jobsAreLoading: false
	};

	this.initialize = function() {
		// do not initialize this.jenkinsData.url...
		this.jenkinsData.view = "";
		this.jenkinsData.job = "";
		this.jenkinsData.urlIsValid = false;
		this.jenkinsData.views = [];
		this.viewsAreLoading = false;
		this.viewsLoadError = false;
		this.jenkinsData.jobs = [];
		this.jenkinsData.jobsForView = [];
		this.jobsAreLoading = false;
		this.jobsLoadError = false;
	};
	this.initialize();

	function setJenkinsData(data) {
		if(data) {
			if(data.views) {
				that.jenkinsData.views = data.views;
			}
			if(data.jobs) {
				that.jenkinsData.jobs = data.jobs;
			}
		} else {
			this.initialize();
		}
	}

	this.setJenkinsUrl = function(url) {
		this.jenkinsUrl = url;
	};

	this.isValidUrl = function(value) {
		return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
	};

	this.isValidJenkinsUrl = function(jenkinsUrl) {
		if (that.jenkinsDiscoveryCanceler) {
			that.jenkinsDiscoveryCanceler.resolve();
			that.jenkinsDiscoveryCanceler = undefined;
		}
		var deferred = $q.defer();
		that.jenkinsData.urlIsValid = false;
		if(!that.isValidUrl(jenkinsUrl)) {
			that.initialize();
		} else {
			that.jenkinsDiscoveryCanceler = deferred;
			$http.get("/api/get?url=" + encodeURIComponent(jenkinsUrl + "/api/json?depth=1&tree=mode"), {withCredentials: false, timeout: deferred.promise})
			.success(function (data) {
				if(angular.isDefined(data.mode)) {
					that.jenkinsData.urlIsValid = true;
					that.getJenkinsViewsAndJobs(jenkinsUrl);
				} else {
					that.initialize();
				}
				that.jenkinsDiscoveryCanceler = undefined;
			}).error(function (){
				that.initialize();
				that.jenkinsDiscoveryCanceler = undefined;
			});
		}
	};

	this.isValidJob = function(jobName) {
		if (that.jenkinsData.view === undefined) {
			return false;
		} else if (this.jenkinsData.view === "") {
			var foundJob = _.find(that.jenkinsData.jobs, { "name":  jobName });
		} else {
			foundJob = _.find(that.jenkinsData.jobsForView, { "name":  jobName });
		}
		if (foundJob) {
			return true;
		} else {
			return false;
		}
	};

	this.isValidView = function(viewName) {
		var foundView = _.find(that.jenkinsData.views, { "name":  viewName });
		if (foundView) {
			return true;
		} else {
			return false;
		}
	};

	this.getJenkinsViewsAndJobs = function(jenkinsUrl){
		that.jenkinsData.viewsAreLoading = true;
		that.jenkinsData.jobsAreLoading = true;
		that.jenkinsData.viewsLoadError = false;
		that.jenkinsData.jobsLoadError = false;
		$http.get("/api/get?url=" + encodeURIComponent(jenkinsUrl + "/api/json?depth=1&tree=views[name,url],jobs[name,url,color]"), {withCredentials: false, timeout: 15000})
		.success(function (data) {
			if(angular.isDefined(data)) {
				setJenkinsData(data);
			} else {
				that.jenkinsData.viewsLoadError = true;
				that.jenkinsData.jobsLoadError = true;
			}
			that.jenkinsData.viewsAreLoading = false;
			that.jenkinsData.jobsAreLoading = false;
		}).error(function (){
			that.jenkinsData.viewsAreLoading = false;
			that.jenkinsData.jobsAreLoading = false;
			that.jenkinsData.viewsLoadError = true;
			that.jenkinsData.jobsLoadError = true;
		});
	};

	this.getJenkinsJobsForView = function(jenkinsUrl, viewName){
		var deferred = $q.defer();
		var url = jenkinsUrl + "/view/" + viewName + "/";
		if(jenkinsUrl && viewName && this.isValidUrl(url) ) {
			$http.get("/api/get?url=" + encodeURIComponent(url + "/api/json"), {withCredentials: false, timeout: 10000})
			.success(function (data) {
				if(angular.isDefined(data.jobs)) {
					deferred.resolve(data.jobs);
				} else {
					deferred.reject();
				}
			}).error(function (){
				deferred.reject();
			});
		} else {
			deferred.reject();
		}
		return deferred.promise;
	};


	this.getJenkinsJobsForCurrentView = function(){
		that.jenkinsData.jobsAreLoading = true;
		that.jenkinsData.jobsLoadError = false;
		that.jenkinsData.jobsForView = [];

		var view = _.find(this.jenkinsData.views, { "name":  this.jenkinsData.view });
		if(view && view.url && this.isValidUrl(view.url) ) {
			$http.get("/api/get?url=" + encodeURIComponent(view.url + "/api/json"), {withCredentials: false, timeout: 10000})
			.success(function (data) {
				if(angular.isDefined(data.jobs)) {
					that.jenkinsData.jobsForView = data.jobs;
				} else {
					that.jenkinsData.jobsForView = [];
				}
				that.jenkinsData.jobsAreLoading = false;
			}).error(function (){
				that.jenkinsData.jobsAreLoading = false;
				that.jenkinsData.jobsLoadError = true;
			});
		} else {
			that.jenkinsData.jobsAreLoading = false;
		}
	};

	var formatTimestamp = function(timestamp) {
		return $.timeago(timestamp);
	};

	function getLastBuildTimestamp(job) {
		$http.get("/api/get?url=" + encodeURIComponent(job.jenkinsUrl + "/job/" + job.name + "/lastBuild/api/json?depth=1&tree=timestamp"), {withCredentials: false, timeout: 10000})
		.success(function (data) {
			job.timestamp = formatTimestamp(data.timestamp);
			job.lastBuild = data.timestamp;
		}).error(function (data, status){
			job.timestamp = "unknown";
			$log.log("Could not GET last build info for job" + job.name + ", status: " + status);
		});
	}

	function updateJob(job) {
		var deferred = $q.defer();
		job.name = job.selectedJob;
		job.url = job.jenkinsUrl + "/job/" + job.name;
		job.lastbuildUrl = job.jenkinsUrl + "/job/" + job.name + "/lastBuild";
		getLastBuildTimestamp(job);

		$http.get("/api/get?url=" + encodeURIComponent(job.url + "/api/json?depth=1&tree=color,lastCompletedBuild[number,url],lastFailedBuild[number,url]"), {withCredentials: false, timeout: 10000})
		.success(function (data) {
			var color = data.color;
			job.color = (color === "notbuilt") ? "grey" : color;
			job.statusColor = "status" + color;
			if(color === "red"){
				job.statusIcon = "fa-times";
				job.statusInfo = "Failed";
			}else if(color === "yellow"){
				job.statusIcon = "fa-circle";
				job.statusInfo = "Unstable";
			}else if(color === "blue" || color === "green"){
				job.statusIcon = "fa-check";
				job.statusInfo = "Success";
			}else if(color === "blue_anime" || color === "green_anime" || color === "red_anime" || color === "yellow_anime"){
				job.statusIcon = "fa-circle-o-notch fa-spin";
				job.statusInfo = "Running";
			}else{
				job.statusIcon = "fa-question";
			}

			// If alert flag set for job, and if last completed build failed, and that failure hasn't been reported yet (avoid duplicate notifications of same failure) - then notify
			if (job.bAlertOnFail && data.lastCompletedBuild && data.lastFailedBuild && data.lastCompletedBuild.number === data.lastFailedBuild.number && job.lastFailureReported !== data.lastFailedBuild.number) {
				// Update last reported failure
				job.lastFailureReported = data.lastFailedBuild.number;
				// Notify build failure. Open failed jenkins build in new tab on notification click
				notifier.showInfo('Jenkins Build Failed','Last build [Build #' + data.lastFailedBuild.number + '] of job "' + job.name + '" failed.','app.jenkins', function() {
					$window.open(data.lastFailedBuild.url, '_blank');
				});
			}

			deferred.resolve();
		}).error(function(data,status) {
			$log.log("Could not GET job " + job.name + ", status: " + status);
			deferred.reject();
		});
		return deferred.promise;
	}

	this.updateJobs = function() {
		var promisses = [];
		for(var jobIndex in that.jobsToDisplay) {
			promisses.push(updateJob(that.jobsToDisplay[jobIndex]));
		}
		return $q.all(promisses);
	};
}]);
