define(["text!settings/settings.json"], function(settings){
	var resourceMeta = JSON.parse(settings).resources;
	var mapResponseToResult = function(query, response){
		var result = {};
		console.log(response);
		result.suggestions = response.map(entry => {
			var puiSegments = entry.pui.split("/");
			return {
				value : entry.name,
				data : entry.pui,
                                isCategorical : entry.attributes.visualattributes[0]=='C',
				category : puiSegments[5].split(' ').join('_'),
				tooltip : entry.attributes.tooltip,
				parent : puiSegments[puiSegments.length-3]
			};
		}).sort(function(a, b){
			var indexOfTerm = a.value.toLowerCase().indexOf(query) - b.value.toLowerCase().indexOf(query);
			var differenceInLength = a.value.length - b.value.length;
			return indexOfTerm == 0 ? indexOfTerm + differenceInLength : indexOfTerm;
		});
		if(result.length > 150){
			result = result.slice(0,149);
		}
		return result;
	};

	var autocomplete = function(query, done){
		return $.ajax({
			url: window.location.origin + resourceMeta[0].findPath + "?term=%25"+query+"%25",
			success: function(response){
                                  var categoricalPaths = [];
       	       			  _.each(response, function(value){
            		   	     if(value.attributes.visualattributes[0]=='C'){
       	    		   	       categoricalPaths.push(value);
       	       			    }
       	       			  });
                		if(categoricalPaths.length > 0){
					_.each(categoricalPaths, function(path){
						response.splice(response.indexOf(path), 1);
					});
					$.ajax({
		                        url: window.location.origin + resourceMeta[0].pathPath,
		                        type: 'POST',
		                        contentType: 'application/json',
		                        data: JSON.stringify(_.pluck(categoricalPaths, "pui")),
		                        success: function(categoricalResponse){
		                                done(mapResponseToResult(query, response.concat(categoricalResponse)));
		                        },
		                        error: function(response){
		                                done(mapResponseToResult(query, response));
		                        }
			                });
                                }else{
					done(mapResponseToResult(query, response));
				}
			}.bind({done:done}),
			dataType: "json"
		});
	}.bind({resourceMeta:resourceMeta});

	var verifyPathsExist = function(paths, targetResource, done){
		return $.ajax({
			url: window.location.origin + targetResource.pathPath,
			type: 'POST',
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
