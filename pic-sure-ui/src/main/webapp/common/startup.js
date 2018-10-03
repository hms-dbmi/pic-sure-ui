define(["filter/filterList", "header/header", "text!../settings/settings.json", "output/outputPanel", "picSure/resourceMeta", "jquery", "auth/login", "handlebars", "text!common/mainLayout.hbs", "treeview", "common/styles"],
		function(filterList, header, settings, output, resourceMeta, $, login, HBS, layoutTemplate){
	return function(){
		
		if( (! localStorage.id_token) || (new Date().getTime() - localStorage.expires_at > 0)){
			login.showLoginPage();
		}else{
			$('body').append(HBS.compile(layoutTemplate)(JSON.parse(settings)));
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