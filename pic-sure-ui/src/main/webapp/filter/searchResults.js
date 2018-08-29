define(["output/outputPanel","picSure/queryBuilder", "filter/searchResult", "handlebars", "text!filter/searchResultTabs.hbs"],
		function(outputPanel, queryBuilder, searchResult, HBS, searchResultTabsTemplate){
	var searchResults = {
		init : function(data, view, callback){
			this.searchResultTabs = HBS.compile(searchResultTabsTemplate);
			this.addSearchResultRows(data, view, callback);
		}
	};
    searchResults.addSearchResultRows = function(data, filterView, queryCallback){
		$('.search-tabs', filterView.$el).append(this.searchResultTabs(_.keys(data)));

		_.keys(data).forEach((key) => {
		   var categorySearchResultViews = [];
           _.each(data[key], function(value){
                var newSearchResultRow = new searchResult.View({
                    queryCallback : queryCallback,
                    model : new searchResult.Model(value),
                    filterView: filterView
                });
                newSearchResultRow.render();

                categorySearchResultViews.push(newSearchResultRow);
            });
           $('#'+key+'.tab-pane', filterView.$el).append(_.pluck(categorySearchResultViews, "$el"));
	    	});
	    	
        $("#"+_.first(_.keys(data))).addClass("active");
        $(".nav-pills li:first-child").addClass("active");

    }.bind(searchResults);

    return searchResults;
});