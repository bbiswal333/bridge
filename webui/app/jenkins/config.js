angular.module('app.jenkins').service("app.jenkins.configservice", function () {

	this.configItem = {
		jenkinsUrl : 'http://veecfseqos016:8080/jenkins/',
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

	this.addConfigItem = function(item){
		this.configItems.push(item);
	};

	this.clear = function() {
		this.configItem.selectedView = "";
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
