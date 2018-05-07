define(["text!output/outputPanel.hbs","picSure/resourceMeta", "picSure/queryCache", "backbone", "handlebars"], 
	function(outputTemplate, resourceMeta, queryCache, BB, HBS){
	var outputView = BB.View.extend({
		initialize: function(){
			this.template = HBS.compile(outputTemplate);
		},
		totalCount: 0,
		tagName: "div",
		update: function(query){
			this.totalCount = 0;
			var view = this;
			_.each(resourceMeta, function(picsureInstance){
				var queryCompletionDeferred = $.Deferred();
				var callbacks = {
						success: function(id){
							console.log(id + " SUCCESS");
							$.ajax({
								url : picsureInstance.queryResultBasePath + id + "/JSON",
								success : function(result){
									console.log(result);
									$('#patient-count-' + picsureInstance.id).text(result.data.length);
									this.totalCount += result.data.length;
									$('#patient-count').text(this.totalCount);
								}.bind(view),
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
						picsureInstance,
						query,
						picsureInstance.id,
						queryCompletionDeferred, 
						callbacks);
				$.when(queryCompletionDeferred).then(function(){
					console.log("deferred resolved");
				});
			}.bind(this));		
		},
		render: function(){
			this.$el.html(this.template(resourceMeta));
			if(this.totalCount == 0){
				$('#patient-count').text("?");
			}else{
				$('#patient-count').text(this.totalCount);
			}
		}
	});
	return {
		View : new outputView()
	}
});