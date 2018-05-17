define(["output/outputPanel","picSure/queryBuilder", "filter/searchResult", "handlebars", "text!filter/searchResultTabs.hbs"],
		function(outputPanel, queryBuilder, searchResult, HBS, searchResultTabsTemplate){
	var searchResults = {
		init : function(data, view, callback){
			this.searchResultList = [];
            this.searchResultTabs = HBS.compile(searchResultTabsTemplate);
			this.addSearchResultRow(data, view, callback);

		}
	};
    searchResults.addSearchResultRow = function(data, filterView, queryCallback){
		var categories = [];
		var searchResultList = this.searchResultList;
		var categoryCount = 0;
        $('.search-tabs', filterView.$el).append(this.searchResultTabs());

		_.keys(data).forEach((key) => {
            categories.push(key);

            var classActive = categoryCount == 0 ? 'active' : '';

            var tab = '<li class="' + classActive + '"><a href="#'
                + key
                + '" data-toggle="tab" aria-expanded="true">'
                + key
                + '</a></li>';

            var tabContent = '<div class="tab-pane ' + classActive + '" id="'+ key + '"></div>';

            $('.nav-pills', filterView.$el).append(tab);
            $('.tab-content', filterView.$el).append(tabContent);

            _.each(data[key], function(value){
                var newSearchResultRow = new searchResult.View({
                    queryCallback : queryCallback,
                    model : new searchResult.Model(value),
                    filterView: filterView
                });
                newSearchResultRow.render();
                searchResultList.push(newSearchResultRow);

                $('.tab-pane', filterView.$el).append(newSearchResultRow.$el);
            });
            categoryCount++;
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