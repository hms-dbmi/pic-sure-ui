define(["text!output/outputPanel.hbs", "backbone", "handlebars"], 
	function(outputTemplate, BB, HBS){
	var outputView = BB.View.extend({
		initialize: function(){
			this.template = HBS.compile(outputTemplate);
		},
		tagName: "div",
		runQuery: function(){
			
		},
		render: function(){
			this.$el.html("SPINNING...");
			setTimeout(function(){
				this.$el.html(this.template({}));				
			}.bind(this), 2000);
		}
	});
	return {
		View : outputView
	}
});