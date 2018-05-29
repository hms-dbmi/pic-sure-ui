define(["common/spinner", "text!output/outputPanel.hbs","text!settings/settings.json", "picSure/ontology", "picSure/queryCache", "backbone", "handlebars"], 
	function(spinner, outputTemplate, settings, ontology, queryCache, BB, HBS){
	var resourceMeta = JSON.parse(settings).resources;
	var outputView = BB.View.extend({
		initialize: function(){
			this.template = HBS.compile(outputTemplate);
		},
		totalCount: 0,
		tagName: "div",
		update: function(incomingQuery){
			this.totalCount = 0;

			if (incomingQuery.where.length == 0) {
           		this.render();
           		return;
            }
			var atLeastOneResultComplete = $.Deferred();
			spinner.medium(atLeastOneResultComplete, "#spinner-total");
			_.each(resourceMeta, function(picsureInstance){
				var queryCompletionDeferred = $.Deferred();
				var query = JSON.parse(JSON.stringify(incomingQuery));
				spinner.small(queryCompletionDeferred, "#spinner-" + picsureInstance.id);

				$('#patient-count-' + picsureInstance.id).text("");

				var dataCallback = function(result){
					if(result == undefined || result.status=="ERROR"){
						$('#patient-count-' + picsureInstance.id).text("Timeout");
						queryCompletionDeferred.resolve();
					}else{
						var count = parseInt(result.data[0][0].patient_set_counts);
						$('#patient-count-' + picsureInstance.id).text(count);
						this.totalCount += count;
						$('#patient-count').text(this.totalCount);
						queryCompletionDeferred.resolve();
					}
				}.bind(this);

				_.each(query.where, function(whereClause){
					whereClause.field.pui = whereClause.field.pui.replace(/(\/[\w-]+){4}/, picsureInstance.basePui);
				});

				ontology.verifyPathsExist(_.pluck(_.pluck(query.where, 'field'), 'pui'), picsureInstance, function(allPathsExist){
					if(allPathsExist){
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
					}else{
						dataCallback({data:[[{patient_set_counts:0}]]});
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
