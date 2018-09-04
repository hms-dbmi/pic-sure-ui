define(["filter/filterList", "header/header", "output/outputPanel", "picSure/resourceMeta", "jquery", "auth/login", "handlebars", "text!common/mainLayout.hbs", "treeview", "common/styles"],
		function(filterList, header, output, resourceMeta, $, login, HBS, layoutTemplate){
	$(document).ajaxError(function (e, xhr, options) {
		var isPrimaryResource = options.url.toUpperCase().indexOf(resourceMeta[0].id.toUpperCase()) != -1;
	    if (xhr.status == 401 && isPrimaryResource){
		    header.logout();
		}
	});
	return function(){
		$('body').append(HBS.compile(layoutTemplate)());
		
		if(!localStorage.id_token){
			login.showLoginPage();
		}else{
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