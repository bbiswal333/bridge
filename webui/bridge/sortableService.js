angular.module('bridge.app').service('sortableConfig', function () {

	this.getDefaultConfig = function(){
		return [                                        
            {content: "app.lunch-walldorf", id: 2, size:"box-2", show:true},
            {content: "app.jira", id: 3, size:"box-2", show:true},

            {content: "app.atc", id:4,  size:"box-1", show:true},
            {content: "app.employee-search", id: 5, size:"box-2", show:true},
            {content: "app.meetings", id: 6, size:"box-1", show:true},

            {content: "app.github-milestone", id: 7, size:"box-2", show:true},
            {content: "app.im", id: 8, size:"box-1", show:true},
            {content: "app.link-list", id: 9, size:"box-1", show:true} ,
            {content: "app.wire", id: 10, size: "box-1", show: true },
            {content: "app.cats", id: 1, size: "box-2", show: true },
        ]; 		
	}

	this.sortableOptions = {
            //placeholder: "sortable-placeholder",
            //forceHelperSize: true,
            //forcePlaceholderSize: true,
            //helper: "clone",
            delay: 150,
            scroll: false,
            tolerance: "pointer",
            disabled: true,
            update: function(e, ui) {          
            },
            stop: function(e, ui) {
            }
          };
});