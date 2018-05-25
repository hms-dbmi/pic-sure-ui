define(['auth0-js', 'jquery'], function(Auth0Lock, $){
	return function(){
		var content = $('.content');

		var lock = new Auth0Lock.WebAuth(
				
				{
				    domain: "avillachlab.auth0.com",
				    clientID: "b9GoG1H2PESf03JFqSZXAVEFatOEIMWM",
				    redirectUri: origin,
				    audience: 'https://' + "avillachlab.auth0.com" + '/userinfo',
				    responseType: 'token id_token',
				    scope: 'openid email'
				  }
		);

		function login() {
			lock.authorize();
		}

		function setSession(authResult) {
			// Set the time that the access token will expire at
			var expiresAt = JSON.stringify(
					authResult.expiresIn * 1000 + new Date().getTime()
			);
			localStorage.setItem('access_token', authResult.accessToken);
			localStorage.setItem('id_token', authResult.idToken);
			localStorage.setItem('expires_at', expiresAt);
		}

		function logout() {
			// Remove tokens and expiry time from localStorage
			localStorage.removeItem('access_token');
			localStorage.removeItem('id_token');
			localStorage.removeItem('expires_at');
			displayButtons();
		}

		function isAuthenticated() {
			// Check whether the current time is past the
			// access token's expiry time
			var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
			return new Date().getTime() < expiresAt;
		}

		lock.parseHash(function(err, authResult) {
				if (authResult && authResult.accessToken && authResult.idToken) {
					window.location.hash = '';
					setSession(authResult);
					$.ajaxSetup({
						headers: {"Authorization": "Bearer " + localStorage.id_token}
					});
				} else if (err) {
					console.log(err);
					alert(
							'Error: ' + err.error + '. Check the console for further details.'
					);
				}
				if(!isAuthenticated()){
					login();					
				}
			});
		};
});

