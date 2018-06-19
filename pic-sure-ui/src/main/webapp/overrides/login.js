define([], function(){
	return {
		/*
		 * This allows you to build any authorization logic you wish.
		 * 
		 * This should be a function that takes the output of common/searchParser/parseQueryString
		 * and returns either true or false based on the values of the query string.
		 * 
		 */
		authorization : undefined,
		/*
		 * This allows you to modify the DOM rendered on the login screen.
		 * 
		 * For GRIN this implements a hack that hides the Google button because of
		 * a bug in the Auth0 lock that prevents you from showing only enterprise
		 * buttons.
		 * 
		 * Since users still need to pass authorization, there is no harm in
		 * keeping the button hidden, since even if someone decided to show it
		 * they couldn't use it to access the system anyway.
		 */
		postRender: undefined
	};
});