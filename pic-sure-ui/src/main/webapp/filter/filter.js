define(["picSure/ontology", "common/spinner", "backbone", "handlebars", "text!filter/filter.hbs", "text!filter/suggestion.hbs", "filter/searchResults", "picSure/queryCache", "overrides/filter", "autocomplete", "bootstrap"],
		function(ontology, spinner, BB, HBS, filterTemplate, suggestionTemplate, searchResults, queryCache, overrides){
	var filterModel = BB.Model.extend({
		defaults:{
			inclusive: true,
			searchTerm: "",
			and: true
		}
	});
	var filterView = BB.View.extend({
		initialize: function(opts){
			this.template = HBS.compile(filterTemplate);
			this.suggestionTemplate = HBS.compile(suggestionTemplate);
			this.queryCallback = opts.queryCallback;
			this.showSearchResults = this.showSearchResults.bind(this);
			this.removeFilter = opts.removeFilter;
		},
		tagName: "div",
		className: "filter-list-entry row",
		events: {
			"selected .search-box" : "onAutocompleteSelect",
			"hidden.bs.dropdown .autocomplete-suggestions .dropdown" : "onAutocompleteSelect",
			"click .dropdown-menu li a" : "onDropdownSelect",
			"click .delete": "destroyFilter",
			"click .edit": "editFilter",
			"keyup input.search-box" : "enterButtonEventHandler"
		},
		enterButtonEventHandler : function(event){
			if(event.keyCode == 13){
				overrides.enterKeyHandler ? overrides.enterKeyHandler.apply(this) 
						: function(){
							var term = $('input.search-box', this.$el).val();
							if(term && term.length > 0){
								this.model.set("searchTerm", term);
								this.searchTerm(term);
							}
						}
			}
		},
		searchTerm : function(term) {
			var deferredSearchResults = $.Deferred();
			ontology.autocomplete(term, deferredSearchResults.resolve);
			$.when(deferredSearchResults).then(this.showSearchResults);
		},
		showSearchResults : function(result) {
			if(result == undefined) {
				alert("Result error");
			} else {
				$('.search-tabs', this.$el).html('');
				searchResults.init(_.groupBy(result.suggestions, "category"), this, this.queryCallback);

			}
		},
		onDropdownSelect : function(event){
			var dropdownElement = $("."+event.target.parentElement.parentElement.attributes['aria-labelledby'].value, this.$el);
			dropdownElement.text(event.target.text);
			dropdownElement.append(' <span class="caret"></span>');
			this.onSelect(event);
		},
		onAutocompleteSelect : function (event, suggestion) {
			if(suggestion && suggestion.value && suggestion.value.trim().length > 0){
				this.searchTerm(suggestion.value);
			}
			else {
				console.error('Search term is missing, cannot search');
			}
		},
		onSelect : function(event, suggestion){
			console.log("selected");
			this.model.set("inclusive", $('.filter-qualifier-btn', this.$el).text().trim() === "Must Have");
			this.model.set("and", $('.filter-boolean-operator-btn', this.$el).text().trim() === "AND");
			if(suggestion && suggestion.data){
				this.model.set("searchTerm", suggestion.data);
			}
			if(this.model.get("searchTerm").trim().length > 0){
				this.queryCallback();				
			}
		},
		editFilter : function(){
			this.$el.removeClass("saved");
		},
		destroyFilter: function () {
			this.undelegateEvents();
			this.$el.removeData().unbind();
			this.remove();
			this.removeFilter(this.cid);

		},
		render: function(){
			this.$el.html(this.template(this.model.attributes));
			var spinnerSelector = this.$el.find(".spinner-div");

			$('.search-box', this.$el).autocomplete({
				deferRequestBy: 300,
				lookup: function(query, done){
					spinner.small(ontology.autocomplete(query, done), spinnerSelector, "search-box-spinner");
				},
				onSelect: function(suggestion){
					$(this).trigger("selected", suggestion);
				},
				formatResult: function(suggestion, currentValue){
					return this.suggestionTemplate(suggestion);
				}.bind(this),
				triggerSelectOnValidInput: false,
				minChars: 3,
				showNoSuggestionNotice: true,
				noSuggestionNotice: "Sorry, no results found. Please try synonyms or more general terms for your query."
			});

			$('.dropdown-toggle', this.$el).dropdown();

			this.delegateEvents();
		}
	});
	return {
		View : filterView,
		Model : filterModel
	};
});