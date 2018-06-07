define(['picSure/ontology', 'jquery','underscore'], function(ontology, $, _){
	
	var runningQueryIds = {};
	
	var submitQuery = function(targetSystem, query, displayName, dataCallback){
		var checkStatus = function(id, stillRunning){
			setTimeout(function(){
				$.ajax(targetSystem.queryStatusBasePath + runningQueryIds[displayName], {
					success: function(data){
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
							dataCallback(data);
							break;
						default :
							console.log("UNKNOWN QUERY STATUS : " + data.status);
							dataCallback(undefined);
							break;
						};
					},
					headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")}
				});
			}, 500);
		}

		var initiateQuery = function(){
			$.ajax(targetSystem.queryPath, {
				data : JSON.stringify(query),
				headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")},
				contentType: 'application/json',
				type: 'POST',
				success: function(data, status, jqXHR){
					runningQueryIds[displayName] = data.resultId;
					var stillRunning = function(){
						checkStatus(runningQueryIds[displayName], stillRunning);				
					};
					stillRunning();
				},
				error: function(data, status, jqXHR){
					dataCallback(data);
				}
			});
		}
		
		initiateQuery();
	};

	return {
		submitQuery : submitQuery
	}
});