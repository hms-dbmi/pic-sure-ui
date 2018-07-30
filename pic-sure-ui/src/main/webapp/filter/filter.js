define(["picSure/ontology", "common/spinner", "backbone", "handlebars", "text!filter/filter.hbs", "text!filter/suggestion.hbs", "filter/searchResults", "picSure/queryCache", "text!filter/constrainFilterMenu.hbs", "autocomplete", "bootstrap"],
		function(ontology, spinner, BB, HBS, filterTemplate, suggestionTemplate, searchResults, queryCache, constrainFilterMenuTemplate){
	var valueConstrainModel = BB.Model.extend({
		defaults:{
			constrainByValue: false,
            isValueOperatorBetween: false,
			valueOperator: "LT",
			valueOperatorLabel: "Less than",
			constrainValueOne: "",
			constrainValueTwo: ""
		}
	});
	var filterModel = BB.Model.extend({
		defaults:{
			inclusive: true,
			searchTerm: "",
			and: true,
            constrainByValue: false,
            constrainParams: new valueConstrainModel()
		}
	});
	var filterView = BB.View.extend({
		initialize: function(opts){
			this.template = HBS.compile(filterTemplate);
			this.suggestionTemplate = HBS.compile(suggestionTemplate);
			this.queryCallback = opts.queryCallback;
            this.showSearchResults = this.showSearchResults.bind(this);
            this.removeFilter = opts.removeFilter;
            this.constrainFilterMenuTemplate = HBS.compile(constrainFilterMenuTemplate);
		},
		tagName: "div",
		className: "filter-list-entry row",
		events: {
			"selected .search-box" : "onAutocompleteSelect",
			"hidden.bs.dropdown .autocomplete-suggestions .dropdown" : "onAutocompleteSelect",
			"click .filter-dropdown-menu li a" : "onDropdownSelect",
            "click .delete": "destroyFilter",
            "click .edit": "editFilter",
            "keyup input.search-box" : "enterButtonEventHandler",
            "click .constrain-dropdown-menu li a" : "onConstrainTypeSelect",
            "click .value-dropdown-menu li a" : "onValueTypeSelect",
            "focusout .constrain-value" : "onConstrainValuesChange",
			"click .constrain-apply-btn" : "onConstrainApplyButtonClick"
		},
        reset: function () {
		    this.model.clear().set(this.model.defaults);
            this.model.set("constrainParams", new valueConstrainModel());
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
            $('.constrain-filter', this.$el).html("");
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
            this.updateConstrainFilterMenu();
        },
        destroyFilter: function () {
            this.undelegateEvents();
            this.$el.removeData().unbind();
            this.remove();
            this.removeFilter(this.cid);
        },
        onConstrainTypeSelect: function (event) {
            var dropdownElement = $("."+event.target.parentElement.parentElement.attributes['aria-labelledby'].value, this.$el);
            dropdownElement.text(event.target.text);
            dropdownElement.append('<span class="glyphicon glyphicon-chevron-down blue"></span>');
            var constrainByValue = $('.value-constraint-btn', this.$el).text().trim() != "No value";
            // update both models
            this.model.set("constrainByValue", constrainByValue)
            this.model.get("constrainParams").set("constrainByValue", constrainByValue);

            this.updateConstrainFilterMenu()
        },
        onValueTypeSelect : function (event) {
            var dropdownElement = $("."+event.target.parentElement.parentElement.attributes['aria-labelledby'].value, this.$el);
            dropdownElement.text(event.target.text);
            dropdownElement.append('<span class="glyphicon glyphicon-chevron-down blue"></span>');

            var valueOperator = event.target.attributes['value'].value;

			var constrainModel = this.model.get("constrainParams");
            constrainModel.set("valueOperator", valueOperator);
            constrainModel.set("valueOperatorLabel", event.target.text);
            constrainModel.set("isValueOperatorBetween", valueOperator === "BETWEEN")
            this.updateConstrainFilterMenu();
        },
        onConstrainValuesChange : function (event) {
            this.model.get("constrainParams").set("constrainValueOne", $('.constrain-value-one', this.$el).val());
            this.model.get("constrainParams").set("constrainValueTwo", $('.constrain-value-two', this.$el).val());
        },
        updateConstrainFilterMenu : function() {
            if (this.model.get("valueType") === "NUMBER") {
                $('.constrain-filter', this.$el).html(this.constrainFilterMenuTemplate(this.model.attributes.constrainParams.attributes));
            } else {
                $('.constrain-filter', this.$el).html('');
            }
        },
        validateConstrainFilterFields : function () {
            var isValid = true;
            $('.constrain-value-one', this.$el).removeClass("field-invalid");
            $('.constrain-value-two', this.$el).removeClass("field-invalid");
            if (this.model.get("constrainByValue")){
                var constrainParams = this.model.get("constrainParams");
                var constrainValueOne = constrainParams.get("constrainValueOne").trim();

                if (constrainValueOne == "" || isNaN(constrainValueOne)) {
                    $('.constrain-value-one', this.$el).addClass("field-invalid");
                    isValid = false;
                }
                if (constrainParams.get("isValueOperatorBetween")) {
                    var constrainValueTwo = constrainParams.get("constrainValueTwo").trim();
                    if (constrainValueTwo == "" || isNaN(constrainValueTwo)) {
                        $('.constrain-value-two', this.$el).addClass("field-invalid")
                        isValid = false;
                    }
                }
            }
            return isValid;
        },
        onConstrainApplyButtonClick : function (event) {
			if (this.validateConstrainFilterFields()) {
			    if (this.model.get("constrainByValue")){
                    var constrains = this.model.get("constrainParams");
                    var searchParam = constrains.get("valueOperatorLabel")
                        + " "
                        + constrains.get("constrainValueOne")
                        + (constrains.get("isValueOperatorBetween") ?
                            " - " + constrains.get("constrainValueTwo") : "");
                    $('.search-value', this.$el).html(this.model.get("searchValue") + ', ' + searchParam);
                }
                this.$el.addClass("saved");
                $('.constrain-filter', this.$el).html("");
                this.onSelect(event);
            } else {
				alert("Please correct invalid fields in RED.")
			}
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