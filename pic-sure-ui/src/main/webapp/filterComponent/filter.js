define(["backbone", "handlebars", "text!filterComponent/filter.hbs", "text!filterComponent/suggestion.hbs", "autocomplete"], 
		function(BB, HBS, filterTemplate, suggestionTemplate){
	var filterView = BB.View.extend({
		initialize: function(){
			this.template = HBS.compile(filterTemplate);
			this.suggestionTemplate = HBS.compile(suggestionTemplate);
		},
		tagName: "li",
		render: function(){
			if(!(sessionStorage.token && sessionStorage.environment)){
				alert("You must set sessionStorage.environment to either \"NHANES\" or \"PL\" and sessionStorage.token to a valid PIC-SURE token for NHANES or PL-Dev");
				return;
			}
			this.$el.html(this.template(this.model));
			$('.search-box', this.$el).autocomplete({
				lookup: function (query, done) {
			        var result = {};
					$.ajax({
						url: "/" + sessionStorage.environment + "/resourceService/find?term="+query+"%25",
						success: function(response){
							console.log(response);
							result.suggestions = response.filter(entry => {
								return entry.attributes.visualattributes.toLowerCase().startsWith("f");
							}).map(entry => {
								var puiSegments = entry.pui.split("/");
								return {
									value : entry.name,
									data : entry.pui,
									category : puiSegments[3],
									parent : puiSegments[puiSegments.length-3]
								};
							});
					        done(result);
						},
						headers: {
							"Authorization": "Bearer " + sessionStorage.token
						},
						dataType: "json"
					});
			    },
			    formatResult: function(suggestion, currentValue){
			    		return this.suggestionTemplate(suggestion);
			    }.bind(this),
			    showNoSuggestionNotice: true,
			    noSuggestionNotice: "Sorry, no results found. Please try synonyms or more general terms for your query."
			});
		}
	});
	var filterModel = BB.Model.extend({
		attributes: {
			inclusive: true,
			searchTerm: ""
		}
	});
	return {
		View : filterView,
		Model : filterModel
	};
});