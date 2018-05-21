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

		_.keys(data).forEach((key) => {
		   var categorySearchResultViews = [];
           _.each(data[key], function(value){
                var newSearchResultRow = new searchResult.View({
                    queryCallback : queryCallback,
                    model : new searchResult.Model(value),
                    filterView: filterView
                });
                newSearchResultRow.render();
                searchResultList.push(newSearchResultRow);
                categorySearchResultViews.push(newSearchResultRow);
            });
           $('#'+key+'.tab-pane', filterView.$el).append(_.pluck(categorySearchResultViews, "$el"));
	    	});
	    	
        $("#"+_.first(_.keys(data))).addClass("active");
        $(".nav-pills li:first-child").addClass("active");

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