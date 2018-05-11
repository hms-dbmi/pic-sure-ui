define([], function(){
	var autocomplete = function(query, done){
		var result = {};
		var lookupDeferred = $.Deferred();
		return $.ajax({
			url: "/" + sessionStorage.environment + "/resourceService/find?term=%25"+query+"%25",
			success: function(response){
				console.log(response);
				result.suggestions = response.map(entry => {
					var puiSegments = entry.pui.split("/");
					return {
						value : entry.name,
						data : entry.pui,
						category : puiSegments[3],
						parent : puiSegments[puiSegments.length-3]
					};
				}).sort(function(a, b){
					if(a.value.startsWith(query)){
						if(b.value.startsWith(query)){
							if(a.value < b.value){
								return -1;
							}else{
								return 1;
							}
						}else{
							return -1;
						}
					}else{
						if(b.value.startsWith(query)){
							return 1;
						}else{
							if(a.value < b.value){
								return -1;
							}else{
								return 1;
							}
						}
					}
				});
				if(result.length > 100){
					result = result.slice(0,99);
				}
				done(result);
			}.bind({done:done}),
			complete: function(){
				lookupDeferred.resolve();
			},
			headers: {
				"Authorization": "Bearer " + sessionStorage.token
			},
			dataType: "json"
		});
	}
	return {
		autocomplete: autocomplete
	};
});