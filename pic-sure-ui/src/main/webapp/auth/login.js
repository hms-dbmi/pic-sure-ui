define(['picSure/resourceMeta', 'text!auth/not_authorized.hbs', 'text!settings/settings.json', 'picSure/ontology', 'common/searchParser', 'auth0-js', 'jquery', 'handlebars', 'text!auth/login.hbs', 'overrides/login'], 
		function(resourceMeta, notAuthorizedTemplate, settings, ontology, parseQueryString, Auth0Lock, $, HBS, loginTemplate, overrides){
	
	var loginTemplate = HBS.compile(loginTemplate);

	var loginCss = null
	$.get("https://avillachlab.us.webtask.io/connection_details_base64?webtask_no_cache=1&css=true", function(css){
		loginCss = "<style>" + css + "</style";
	});
	
	var defaultAuthorizationCheck = function(id_token, callback){
		var deferreds = [];
		for(var resourceIndex in resourceMeta){
			var resource = resourceMeta[resourceIndex];
			var resourceDeferred = $.Deferred();
			deferreds.push(resourceDeferred);
			ontology.verifyPathsExist([resource.basePui], resource, resourceDeferred.resolve);
		}
		$.when.apply($, deferreds).then(function(authorizationDecisions){
			callback(authorizationDecisions);
		});
	};
	
	var handleAuthorizationResult = function(userIsAuthorized){
		var queryObject = parseQueryString();
		if(userIsAuthorized && typeof queryObject.access_token === "string" && typeof queryObject.id_token === "string"){
			window.location = "/";
		}else{
			if(typeof queryObject.access_token === "string"){
				$('#main-content').html(HBS.compile(notAuthorizedTemplate)(JSON.parse(settings)));
			}else{
				var clientId = overrides.client_id ? overrides.client_id : "ywAq4Xu4Kl3uYNdm3m05Cc5ow0OibvXt";
				$.ajax("https://avillachlab.us.webtask.io/connection_details_base64/?webtask_no_cache=1&client_id=" + clientId, 
						{
					dataType: "text",
						success : function(scriptResponse){
							var script = scriptResponse.replace('responseType : "code"', 'responseType : "token"');
							$('#main-content').html(loginTemplate({
								buttonScript : script,
								clientId : clientId,
								auth0Subdomain : "avillachlab",
								callbackURL : window.location.protocol + "//"+ window.location.hostname + (window.location.port ? ":"+window.location.port : "") +"/login"
							}));
							overrides.postRender ? overrides.postRender.apply(this) : undefined;
							$('#main-content').append(loginCss);
						}
				});					
			}
		}
	}

	var login = {
		showLoginPage : function(){			
			var queryObject = parseQueryString();
			if(queryObject.id_token){
				var expiresAt = JSON.stringify(
						queryObject.expires_in * 1000 + new Date().getTime()
					);
				localStorage.setItem('access_token', queryObject.access_token);
				localStorage.setItem('id_token', queryObject.id_token);
				localStorage.setItem('expires_at', expiresAt);				
			}
			
			if(typeof overrides.authorization === "function"){
				overrides.authorization(queryObject.id_token, handleAuthorizationResult);
			} else {
				if(queryObject.id_token){
					defaultAuthorizationCheck(queryObject.id_token, handleAuthorizationResult);
				}else{
					handleAuthorizationResult(false);
				}
			}			
		}
	};
	return login;
});

