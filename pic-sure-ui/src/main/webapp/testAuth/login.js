define(['jquery'], function($){
	return function(){
		$.ajaxSetup({
			headers: {"Authorization": "Bearer " + localStorage.id_token}
		});
	};
});

