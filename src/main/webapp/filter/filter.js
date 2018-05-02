define(["picSure/queryCache","picSure/queryBuilder","picSure/resourceMeta", "backbone", "handlebars", "text!filter/filter.hbs", "text!filter/suggestion.hbs", "autocomplete"], 
		function(queryCache, queryBuilder, resourceMeta, BB, HBS, filterTemplate, suggestionTemplate){
	var filterModel = BB.Model.extend({
		inclusive: true,
		searchTerm: ""
	});
	var filterView = BB.View.extend({
		initialize: function(){
			this.template = HBS.compile(filterTemplate);
			this.suggestionTemplate = HBS.compile(suggestionTemplate);
			this.model = new filterModel();
		},
		tagName: "div",
		className: "row",
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
						headers: {
							"Authorization": "Bearer " + sessionStorage.token
						},
						dataType: "json"
					});
			    },
			    onSelect: function(suggestion){
			    		var queryCompletionDeferred = $.Deferred();
			    		console.log(suggestion);
			    		var callbacks = {
			    				success: function(id){
			    					console.log(id + " SUCCESS");
			    					$.ajax({
			    						url : resourceMeta.nhanes.queryResultBasePath + id + "/JSON",
			    						success : function(result){
			    							console.log(result);
			    							$('#patient-count').html(result.data.length);
			    						},
			    						failure : function(data){
			    							console.log(data);
			    						}
			    					});

			    				},
			    				error: function(id){
			    					_.each(_.keys(localStorage), function(key){
			    						if(localStorage.getItem(key)==id){
			    							localStorage.removeItem(key);
			    						}
			    					});
			    					console.log(id + " ERROR");
			    				},
			    				running: function(id){
			    					console.log(id + " STILL RUNNING");
			    				}
			    		};
			    		queryCache.submitQuery(
			    				resourceMeta.nhanes,
			    				queryBuilder.createQuery(suggestion.data),
			    				suggestion.data,
			    				queryCompletionDeferred, 
			    				callbacks);
			    		$.when(queryCompletionDeferred).then(function(){
			    			console.log("deferred resolved");
			    		});
			    },
			    formatResult: function(suggestion, currentValue){
			    		return this.suggestionTemplate(suggestion);
			    }.bind(this),
			    triggerSelectOnValidInput: false,
			    minChars: 2,
			    showNoSuggestionNotice: true,
			    noSuggestionNotice: "Sorry, no results found. Please try synonyms or more general terms for your query."
			});
		}
	});
	return {
		View : filterView,
		Model : filterModel
	};
});