define(["settings/settings","common/searchParser", "nav/topNav", "backbone", "common/login"], 
        function(settings, searchParser, topNav, Backbone, login){
    var Router = Backbone.Router.extend({
        routes: {
            "queryBuilder" : "displayQueryBuilder",
            "login(/)" : "login",
            "logout(/)" : "logout",
            
            // This path must be last in the list
            "*path" : "displayQueryBuilder"
        },
       
        initialize: function(){
            topNav.registerRouter(this);
            var pushState = history.pushState;
            history.pushState = function(state, title, path) {
            		if(state.trigger){
            			this.router.navigate(path, state);
            		}else{
            			this.router.navigate(path, {trigger: true});
            		}
                return pushState.apply(history, arguments);
            }.bind({router:this});
        },
       
        execute: function(callback, args, name){
            if( ! session.isValid()){
                this.login();
                return false;
            }
            if (callback) {
                    callback.apply(this, args);
            }
        },
       
        login : function(){
            topNav.clear();
            login.showLoginPage();
        },

        logout : function(){
            topNav.clear();
            sessionStorage.clear();
            window.location = "/logout";
        },

        displayPatientList : function(){
            topNav.updateTopNav("Patients", session.username);
            patientList.showPatientList(this);            
        }
    });
    return new Router();
});