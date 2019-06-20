define(["filter/filterList", "header/header", "footer/footer", "text!../settings/settings.json", "output/outputPanel",
        "picSure/resourceMeta", "jquery", "handlebars", "text!common/mainLayout.hbs",
        "text!common/sessionExtendView.hbs", "text!options/modal.hbs", "treeview", "common/styles",],
    function(filterList, header, footer, settings, output, resourceMeta, $, HBS, layoutTemplate, sessionExtendHBS, modalHBS){
        var redirection_url = "/psamaui/login?redirection_url=" + "/picsureui/";
        return function(){
            var session = JSON.parse(sessionStorage.getItem("session"));
            var sessionExtendTemplate = HBS.compile(sessionExtendHBS);
            var modalTemplate = HBS.compile(modalHBS);
            if(!session || !session.token){
                window.location = redirection_url;
            }

            var timeout = JSON.parse(settings).timeout;
            if (!timeout || timeout<=0){
                timeout = 15*60;
            }

            var checkSessionTimeout = function(stillRunning){
                setTimeout(function(){
                    var lastActivityTime = sessionStorage.getItem("lastActivityTime");
                    var currentDate = new Date();
                    var secondsDifference = ((currentDate.getTime() - lastActivityTime)/1000).toFixed(0);
                    if (secondsDifference <= timeout){
                        if (secondsDifference == (timeout - 60)){
                            $("#modal-window", this.$el).html(modalTemplate({title: "Extend Session"}));
                            $("#modalDialog", this.$el).show();
                            $(".modal-body", this.$el).html(sessionExtendTemplate());
                            $("#session-extend-ok-button").on("click", function(){
                                sessionStorage.setItem("lastActivityTime", new Date().getTime());
                                $("#modalDialog", this.$el).hide();
                            });
                            $("#session-extend-ok-button").on("click", function(){
                                sessionStorage.setItem("lastActivityTime", new Date().getTime());
                                $("#modalDialog", this.$el).hide("");
                            });
                        }
                        stillRunning();
                    } else {
                        sessionStorage.clear();
                        localStorage.clear();
                        window.location = "/";
                    }
                }, 1000);
            };

            $.ajax({
                // Validation call
                url: window.location.origin + '/picsure/info/resources',
                headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem("session")).token},
                contentType: 'application/json',
                type:'GET',
                success: function(){
                    console.log("login successful");

                    sessionStorage.setItem("lastActivityTime",new Date().getTime());
                    var stillRunning = function(){
                        checkSessionTimeout(stillRunning);
                    };
                    stillRunning();

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