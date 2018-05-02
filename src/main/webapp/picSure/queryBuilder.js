define([], function(){
	var createWhere = function(pui){
		return {
			field : {
				pui : pui,
				dataType : "STRING"
			},
			predicate : "CONTAINS",
			fields : {
				ENCOUNTER : "YES"
			}
		};
	};
	var createQuery = function(pui){
		return {
			where: [createWhere(pui)]
		}
	};
	

	return {
		createQuery
	}
});