define(["output/outputPanel","picSure/queryBuilder", "filter/searchResult", "handlebars", "text!filter/searchResultTabs.hbs"],
		function(outputPanel, queryBuilder, searchResult, HBS, searchResultTabsTemplate){
	var searchResults = {
		init : function(data, view, callback){
			this.searchResultList = [];
            this.searchResultTabs = HBS.compile(searchResultTabsTemplate);
			this.addSearchResultRows(data, view, callback);

		}
	};
    searchResults.addSearchResultRows = function(data, filterView, queryCallback){
		var searchResultList = this.searchResultList;
		$('.search-tabs', filterView.$el).append(this.searchResultTabs(_.keys(data)));

		var searchResutlRowViews = [];
		_.keys(data).forEach((key) => {
           _.each(data[key], function(value){
                var newSearchResultRow = new searchResult.View({
                    queryCallback : queryCallback,
                    model : new searchResult.Model(value),
                    filterView: filterView
                });
                newSearchResultRow.render();
                searchResultList.push(newSearchResultRow);

                $('#'+key+'.tab-pane', filterView.$el).append(newSearchResultRow.$el);
            });
	    	});
	    	
        $("#"+_.first(_.keys(data))).addClass("active");

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