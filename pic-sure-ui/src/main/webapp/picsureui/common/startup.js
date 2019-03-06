define(["filter/filterList", "header/header", "footer/footer", "text!../settings/settings.json", "output/outputPanel", "picSure/resourceMeta", "jquery", "handlebars", "text!common/mainLayout.hbs", "treeview", "common/styles"],
    function(filterList, header, footer, settings, output, resourceMeta, $, HBS, layoutTemplate){
        var redirection_url = "/psamaui/login?redirection_url=" + "/picsureui/";
        return function(){
            var session = JSON.parse(sessionStorage.getItem("session"));
            if(!session || !session.token){
                window.location = redirection_url;
            }
            $.ajax({
                // Validation call
                url: window.location.origin + '/picsure/resource',
                headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem("session")).token},
                contentType: 'application/json',
                type:'GET',
                success: function(){
                    console.log("login successful");
                    localStorage.setItem("id_token", JSON.parse(sessionStorage.getItem("session")).token);
                    $.ajaxSetup({
                        error: function(event, jqxhr){
                            console.log(jqxhr);
                            window.location = redirection_url;
                        }
                    });
                    $('body').append(HBS.compile(layoutTemplate)(JSON.parse(settings)));
                    var headerView = header.View;
                    headerView.render();
                    $('#header-content').append(headerView.$el);
                    var footerView = footer.View;
                    footerView.render();
                    $('#footer-content').append(footerView.$el);
                    filterList.init();
                    var outputPanel = output.View;
                    outputPanel.render();
                    $('#query-results').append(outputPanel.$el);
                },
                error: function(jqXhr){
                    if(jqXhr.status === 401){
                        window.location = redirection_url;
                    }else{
                        console.log("ERROR in startup.js!!!");
                    }
                },
                dataType: "json"
            });
        }
    });