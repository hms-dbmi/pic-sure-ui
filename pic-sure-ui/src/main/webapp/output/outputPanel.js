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
           	this.$el.html("<div id=\"patient-spinner\" class=\"spinner spinner-large spinner-large-center\" style=\"position: relative;\"></div>");
			setTimeout(function(){
				this.$el.html(this.template({}));				
			}.bind(this), 2000);
		}
	});
	return {
		View : outputView
	}
});