define([], function(){
	var picsureInstances = [
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
	return picsureInstances;
});
