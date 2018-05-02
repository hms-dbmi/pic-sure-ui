define(['jquery','underscore'], function($, _){
	
	var submitQuery = function(targetSystem, query, displayName, deferred, callbacks){
		
		var checkStatus = function(id, stillRunning, stopRunning){
			setTimeout(function(){
				$.get(targetSystem.queryStatusBasePath + window.localStorage.getItem(displayName), function(data){
					switch(data.status){
					case "RUNNING":
						// Query is still running so just keep waiting.
						if(callbacks && typeof callbacks.running === "function"){
							callbacks.running(data.resultId);
						}
						stillRunning();
						break;
					case "AVAILABLE":
						// Query has completed
						if(callbacks && typeof callbacks.success === "function"){
							callbacks.success(data.resultId);
						}
						stopRunning();
						break;
					case "ERROR":
						// Query failed
						window.localStorage.removeItem(data.resultId);
						if(callbacks && typeof callbacks.error === "function"){
							callbacks.error(data.resultId);
						}
						stopRunning();
						break;
					default : 
						console.log("UNKNOWN QUERY STATUS : " + data.status);
						stopRunning();
						break;
					};
			});
			}, 100);
		}

		if(localStorage[displayName]===undefined){
			$.ajax(targetSystem.queryPath, {
				data : JSON.stringify(query),
				contentType: 'application/json',
				type: 'POST',
				success: function(data, status, jqXHR){
					window.localStorage.setItem(displayName, data.resultId);
					var stillRunning = function(){
						checkStatus(localStorage[displayName], stillRunning, deferred.resolve);				
					};
					stillRunning();
				}
			});
			
		}else{
			var stillRunning = function(){
				checkStatus(localStorage[displayName], stillRunning, deferred.resolve);				
			};
			stillRunning();
		}
	}

	return {
		submitQuery : submitQuery
	}
});