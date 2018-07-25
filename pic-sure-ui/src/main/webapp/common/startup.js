define(["filter/filterList", "header/header", "output/outputPanel", "picSure/resourceMeta", "jquery", "auth/login", "treeview"],
		function(filterList, header, output, resourceMeta, $, login){
    console.log("in startup");
    $(document).ajaxError(function (e, xhr, options) {
		var isPrimaryResource = options.url.toUpperCase().indexOf(resourceMeta[0].id.toUpperCase()) != -1;
	    if (xhr.status == 401 && isPrimaryResource){
		    header.logout();
		}
	});
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