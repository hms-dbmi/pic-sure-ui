define(["backbone","handlebars", "text!header/header.hbs", "overrides/header", "text!../settings/settings.json"],
		function(BB, HBS, template, overrides, settings){
	var headerView = BB.View.extend({
		initialize : function(){
			this.template = HBS.compile(template);
		},
		events : {
			"click #logout-btn" : "logout"
		},
		logout : function(event){
			localStorage.clear();
			sessionStorage.clear();
			window.location = '/';
		}, 
		render : function(){
			this.$el.html(this.template({
				logoPath: (overrides.logoPath 
					? overrides.logoPath : "/picsureui/images/PrecisionLinkPortal.png"),
				helpLink: JSON.parse(settings).helpLink
			}));
		}
	});

	return {
		View : new headerView({})
	};
});