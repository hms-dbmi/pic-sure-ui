define(["backbone","handlebars", "auth/login", "text!header/header.hbs", "overrides/header", "text!../settings/settings.json"], 
		function(BB, HBS, login, template, overrides, settings){
	var headerView = BB.View.extend({
		initialize : function(){
			this.template = HBS.compile(template);
		},
		events : {
			"click #logout-btn" : "logout"
		},
		logout : function(event){
			localStorage.clear();
			window.location = '/';
		}, 
		render : function(){
			this.$el.html(this.template({
				logoPath: (overrides.logoPath 
					? overrides.logoPath : "/images/PrecisionLinkPortal.png"),
				helpLink: JSON.parse(settings).helpLink
			}));
		}
	});

	return {
		View : new headerView({})
	};
});