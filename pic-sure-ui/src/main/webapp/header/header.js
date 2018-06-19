define(["backbone","handlebars", "text!header/header.hbs", "overrides/header"], 
		function(BB, HBS, template, overrides){
	var headerView = BB.View.extend({
		initialize : function(){
			this.template = HBS.compile(template);
		},
		events : {
			"click #logout-btn" : "logout"
		},
		logout : function(event){
			localStorage.clear();
			window.location = "/";
		}, 
		render : function(){
			this.$el.html(this.template({
				logoPath: overrides.logoPath ? overrides.logoPath : "/images/PrecisionLinkPortal.png"
			}));
		}
	});

	return {
		View : new headerView({})
	};
});