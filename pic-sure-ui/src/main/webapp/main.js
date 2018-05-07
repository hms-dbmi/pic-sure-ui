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
		handlebars: 'webjars/handlebars/4.0.5/handlebars.min'
	},
	shim: {
		"bootstrap": {
			deps: ["jquery"]
		}
	}
});

require(["filter/filterList", "output/outputPanel", "bootstrap"],
		function(filterList, output){
	sessionStorage.token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0fGF2bGJvdEBkYm1pLmhtcy5oYXJ2YXJkLmVkdSIsImVtYWlsIjoiYXZsYm90QGRibWkuaG1zLmhhcnZhcmQuZWR1In0.51TYsm-uw2VtI8aGawdggbGdCSrPJvjtvzafd2Ii9NU";
	sessionStorage.environment="NHANES";

	console.log("in main");
	filterList.init();
	var outputPanel = output.View;
	outputPanel.render();
	$('#query-results').append(outputPanel.$el);
	
});
