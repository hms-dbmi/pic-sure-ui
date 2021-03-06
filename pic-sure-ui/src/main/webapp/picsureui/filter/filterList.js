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
            $('#clear-all-filters').hide();
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
		var query = queryBuilder.createQuery(_.pluck(this.filters, "model"));

		// Only show 'ClearAll' if there are more then one filters
		if (this.filters.length>0) {$('#clear-all-filters').show();}

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

	/*
	  Clear the array where the references to the actual filter objects are stored
	  and then call the `destroyFilter` method on all the objects.
	  The `runQuery` method will add an empty filter field to the view, so we
	  don't have to ;)
	*/
	filterList.clearAllQueryFilters = function () {
		//Clear all filters
		fl = this.filters.splice(0,this.filters.length);

		// Clear out all settings for the query
		outputPanel.View.initialize();
		outputPanel.View.model.set('queryRan',false)
		outputPanel.View.update(JSON.parse('{"where":[]}'));
		outputPanel.View.model.spinAll();
		outputPanel.View.model.set('spinning',false);
		_.each(outputPanel.View.model.attributes.resources, function(r) { r.spinning = false;});
		delete outputPanel.View.model.attributes.i2b2ResultId;
		outputPanel.View.render();
		
		// Remove leftovers
		for(var i = 0; i < fl.length; i++) { fl[i].destroyFilter();}
		$('#clear-all-filters').hide();
	}.bind(filterList);

	return filterList;
});
