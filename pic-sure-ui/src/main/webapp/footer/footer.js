define(["backbone","handlebars", "text!footer/footer.hbs", "overrides/footer"], 
		function(BB, HBS, login, template, overrides, settings){
	var footerView = BB.View.extend({
		initialize : function(){
			this.template = HBS.compile(template);
		},
		render : typeof overrides.render === 'function' ? overrides.render : function(){
			this.$el.html(this.template({ footerMessage : settings.footerMessage }));
		}
	});

	return {
		View : new footerView({})
	};
});