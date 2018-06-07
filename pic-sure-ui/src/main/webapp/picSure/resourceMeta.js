define(["text!settings/settings.json"], function(settings){
	return JSON.parse(settings).resources.map(resource => Object.assign(resource, {
		"queryPath" : resource.basePath + "/queryService/runQuery",
		"queryStatusBasePath" : resource.basePath + "/resultService/resultStatus/",
		"queryResultBasePath" : resource.basePath + "/resultService/result/",
		"pathPath" : resource.basePath + "/resourceService/jsonPath",
		"findPath" : resource.basePath + "/resourceService/find",
	}));
});