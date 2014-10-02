angular.module('app.jenkins').service("app.jenkins.configservice", function () {

	this.configItem = {
		jenkinsUrl : '',
		selectedView: '', // must be read dynamically?
		selectedJob: ''
		// language : 'de', // not needed anymore, to be cleared
		// boxSize : '2', // not needed anymore, to be cleared
		// checkboxJobs: {}, // not needed anymore, to be cleared
		// checkBoxViews: {}, // not needed anymore, to be cleared
		// jobsByView: [], // not needed anymore, to be cleared
		// jobs: [], // not needed anymore, to be cleared
		// views: [] // not needed anymore, to be cleared
	};

// Cleaned up config item
// boxSize: null
// checkBoxViews: null
// checkboxJobs: null
// color: "blue"
// downstreamProjects: Array[1]
// jenkinsUrl: "http://vecrmhybrisi2.dhcp.wdf.sap.corp:8080/jenkins"
// jobHealthReport: Array[1]
// jobs: null
// jobsByView: null
// language: null
// lastBuild: 1411480806000
// lastbuildUrl: "http://vecrmhybrisi2.dhcp.wdf.sap.corp:8080/jenkins/job/Chameleon_11_Main53_Core_12_Sync_SapCustomer/lastBuild"
// name: "Chameleon_11_Main53_Core_12_Sync_SapCustomer"
// selectedJob: "Chameleon_11_Main53_Core_12_Sync_SapCustomer"
// selectedView: "Chameleon_53"
// statusColor: "statusblue"
// statusIcon: "fa-check"
// statusInfo: "Success"
// timestamp: "about 18 hours ago"
// upstreamProjects: Array[1]
// url: "http://vecrmhybrisi2.dhcp.wdf.sap.corp:8080/jenkins/job/Chameleon_11_Main53_Core_12_Sync_SapCustomer"
// views: null

	this.configItems = [];
	this.lastErrorMsg = "";

	function isSameJob(configItemA, configItemB) { // comparison can also be done via Job URL?
		var isEqual = true;
		isEqual &= configItemA.jenkinsUrl === configItemB.jenkinsUrl;
		// isEqual &= configItemA.selectedView === configItemB.selectedView; // This may change (and must be read dynamically?)
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

	this.cleanUpConfigItem = function(item) {
		// item.selectedView = null; // Shall be done if it is read dynamically
		delete item.language;
		delete item.boxSize;
		delete item.checkboxJobs;
		delete item.checkBoxViews;
		delete item.jobsByView;
		delete item.jobs;
		delete item.views;
		delete item.downstreamProjects;
		delete item.upstreamProjects;
		delete item.timestamp;
		delete item.lastBuild;
		delete item.lastbuildUrl;
		delete item.statusInfo;
	};

	this.addConfigItem = function(item){
		if(!this.isItemInConfigItems(item)) {
			this.cleanUpConfigItem(item);
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
