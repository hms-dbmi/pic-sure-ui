define(['common/searchParser', 'auth0-js', 'jquery', 'handlebars', 'text!auth/login.hbs', 'overrides/login'], 
		function(parseQueryString, Auth0Lock, $, HBS, loginTemplate, overrides){
	
	var loginTemplate = HBS.compile(loginTemplate);

	var loginCss = null
	$.get("https://avillachlab.us.webtask.io/connection_details_base64?webtask_no_cache=1&css=true",function(css){
		loginCss = "<style>" + css + "</style";
	});
	
	var login = {
		showLoginPage : function(){			
			var queryObject = parseQueryString();

			var webtaskBaseUrl = "https://avillachlab.us.webtask.io/connection_details_base64/";

			var userIsAuthorized = overrides.authorization ? overrides.authorization(queryObject) : true;
			
			if(userIsAuthorized && typeof queryObject.access_token === "string" && typeof queryObject.id_token === "string"){

				var expiresAt = JSON.stringify(
						queryObject.expires_in * 1000 + new Date().getTime()
				);
				localStorage.setItem('access_token', queryObject.access_token);
				localStorage.setItem('id_token', queryObject.id_token);
				localStorage.setItem('expires_at', expiresAt);
				window.location = "/";
			}else{
				$.ajax("https://avillachlab.us.webtask.io/connection_details_base64/?webtask_no_cache=1&client_id=b9GoG1H2PESf03JFqSZXAVEFatOEIMWM", 
						{
					dataType: "text",
						success : function(scriptResponse){
							var script = scriptResponse.replace('responseType : "code"', 'responseType : "token"');
							$('#main-content').html(loginTemplate({
								buttonScript : script,
								clientId : "b9GoG1H2PESf03JFqSZXAVEFatOEIMWM",
								auth0Subdomain : "avillachlab",
								callbackURL : window.location.protocol + "//"+ window.location.hostname + (window.location.port ? ":"+window.location.port : "") +"/login"
							}));
							overrides.postRender ? overrides.postRender.apply(this) : undefined;
							$('#main-content').append(loginCss);
						}
				});				
			}
		}
	};
	return login;
});

