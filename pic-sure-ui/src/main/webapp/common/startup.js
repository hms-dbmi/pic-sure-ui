define(["filter/filterList", "header/header", "text!../settings/settings.json", "output/outputPanel", "picSure/resourceMeta", "jquery", "auth/login", "handlebars", "text!common/mainLayout.hbs", "treeview", "common/styles"],
		function(filterList, header, settings, output, resourceMeta, $, login, HBS, layoutTemplate){
	return function(){
		$('body').append(HBS.compile(layoutTemplate)(JSON.parse(settings)));
		
		if(!localStorage.id_token){
			login.showLoginPage();
		}else{
			$(document).ajaxError(function (e, xhr, options) {
				var isPrimaryResource = options.url.toUpperCase().indexOf(resourceMeta[0].basePath.toUpperCase()) != -1;
			    if (xhr.status == 401 && isPrimaryResource){
			    		console.log("NOT LOGGED IN");
				    header.View.logout();
				}
			});
			var headerView = header.View;
			headerView.render();
			$('#header-content').append(headerView.$el);
			filterList.init();
			var outputPanel = output.View;
			outputPanel.render();
			$('#query-results').append(outputPanel.$el);		
		}
	}
});