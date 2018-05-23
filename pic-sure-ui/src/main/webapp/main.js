require.config({
	baseUrl: "/",
	paths: {
		jquery: 'webjars/jquery/3.3.1/dist/jquery.min',
		autocomplete: 'webjars/devbridge-autocomplete/1.4.7/dist/jquery.autocomplete',
		underscore: 'webjars/underscorejs/1.8.3/underscore-min',
		handlebars: 'webjars/handlebars/1.8.3/underscore-min',
		bootstrap: 'webjars/bootstrap/3.3.7-1/js/bootstrap.min',
		backbone: 'webjars/backbonejs/1.3.3/backbone-min',
		text: 'webjars/requirejs-text/2.0.15/text',
		handlebars: 'webjars/handlebars/4.0.5/handlebars.min',
		treeview: 'webjars/bootstrap-treeview/1.2.0/bootstrap-treeview.min'
	},
	shim: {
		"bootstrap": {
			deps: ["jquery"]
		},
		"treeview": {
			deps:["bootstrap"]
		}
	}
});

require(["filter/filterList", "output/outputPanel", "treeview"],
		function(filterList, output){
	sessionStorage.token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYW1kZXRzQGdtYWlsLmNvbSIsImlzcyI6ImJhciIsImV4cCI6MTUyOTA4NzUyMiwiaWF0IjoxNTI2NDk1NTIyLCJqdGkiOiJGb28iLCJlbWFpbCI6Im5hbWRldHNAZ21haWwuY29tIn0.YZPEPAypRojxWPwYKYuuChRxuLrPm_Adt316HC8n9hw";
	$.ajaxSetup({
		headers: {"Authorization": "Bearer " + sessionStorage.token}
	});

	console.log("in main");
	filterList.init();
	var outputPanel = output.View;
	outputPanel.render();
	$('#query-results').append(outputPanel.$el);
	
});
