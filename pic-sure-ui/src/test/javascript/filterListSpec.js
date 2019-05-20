define(["filter/filterList", "output/outputPanel", "jquery", "text!settings/settings.json", "underscore"], function(filterList, outputPanel, $, settingsJSON, _){
	var settings = JSON.parse(settingsJSON)
	jasmine.pp = function(obj){return JSON.stringify(obj, undefined, 2);};

	describe("filterList", function(){
		beforeEach(function(){
			filterList.init();
		});
		describe("assumed pre-conditions", function(){
			it(" TODO : $('#clear-all-filters') is actually a thing in the DOM", function(){
			});
		});
		describe("as a module it has functions", function(){
			beforeEach(function(){
				filterList.init();
			});
			describe("initEvents", function(){
				it("is a function", function(){
					expect(typeof filterList.initEvents).toBe("function")
				});
				it(" TODO : needs behavioral tests that require a DOM to check", function(){});
			});
			describe("has an addFilter function", function(){
				it("is a function", function(){
					expect(typeof filterList.addFilter).toBe("function");
				});
				it("adds a filter to the list of filters", function(){
					var currentNumberOfFilters = filterList.filters.length;
					filterList.addFilter();
					expect(filterList.filters.length - currentNumberOfFilters).toBe(1);
				});
				it(" TODO : needs more behavioral tests that require a DOM to check", function(){});
			});
			describe("has a runQuery function", function(){
				it("is a function", function(){
					expect(typeof filterList.runQuery).toBe("function");
				});
				it(" TODO : needs behavioral tests that require a DOM to check", function(){});
			});
			describe("has a removeFilter function", function(){
				it("is a function", function(){
					expect(typeof filterList.removeFilter).toBe("function")
				});
				it(" TODO : needs behavioral tests that require a DOM to check", function(){});
			});
			describe("has a clearAllQueryFilters function", function(){
				it("is a function", function(){
					expect(typeof filterList.clearAllQueryFilters).toBe("function")
				});
				it(" TODO : needs behavioral tests that require a DOM to check", function(){});
			});
		});
	});
});