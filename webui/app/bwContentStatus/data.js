angular.module("app.bwContentStatus.data", [] ).service("app.bwContentStatus.dataService", [ "$http", "$q", "$window", function ($http, $q, $window) {
	this.data = {};
	this.data.statusObject = {};
	this.data.contents = [];
	this.data.configContents = {};
	this.getContentStatus = function( configContents ) {

		var deferred = $q.defer();
		var that = this;

		$http.get("https://ifp.wdf.sap.corp/sap/bc/devdb/MYCONTENTSTATUS?function=getAllCurrent&origin=" + $window.location.origin)
		.success(function(data) {
			data = new X2JS().xml_str2json(data);	

			var red = 0;
			var yellow = 0;
			var green = 0;
			var noStatus = 0;
			var assigned = 0;
			that.data.contents = [];
			that.data.statusObject = [];

			for (var i = 0; i < configContents.length; i++) {
				var status_exists = false;

				if (configContents[i].active) assigned++;

				for (var n = 0; n < data.abap.values.CONTENTS.ZDEVDB_CNTSTS.length; n++) {
					if( data.abap.values.CONTENTS.ZDEVDB_CNTSTS[n].CONTENT_ID == configContents[i].CONTID){
						if(configContents[i].active) { 
							that.data.contents[that.data.contents.length] = data.abap.values.CONTENTS.ZDEVDB_CNTSTS[n];
							that.data.contents[that.data.contents.length-1].CNT_COMMENT_NEW = that.data.contents[that.data.contents.length-1].CNT_COMMENT;
						};
						status_exists = true;
					};
				};

				if (configContents[i].active && !status_exists) {
					noStatus++;
					that.data.contents[that.data.contents.length] = configContents[i];
					that.data.contents[that.data.contents.length-1].CONTENT_ID = configContents[i].CONTID;
					that.data.contents[that.data.contents.length-1].STATUS = "0";
					that.data.contents[that.data.contents.length-1].CNT_COMMENT = "No Status/Comment set";
					that.data.contents[that.data.contents.length-1].CNT_COMMENT_NEW = that.data.contents[that.data.contents.length-1].CNT_COMMENT;
				};
			};

			for (var i = 0 ; i < that.data.contents.length; i++) {
				switch (that.data.contents[i].STATUS) {
					case "1":
						green++;
						break;
					case "2":
						yellow++;
						break;
					case "3":
						red++;
						break;
					default:
						break;
				}
			};

			that.data.statusObject = { 'red': red , 'yellow': yellow , 'green': green, 'noStatus': noStatus, 'assigned': assigned };

			deferred.resolve();
		});		
		return deferred.promise;
	};

	this.getContents = function(){

		var deferred = $q.defer();
		var that = this;

		$http.get("https://ifp.wdf.sap.corp/sap/bc/devdb/MYCONTENTSTATUS?function=getAllContents&origin=" + $window.location.origin )
		.success(function(data) {
			data = new X2JS().xml_str2json(data);	
			that.data.configContents = data.abap.values.CONTENTS.ZDEVDB_CONTENTS;
			deferred.resolve();
		});		
		return deferred.promise;
	};

	this.setContentStatus = function( content, status ) {

		var deferred = $q.defer();
		var that = this;

		$http.get("https://ifp.wdf.sap.corp/sap/bc/devdb/MYCONTENTSTATUS?function=setStatus&origin=" + $window.location.origin + "&contentId=" + content.CONTENT_ID + "&status=" + status + "&comment=" + content.CNT_COMMENT )
		.success(function(data) {
			deferred.resolve();
			var text = "";
			switch (parseInt(status)) {
					case 1 :
						text = "green";
						break;
					case 2 :
						text = "yellow";
						break;
					case 3 :
						text = "red";
						break;
					default:
						break;
				}
			console.log("Status/Comment changed to " + status + "-" +  text  +" for Content " + content.CONTENT_ID + " - " + content.CNT_COMMENT);
		});		
		return deferred.promise;
	};
}]);
 