define(["picSure/queryCache","picSure/queryBuilder","picSure/resourceMeta", "filter/filter"], function(queryCache, queryBuilder, resourceMeta, filter){
	var filterList = {
		init : function(){
			$('#filter-list').html();
			this.filters = [];
			this.addFilter();
		}
	};
	filterList.addFilter = function(){
		$('.filter-boolean-operator').removeClass('hidden');
		var newFilter = new filter.View({
			queryCallback : this.runQuery,
			model : new filter.Model()
		});
		newFilter.render();
		this.filters.push(newFilter);
		$('#filter-list').append(newFilter.$el);
	}.bind(filterList);
	filterList.runQuery = function(){
		var query = queryBuilder.createQuery(_.pluck(this.filters, "model"));
        var queryCompletionDeferred = $.Deferred();
        $('#patient-count').html("");
        $('#patient-spinner').show();
		var callbacks = {
				success: function(id){
					console.log(id + " SUCCESS");
					$.ajax({
						url : resourceMeta.nhanes.queryResultBasePath + id + "/JSON",
						success : function(result){
							console.log(result);
                            $('#patient-spinner').hide();
							$('#patient-count').html(result.data.length);
						},
						failure : function(data){
							console.log(data);
                            $('#patient-count').html("Error");
						}
					});

				},
				error: function(id){
					_.each(_.keys(localStorage), function(key){
						if(localStorage.getItem(key)==id){
							localStorage.removeItem(key);
						}
					});
					console.log(id + " ERROR");
				},
				running: function(id){
					console.log(id + " STILL RUNNING");
				}
		};
		queryCache.submitQuery(
				resourceMeta.nhanes,
				query,
				new Date().getTime(),
				queryCompletionDeferred, 
				callbacks);
		$.when(queryCompletionDeferred).then(function(){
			console.log("deferred resolved");
		});
		if(_.countBy(this.filters, function(filter){
			return filter.model.get("searchTerm").trim() === "" ? "empty" : "notEmpty";
		}).empty == undefined){
			this.addFilter();			
		}
		
	}.bind(filterList);

	return filterList;
});