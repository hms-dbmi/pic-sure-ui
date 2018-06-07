define(["common/spinner", "text!output/outputPanel.hbs","picSure/resourceMeta", "picSure/ontology", "picSure/queryCache", "backbone", "handlebars"],
		function(spinner, outputTemplate, resourceMeta, ontology, queryCache, BB, HBS){
	HBS.registerHelper("outputPanel_obfuscate", function(count){
		if(count < 10){
			return "< 10";
		} else {
			return count;
		}
	});

	var outputModelDefaults = {
			totalPatients : 0,
			spinnerClasses: "spinner-medium spinner-medium-center ",
			spinning: false,
			resources : {}
	};
	_.each(resourceMeta, (resource) => {
		outputModelDefaults.resources[resource.id] = {
				id: resource.id,
				name: resource.name,
				patientCount: 0,
				spinnerClasses: "spinner-center ",
				spinning: false
		};
	});
	var outputModel = BB.Model.extend({
		defaults: outputModelDefaults,
		spinAll: function(){
			this.set('spinning', true);
			_.each(this.get('resources'), function(resource){
				resource.spinning=true;
			});
		}
	});
	var outputView = BB.View.extend({
		initialize: function(){
			this.template = HBS.compile(outputTemplate);
		},
		totalCount: 0,
		tagName: "div",
		update: function(incomingQuery){
			this.model.set("totalPatients",0);
            if (incomingQuery.where.length == 0) {
                //clear the model
                _.each(resourceMeta, function(picsureInstance){
                    this.model.get("resources")[picsureInstance.id].patientCount = 0;
                }.bind(this));
                this.render();
                return;
            }
			this.model.spinAll();
			this.render();
			_.each(resourceMeta, function(picsureInstance){

				// make a safe deep copy of the incoming query so we don't modify it
				var query = JSON.parse(JSON.stringify(incomingQuery));

				var dataCallback = function(result){
					if(result == undefined || result.status=="ERROR"){
						this.model.get("resources")[picsureInstance.id].patientCount = 0;
					}else{
						var count = parseInt(result.data[0][0].patient_set_counts);
						this.model.get("resources")[picsureInstance.id].patientCount = count;
						this.model.set("totalPatients", this.model.get("totalPatients") + count);
					}
					this.model.get("resources")[picsureInstance.id].spinning = false;
					if(_.every(this.model.get('resources'), (resource)=>{return resource.spinning==false})){
						this.model.set("spinning", false);
					}
					this.render();
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
					}else{
						dataCallback({data:[[{patient_set_counts: 0}]]});
					}
				});
			}.bind(this));		
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
		}
	});
	return {
		View : new outputView({
			model: new outputModel()
		})
	}
});