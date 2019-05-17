define(["output/outputPanel","picSure/queryBuilder", "filter/filter"],
		function(outputPanel, queryBuilder, filter){
	var filterList = {
		init : function(){
			$('#filter-list').html();
			this.filters = [];
			this.addFilter();
			this.initEvents();
		}
	};
	/*
		Initialize events on the dom components that
		interact with the filterList object and its
		properties.
 */
	filterList.initEvents = function(){
			$('#clear-all-filters').on('click',function() {
				 filterList.clearAllQueryFilters();
			});
	}.bind(filterList);

	filterList.addFilter = function(){
		$('.filter-boolean-operator').removeClass('hidden');
		var newFilter = new filter.View({
			queryCallback : this.runQuery,
			model : new filter.Model(),
			removeFilter : this.removeFilter,
		});
		newFilter.render();
		this.filters.push(newFilter);
		$('#filter-list').append(newFilter.$el);
	}.bind(filterList);
	filterList.runQuery = function(){
		var query = queryBuilder.createQuery(
				_.pluck(this.filters, "model"));
		outputPanel.View.update(query);
		if(_.countBy(this.filters, function(filter){
			return filter.model.get("searchTerm").trim() === "" ? "empty" : "notEmpty";
		}).empty == undefined) {
            this.addFilter();
        }
	}.bind(filterList);
	filterList.removeFilter = function (cid) {
        var indexToRemove;
        for (var i = 0; i < this.filters.length; i++) {
            if (this.filters[i].cid === cid) {
                indexToRemove = i;
                break;
            }
		}
		// now remove view from list
		if (typeof indexToRemove != 'undefined') {
            this.filters.splice(indexToRemove, 1);
        }
        this.runQuery();
	}.bind(filterList);

	filterList.clearAllQueryFilters = function () {
		this.filters.forEach(function(filterObject) { filterObject.destroyFilter(); })
	}.bind(filterList);

	return filterList;
});
