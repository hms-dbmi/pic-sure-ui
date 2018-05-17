define(["picSure/ontology", "common/spinner", "backbone", "handlebars", "text!filter/filter.hbs", "text!filter/suggestion.hbs", "filter/searchResults", "picSure/queryCache", "autocomplete", "bootstrap"],
		function(ontology, spinner, BB, HBS, filterTemplate, suggestionTemplate, searchResults, queryCache){
	var filterModel = BB.Model.extend({
		defaults:{
			inclusive: true,
			searchTerm: "",
			and: true,
			theList: null
		}
	});
	var filterView = BB.View.extend({
		initialize: function(opts){
			this.template = HBS.compile(filterTemplate);
			this.suggestionTemplate = HBS.compile(suggestionTemplate);
			this.queryCallback = opts.queryCallback;
            this.showSearchResults = this.showSearchResults.bind(this);
		},
		tagName: "div",
		className: "filter-list-entry row",
		events: {
			"selected .search-box" : "onAutocompleteSelect",
			"hidden.bs.dropdown .dropdown" : "onAutocompleteSelect",
			"click dropdown-menu li a" : "onDropdownSelect",
            "keyup input.search-box" : "enterButtonEventHandler"
		},
        enterButtonEventHandler : function(event){
            if(event.keyCode == 13){
                var term = $('input.search-box', this.$el).val();

                if(term && term.length > 0){
                    this.model.set("searchTerm", term);
                    this.searchTerm(term);
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
                $('.search-results', this.$el).html('');
                searchResults.init(_.groupBy(result.suggestions, "category"), this, this.queryCallback);

            }
        },
		onDropdownSelect : function(event){
			$("."+event.target.parentElement.parentElement.attributes['aria-labelledby'].value, this.$el).text(event.target.text);
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