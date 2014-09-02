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
	this.lastErrorMsg = "";

    function isSameJob(configItemA, configItemB) {
        var isEqual = true;
        isEqual &= configItemA.jenkinsUrl === configItemB.jenkinsUrl;
        isEqual &= configItemA.selectedView === configItemB.selectedView;
        isEqual &= configItemA.selectedJob === configItemB.selectedJob;
        return isEqual;
    }

    this.isItemInConfigItems = function(item) {
        for(var i = 0; i < this.configItems.length; i++) {
            var nextConfigItem = this.configItems[i];

            if(isSameJob(item, nextConfigItem)) {
                return true;
            }
        }
        return false;
    };

    this.addConfigItem = function(item){
        if(!this.isItemInConfigItems(item)) {
            this.configItems.push(item);
        }
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
