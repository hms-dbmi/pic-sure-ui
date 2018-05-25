define(["filter/filterList", "output/outputPanel", "jquery", "auth/login", "treeview"],
		function(filterList, output, $, login){
	if(!localStorage.id_token){
		login();
	}
	console.log("in startup");
	filterList.init();
	var outputPanel = output.View;
	outputPanel.render();
	$('#query-results').append(outputPanel.$el);
});