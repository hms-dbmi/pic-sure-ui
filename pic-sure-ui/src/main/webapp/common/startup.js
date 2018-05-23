define(["filter/filterList", "output/outputPanel", "jquery", "treeview"],
		function(filterList, output, $){
	sessionStorage.token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYW1kZXRzQGdtYWlsLmNvbSIsImlzcyI6ImJhciIsImV4cCI6MTUyOTA4NzUyMiwiaWF0IjoxNTI2NDk1NTIyLCJqdGkiOiJGb28iLCJlbWFpbCI6Im5hbWRldHNAZ21haWwuY29tIn0.YZPEPAypRojxWPwYKYuuChRxuLrPm_Adt316HC8n9hw";
	$.ajaxSetup({
		headers: {"Authorization": "Bearer " + sessionStorage.token}
	});
	console.log("in startup");
	filterList.init();
	var outputPanel = output.View;
	outputPanel.render();
	$('#query-results').append(outputPanel.$el);
});