define(["backbone", "handlebars", "text!filter/filter.hbs", "text!filter/suggestion.hbs", "autocomplete"], 
		function(BB, HBS, filterTemplate, suggestionTemplate){
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
			"hidden.bs.dropdown .dropdown" : "onSelect"
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
			if(!(sessionStorage.token && sessionStorage.environment)){
				alert("You must set sessionStorage.environment to either \"NHANES\" or \"PL\" and sessionStorage.token to a valid PIC-SURE token for NHANES or PL-Dev");
				return;
			}
			this.$el.html(this.template(this.model));
            var spinner = this.$el.find(".spinner");
			$('.search-box', this.$el).autocomplete({
                deferRequestBy: 300,
				lookup: function (query, done) {
					var result = {};
					$.ajax({
						url: "/" + sessionStorage.environment + "/resourceService/find?term=%25"+query+"%25",
						success: function(response){
							console.log(response);
							result.suggestions = response.map(entry => {
								var puiSegments = entry.pui.split("/");
								return {
									value : entry.name,
									data : entry.pui,
									category : puiSegments[3],
									parent : puiSegments[puiSegments.length-3]
								};
							}).sort(function(a, b){
								if(a.value.startsWith(query)){
									if(b.value.startsWith(query)){
										if(a.value < b.value){
											return -1;
										}else{
											return 1;
										}
									}else{
										return -1;
									}
								}else{
									if(b.value.startsWith(query)){
										return 1;
									}else{
										if(a.value < b.value){
											return -1;
										}else{
											return 1;
										}
									}
								}
							});
							if(result.length > 100){
								result = result.slice(0,99);
							}
							done(result);
						},
                        beforeSend: function(){
                            spinner.show();
						},
                        complete: function(){
                            spinner.hide();
                        },
						headers: {
							"Authorization": "Bearer " + sessionStorage.token
						},
						dataType: "json"
					});
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
			$('.dropdown-menu li a', this.$el).click(function(event){
				$("."+event.target.parentElement.parentElement.attributes['aria-labelledby'].value, this.$el).text(event.target.text);
			}.bind(this));
		}
	});
	return {
		View : filterView,
		Model : filterModel
	};
});