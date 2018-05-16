define(["picSure/ontology", "common/spinner", "backbone", "handlebars", "text!filter/filter.hbs", "text!filter/suggestion.hbs", "autocomplete"], 
		function(ontology, spinner, BB, HBS, filterTemplate, suggestionTemplate){
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
		},
		tagName: "div",
		className: "filter-list-entry row",
		events: {
			"selected .search-box" : "onSelect",
			"hidden.bs.dropdown .dropdown" : "onSelect",
			"click dropdown-menu li a" : "onDropdownSelect"
		},
		onDropdownSelect : function(event){
			$("."+event.target.parentElement.parentElement.attributes['aria-labelledby'].value, this.$el).text(event.target.text);
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
		render: function(){
			this.$el.html(this.template(this.model));
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
				minChars: 2,
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