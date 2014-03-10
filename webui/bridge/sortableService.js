angular.module('bridge.app').service('sortableConfig', function () {

	this.getDefaultConfig = function(){
		return [                                        
            {content: "app.cats", id: 1, size:"box-2"},
            {content: "app.lunch-walldorf", id: 2, size:"box-1"},
            {content: "app.jira", id: 3, size:"box-2"},

            {content: "app.atc", id:4,  size:"box-2"},
            {content: "app.employee-search", id: 5, size:"box-2"},
            {content: "app.meetings", id: 6, size:"box-1"},

            {content: "app.github-milestone", id: 7, size:"box-2"},
            {content: "app.im", id: 8, size:"box-2"},
            {content: "app.test", id: 9, size:"box-1"}
        ]; 		
	}

	this.sortableOptions = {
            //placeholder: "sortable-placeholder",
            //forceHelperSize: true,
            //forcePlaceholderSize: true,
            //helper: "clone",
            delay: 50,
            scroll: false,
            tolerance: "pointer",
            disabled: true,
            update: function(e, ui) {          
            },
            stop: function(e, ui) {
            }
          };
});