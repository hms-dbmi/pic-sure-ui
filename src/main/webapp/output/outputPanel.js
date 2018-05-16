define(["common/spinner", "text!output/outputPanel.hbs","picSure/resourceMeta", "picSure/queryCache", "backbone", "handlebars"], 
	function(spinner, outputTemplate, resourceMeta, queryCache, BB, HBS){
	var outputView = BB.View.extend({
		initialize: function(){
			this.template = HBS.compile(outputTemplate);
		},
		totalCount: 0,
		tagName: "div",
		update: function(query){
			this.totalCount = 0;
			var view = this;
			var atLeastOneResultComplete = $.Deferred();
			spinner.medium(atLeastOneResultComplete, "#spinner-total");
			_.each(resourceMeta, function(picsureInstance){
				var queryCompletionDeferred = $.Deferred();
				spinner.small(queryCompletionDeferred, "#spinner-" + picsureInstance.id);
				
				$('#patient-count-' + picsureInstance.id).text("");
				
				var dataCallback = function(result){
					if(result == undefined){
						$('#patient-count-' + picsureInstance.id).text("Error");						
						queryCompletionDeferred.resolve();
					}else{
						var count = parseInt(result.data[0][0].patient_set_counts);
						$('#patient-count-' + picsureInstance.id).text(count);
						this.totalCount += count;
						$('#patient-count').text(this.totalCount);
						queryCompletionDeferred.resolve();
					}
				}.bind(this);
				
				queryCache.submitQuery(
						picsureInstance,
						query,
						picsureInstance.id,
						dataCallback);
				$.when(queryCompletionDeferred).then(function(){
					console.log("deferred resolved");
					if(atLeastOneResultComplete.state() == "pending"){
						atLeastOneResultComplete.resolve();
					}
				});
			}.bind(this));		
		},
		render: function(){
			this.$el.html(this.template(resourceMeta));
			if(this.totalCount == 0){
				$('#patient-count', this.$el).html("?");
			}else{
				$('#patient-count', this.$el).html(this.totalCount);
			}
		}
	});
	return {
		View : new outputView()
	}
});