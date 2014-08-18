angular.module('app.jenkins').service("app.jenkins.configservice", function () {

	this.configItem = {
		jenkinsUrl : 'http://veecfseqos016:8080/jenkins/',
		view: 'testView',
		job: 'testJob',
		language : 'de',
		boxSize : '2',
		checkboxJobs: {},
		checkBoxViews: {},
		jobsByView: [],
		jobs: [],
		views: []
	};

});
