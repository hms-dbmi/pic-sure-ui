define(["filter/filterList", "header/header", "output/outputPanel", "jquery", "auth/login", "treeview"],
		function(filterList, header, output, $, login){
	console.log("in startup");
	if(!localStorage.id_token){
		login.showLoginPage();
	}else{
		var header = header.View;
		header.render();
		$('#header-content').append(header.$el);
		filterList.init();
		var outputPanel = output.View;
		outputPanel.render();
		$('#query-results').append(outputPanel.$el);		
	}
});