define(["common/startup", "jquery"], function(startup, $){
	jasmine.pp = function(obj){return JSON.stringify(obj, undefined, 2);};
	describe("startup", function(){
		it("sets a token in the jquery ajax", function(){
			expect($.ajaxSettings.headers.Authorization).toEqual("Bearer undefined");//eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYW1kZXRzQGdtYWlsLmNvbSIsImlzcyI6ImJhciIsImV4cCI6MTUyOTA4NzUyMiwiaWF0IjoxNTI2NDk1NTIyLCJqdGkiOiJGb28iLCJlbWFpbCI6Im5hbWRldHNAZ21haWwuY29tIn0.YZPEPAypRojxWPwYKYuuChRxuLrPm_Adt316HC8n9hw");
		});
		
		it("appends an empty outputPanel", function(){
			expect($('#query-results div #patient-count-box')).toBeDefined();
		});
		
		it("initializes the filterList", function(){
			expect($('#query-builder#query-results')).toBeDefined();
		});
	});
});