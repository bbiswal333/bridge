angular.module('app.jenkins').service("app.jenkins.configservice", function () {

	this.configItem = {
		jenkinsUrl : '',
		selectedView: '',
		selectedJob: '',
		language : 'de',
		boxSize : '2',
		checkboxJobs: {},
		checkBoxViews: {},
		jobsByView: [],
		jobs: [],
		views: []
	};

	this.configItems = [];

	this.couldReachJenkinsUrl = false;
	this.isPending = false;
	this.lastErrorMsg = "";

	this.addConfigItem = function(item){
		this.configItems.push(item);
	};

	this.clearViewAndJob = function() {
		this.configItem.selectedView = "";
		this.configItem.selectedJob = "";
	};

	this.clearView = function() {
		this.configItem.selectedJob = "";
	};

	this.getConfigItems = function() {
		return this.configItems;
	};

	this.isEmpty = function () {
		if (this.jenkinsUrl === "" && this.selectedView === "" && this.selectedJob === "") {
			return true;
		} else {
			return false;
		}
	};

});
