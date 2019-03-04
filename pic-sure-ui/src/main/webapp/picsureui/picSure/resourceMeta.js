define(["text!../settings/settings.json"], function(settings){
	var sets = JSON.parse(settings);
	return sets.resources.map(resource => Object.assign(resource, {
		"queryPath" : resource.basePath + "/queryService/runQuery",
		"queryStatusBasePath" : resource.basePath + "/resultService/resultStatus/",
		"queryResultBasePath" : resource.basePath + "/resultService/result/",
		"pathPath" : resource.basePath + "/resourceService/jsonPath",
		"findPath" : resource.basePath + "/resourceService/find" + (resource.resourcePath ? resource.resourcePath : ""),
	}));
});