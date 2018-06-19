define(["handlebars", "backbone"], function(HBS, BB){
	return {
		/*
		 * This should be a function that returns the name of a Handlebars partial
		 * that will be used to render the count. The Handlebars partial should be
		 * registered at the top of this module.
		 */
		countDisplayOverride : undefined,
		/*
		 * This is a function that if defined replaces the normal render function 
		 * from outputPanel.
		 */
		renderOverride : undefined,
		/*
		 * If you want to replace the entire Backbone.js View that is used for
		 * the output panel, define it here. 
		 */
		viewOverride : undefined,
		/*
		 * In case you want to change the update logic, but not the rendering or
		 * anything else, you can define a function that takes an incomingQuery
		 * and dispatches it to the resources you choose, and handles registering
		 * callbacks for the responses and error handling.
		 */
		update: undefined
	};
});