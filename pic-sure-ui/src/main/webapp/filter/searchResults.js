define(["output/outputPanel","picSure/queryBuilder", "filter/searchResult"],
		function(outputPanel, queryBuilder, searchResult){
	var searchResults = {
		init : function(data, view, callback){
			this.searchResultList = [];
			this.addSearchResultRow(data, view, callback);
		}
	};
    searchResults.addSearchResultRow = function(data, filterView, queryCallback){
		var categories = [];
		data.forEach((value,key) => {
            categories.push(key);

			for (var i in value) {
                var newSearchResultRow = new searchResult.View({
                    queryCallback : queryCallback,
                    model : new searchResult.Model(value[i]),
                    filterView: filterView
                });
                newSearchResultRow.render();
                this.searchResultList.push(newSearchResultRow);

                $('.search-results', filterView.$el).append(newSearchResultRow.$el);
			}
    	})

	}.bind(searchResults);
    searchResults.runQuery = function(){
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

    }.bind(searchResults);

	return searchResults;
});