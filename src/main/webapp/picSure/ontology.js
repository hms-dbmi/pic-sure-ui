define(["picSure/resourceMeta"], function(resourceMeta){
	var mapResponseToResult = function(query, response){
		var result = {};
		console.log(response);
		result.suggestions = response.map(entry => {
			var puiSegments = entry.pui.split("/");
			return {
				value : entry.name,
				data : entry.pui,
				category : puiSegments[5],
				parent : puiSegments[puiSegments.length-3]
			};
		}).sort(function(a, b){
			var indexOfTerm = a.value.toLowerCase().indexOf(query) - b.value.toLowerCase().indexOf(query);
			var differenceInLength = a.value.length - b.value.length;
			return indexOfTerm == 0 ? indexOfTerm + differenceInLength : indexOfTerm;
		});
		if(result.length > 100){
			result = result.slice(0,99);
		}
		return result;
	};

	var autocomplete = function(query, done){
		var lookupDeferred = $.Deferred();
		return $.ajax({
			url: window.location.origin + resourceMeta[0].findPath + "?term=%25"+query+"%25",
			success: function(response){
				done(mapResponseToResult(query, response));
			}.bind({done:done}),
			complete: function(){
				lookupDeferred.resolve();
			},
			dataType: "json"
		});
	}.bind({resourceMeta:resourceMeta});
	return {
		autocomplete: autocomplete
	};
});