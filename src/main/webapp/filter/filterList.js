define(["output/outputPanel","picSure/queryBuilder", "filter/filter"], 
		function(outputPanel, queryBuilder, filter){
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
		var query = queryBuilder.createQuery(
				_.pluck(this.filters, "model"));
        $('#patient-count').html("");
        $('#patient-spinner').show();
		outputPanel.View.update(query);
		if(_.countBy(this.filters, function(filter){
			return filter.model.get("searchTerm").trim() === "" ? "empty" : "notEmpty";
		}).empty == undefined){
			this.addFilter();			
		}

	}.bind(filterList);

	return filterList;
});