define(["common/spinner", "backbone", "handlebars", "text!filter/searchResult.hbs"],
    function(spinner, BB, HBS, searchResultTemplate){
        var searchResultModel = BB.Model.extend({

        });

        var searchResultView = BB.View.extend({
            initialize: function(opts){
                this.searchResult = opts.searchResult;
                this.filterView = opts.filterView;
                this.template = HBS.compile(searchResultTemplate);
                this.queryCallback = opts.queryCallback;
            },
            tagName: "div",
            className: "picsure-border-frame",
            events: {
                "click .autocomplete-term" : "onClick",
                "click .pui-elipses" : "toggleTree"
            },
            toggleTree: function () {
                $('.node-tree-view', this.$el).toggle()

            },
            onClick : function(event){
                console.log("Search result clicked");

                this.filterView.model.set("inclusive", $('.filter-qualifier-btn', this.filterView.$el).text().trim() === "Must Have");
                this.filterView.model.set("and", $('.filter-boolean-operator-btn', this.filterView.$el).text().trim() === "AND");

                var value = $('.autocomplete-term', this.$el);
                if(value){
                    $('input.search-box', this.filterView.$el).val($('.autocomplete-term', this.$el).text());
                    var pui = $('.pui-elipses', this.$el).data('pui');
                    this.filterView.model.set("searchTerm", pui);
                    this.filterView.model.set("searchValue", this.model.get("value"));
                    this.filterView.model.set("category", this.model.get("category"));

                    this.filterView.$el.addClass("saved");
                    this.filterView.render();
                    $('.filter-boolean-operator', this.filterView.$el).removeClass('hidden');
                }
                if(this.filterView.model.get("searchTerm").trim().length > 0){
                    this.queryCallback();
                }

            },
            render: function(){
                var isNotStandardI2b2 = this.model.get("data").indexOf("~") == -1;
                var throwawaySegments = isNotStandardI2b2 ? 6 : 0;
                var puiSegments = this.model.get("data").indexOf("~") == -1 ? this.model.get("data").split("/") : this.model.get("tooltip").split("\\");

                var finalTree = [];
                var lastNode;
                for (var i = puiSegments.length - 1; i >= throwawaySegments; i--){
                    var puiSegment = puiSegments[i];

                    if (puiSegment.length > 0) {
                        var currentNode = {};
                        currentNode['text'] = puiSegment;
                        var nodeArray = [];
                        if (lastNode) {
                            nodeArray.push(lastNode);
                        }
                        currentNode['nodes'] = nodeArray;
                        lastNode = currentNode;
                    }
                }
                finalTree.push(lastNode);

                this.$el.html(this.template(this.model.attributes));
                $('.node-tree-view', this.$el).treeview({
                    backColor: "#ffffff",
                    expandIcon: 'glyphicon glyphicon-chevron-down',
                    collapseIcon: 'glyphicon glyphicon-chevron-right',
                    data: finalTree
                });
                $('.node-tree-view', this.$el).treeview('expandAll');
            }
        });
        return {
            View : searchResultView,
            Model : searchResultModel
        };
    });