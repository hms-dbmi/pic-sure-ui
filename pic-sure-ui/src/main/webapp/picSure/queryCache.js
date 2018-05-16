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
	};

    var findTerm = function(query, resultsDeferred) {
        var result = {};
        var categoryMap = new Map();
        $.ajax({
            url: "/" + sessionStorage.environment + "/resourceService/find?term=%25" + query + "%25",
            success: function(data){
            	result = data.map(entry => {
                    var puiSegments = entry.pui.split("/");

                    var mapElement = {
                        value : entry.name,
                        data : entry.pui,
                        category : puiSegments[3],
                        parent : puiSegments[puiSegments.length-3]
                    };
					if (categoryMap.has(puiSegments[3])){
                        var array = categoryMap.get(puiSegments[3]);
                        array.push(mapElement);
					} else {
						var array = new Array();
                        array.push(mapElement);
                        categoryMap.set(puiSegments[3], array);
                    }
					return mapElement;
                });
                resultsDeferred.resolve(categoryMap);
            },
            beforeSend: function () {
                //spinner.small(lookupDeferred, spinnerSelector, "search-box-spinner");
            },
            complete: function () {
                //lookupDeferred.resolve();
            },
            headers: {
                "Authorization": "Bearer " + sessionStorage.token
            },
            dataType: "json"
        });
    }

	return {
		submitQuery : submitQuery,
        findTerm 	: findTerm
	}
});