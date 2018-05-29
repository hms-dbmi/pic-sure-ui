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
		treeview: 'webjars/bootstrap-treeview/1.2.0/bootstrap-treeview.min',
		'auth0-js': "//cdn.auth0.com/js/auth0/9.5.1/auth0"
	},
	shim: {
		"bootstrap": {
			deps: ["jquery"]
		},
		"treeview": {
			deps:["bootstrap"]
		},
		"auth0-js": {
			deps:["jquery"],
			exports: "Auth0Lock"
		}
	}
});

require(["common/startup"], function(){
	
});
