define([], function(){
	var createWhere = function(pui, logicalOperator, constrainByValue, constrainParams){
		var whereQuery = {
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
		if (constrainByValue) {
			var valueConstraint = constrainParams.attributes.constrainValueOne;
			if  (constrainParams.attributes.isValueOperatorBetween) {
                valueConstraint = valueConstraint + " AND " + constrainParams.attributes.constrainValueTwo;
			}
			var whereQueryFields = {
                OPERATOR : constrainParams.attributes.valueOperator,
				CONSTRAINT : valueConstraint
			}
            whereQuery["field"].dataType = "INTEGER";
        	whereQuery["predicate"] = "CONSTRAIN_VALUE";
            whereQuery["fields"] = whereQueryFields;
		}

		return whereQuery;
	};
	var createQuery = function(filters){
		var query = {
				where: []
		};
		var lastFilter = undefined;
		_.each(filters, function(filter){
			if(filter.get("searchTerm").trim().length !== 0){
				query.where.push(
						createWhere(filter.get("searchTerm"), 
								filter.get("inclusive") ? 
										(lastFilter ? (lastFilter.get("and") ? "AND" : "OR") : "AND")
										: "NOT",
                            	filter.get("constrainByValue"),
                            	filter.get("constrainParams")
							));
			}
			lastFilter = filter;
		});
		return query;
	};
	

	return {
		createQuery
	}
});