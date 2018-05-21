define([], function(){
	var createWhere = function(pui, logicalOperator){
		return {
			field : {
				pui : pui,
				dataType : "STRING"
			},
			logicalOperator: logicalOperator,
			predicate : "CONTAINS",
			fields : {
				ENCOUNTER : "YES"
			}
		};
	};
	var createQuery = function(filters){
		var query = {
				where: []
		};
		_.each(filters, function(filter){
			if(filter.get("searchTerm").trim().length !== 0){
				query.where.push(
						createWhere(filter.get("searchTerm"), 
								filter.get("inclusive") ? 
										(filter.get("and") ? "AND" : "OR") 
										: "NOT"));				
			}
		});
		return query;
	};
	

	return {
		createQuery
	}
});