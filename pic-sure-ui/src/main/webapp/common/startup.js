define(["filter/filterList", "header/header", "output/outputPanel", "jquery", "auth/login", "handlebars", "text!common/mainLayout.hbs", "treeview", "common/styles"],
		function(filterList, header, output, $, login, HBS, layoutTemplate){
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