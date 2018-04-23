require.config({
	baseUrl: "/",
	paths: {
		jquery: 'webjars/jquery/3.0.0/jquery.min',
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

require(["filterComponent/filter", "bootstrap"],
		function(filter){
	console.log("in main");
	var firstFilter = new filter.View({
		model : new filter.Model()
	});
	firstFilter.render();
	$('#filter-list').append(firstFilter.$el);
	$('.dropdown-toggle').dropdown();
});
