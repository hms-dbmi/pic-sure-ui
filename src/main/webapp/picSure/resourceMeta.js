define(["jquery"], function($){
	var meta = {
			picsureInstances : []
	};
	$.ajax({
		async: false,
		dataType: "json",
		url: "/settings/settings.json",
		success: function(data){
			this.picsureInstances = data.resources
		}.bind(meta),
		error: function(jqXHR){
			console.warn("Using development mode resources. Unable to fetch settings file.");
			this.picsureInstances = [
				{
					id : "NHANES1",
					name : "NHANES 1",
					queryPath : "/NHANES/queryService/runQuery?only_count=true",
					queryStatusBasePath : "/NHANES/resultService/resultStatus/",
					queryResultBasePath : "/NHANES/resultService/result/"
				},{
					id : "NHANES2",
					name : "NHANES 2",
					queryPath : "/NHANES/queryService/runQuery?only_count=true",
					queryStatusBasePath : "/NHANES/resultService/resultStatus/",
					queryResultBasePath : "/NHANES/resultService/result/"
				},{
					id : "NHANES3",
					name : "NHANES 3",
					queryPath : "/NHANES/queryService/runQuery?only_count=true",
					queryStatusBasePath : "/NHANES/resultService/resultStatus/",
					queryResultBasePath : "/NHANES/resultService/result/"
				}
				];	  
		}.bind(meta)
	});
	return meta.picsureInstances;
});
