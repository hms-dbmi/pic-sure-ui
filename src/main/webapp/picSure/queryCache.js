define(['jquery','underscore'], function($, _){
	
	var runningQueryIds = {};
	
	var submitQuery = function(targetSystem, query, displayName, dataCallback){
		var checkStatus = function(id, stillRunning){
			setTimeout(function(){
				$.get(targetSystem.queryStatusBasePath + runningQueryIds[displayName], function(data){
					switch(data.status){
					case "RUNNING":
						// Query is still running so just keep waiting.
						stillRunning();
						break;
					case "AVAILABLE":
						// Query has completed
						$.ajax({
							url : targetSystem.queryResultBasePath + id + "/JSON",
							success : function(result){
								dataCallback(result);
							},
							failure : function(data){
								console.log(data);
							}
						});
						break;
					case "ERROR":
						// Query failed
						dataCallback(undefined);
						break;
					default : 
						console.log("UNKNOWN QUERY STATUS : " + data.status);
						dataCallback(undefined);
						break;
					};
			});
			}, 500);
		}

		var initiateQuery = function(){
			$.ajax(targetSystem.queryPath, {
				data : JSON.stringify(query),
				contentType: 'application/json',
				type: 'POST',
				success: function(data, status, jqXHR){
					runningQueryIds[displayName] = data.resultId;
					var stillRunning = function(){
						checkStatus(runningQueryIds[displayName], stillRunning);				
					};
					stillRunning();
				}
			});
		}

		if(runningQueryIds[displayName]===undefined){
			initiateQuery();
		}else{
			initiateQuery();
		}
	}

	return {
		submitQuery : submitQuery
	}
});