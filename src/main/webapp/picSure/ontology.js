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
				tooltip : entry.attributes.tooltip,
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
		return $.ajax({
			url: window.location.origin + resourceMeta[0].findPath + "?term=%25"+query+"%25",
			headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")},
			success: function(response){
				done(mapResponseToResult(query, response));
			}.bind({done:done}),
			dataType: "json"
		});
	}.bind({resourceMeta:resourceMeta});

	var verifyPathsExist = function(paths, targetResource, done){
		return $.ajax({
			url: window.location.origin + targetResource.pathPath,
			type: 'POST',
			headers: {"Authorization": "Bearer " + localStorage.getItem("id_token")},
			contentType: 'application/json',
			data: JSON.stringify(paths),
			success: function(response){
				done(true);
			},
			error: function(response){
				done(false);
			}
		});
	};

	return {
		autocomplete: autocomplete,
		verifyPathsExist: verifyPathsExist
	};
});