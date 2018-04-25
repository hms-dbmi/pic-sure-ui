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

require(["filter/filter", "output/outputPanel", "bootstrap"],
		function(filter, output){
	sessionStorage.token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0fGF2bGJvdEBkYm1pLmhtcy5oYXJ2YXJkLmVkdSIsImVtYWlsIjoiYXZsYm90QGRibWkuaG1zLmhhcnZhcmQuZWR1In0.51TYsm-uw2VtI8aGawdggbGdCSrPJvjtvzafd2Ii9NU";
	sessionStorage.environment="NHANES";

	console.log("in main");
	var firstFilter = new filter.View({
		model : new filter.Model()
	});
	firstFilter.render();
	$('#filter-list').append(firstFilter.$el);
	$('.dropdown-toggle').dropdown();
	var outputPanel = new output.View({});
	outputPanel.render();
	$('#query-results').append(outputPanel.$el);
	$('#modal-save-button').click(function(event){
		var environment = $("#environment").val();
		var token = $("#token").val();
		if(environment && token){
			sessionStorage.environment = environment;
			sessionStorage.token = token;			
		}else{
			alert("You must set a token and choose an environment. <br><br>" +
					"For PL environment get a token from PL-Dev. <br>" +
					"For NHANES environment get a token from NHANES-Prod");
		}
	});
});
