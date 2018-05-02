define([], function(){
	return { 
		nhanes : {
			queryPath : "/NHANES/queryService/runQuery?only_count=true",
			queryStatusBasePath : "/NHANES/resultService/resultStatus/",
			queryResultBasePath : "/NHANES/resultService/result/"
		}
	};
});