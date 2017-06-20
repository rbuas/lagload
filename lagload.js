lagload = (function () {

    var lagload = {
        onload: function (callback) {
            if (!callback || typeof (callback) != "function") return console.log("lagload parameter error");
            if (window.addEventListener) { // W3C standard
                window.addEventListener('load', callback, false);
            }
            else if (window.attachEvent) { // Microsoft
                window.attachEvent('onload', callback);
            }
        },

        onready: function (callback) {
            if (!callback || typeof (callback) != "function") return console.log("lagload parameter error");
            if (window.addEventListener) { // W3C standard
                document.addEventListener('DOMContentLoaded', callback);
            }
            else if (window.attachEvent) { // Microsoft
                document.attachEvent("onreadystatechange", function () {
                    if (document.readyState === "complete") {
                        callback();
                    }
                });
            }
        },

        loadjs : function (url, callback){
            var self = this;

            self.onload(function() {
                addElement(url, "head", "script", callback);
            });
        },

        loadalljs : function (list, callback) {
            var self = this;
            if(!list || !list.length) return;

            self.onload(function() {
                callListSync(list, "body", "script", callback);
            });
        },

        loadcss : function (href, callback) {
            var self = this;
            self.onload(function() {
                addElement(href, "head", "link", callback);
            });
        }
    };



    // PRIVATE
    function addElement (url, where, type, callback) {
        if(!url || !where || !type) return;

        var elem = document.createElement(type);
        switch(type) {
            case("script") : elem.type = "text/javascript"; elem.src = url; break;
            case("link") : elem.rel = "stylesheet"; elem.href = url; break;
        }

        if(callback) {
            if (elem.readyState){  //IE
                elem.onreadystatechange = function(){
                    if (elem.readyState == "loaded" || elem.readyState == "complete") {
                        elem.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                elem.onload = function(){
                    callback();
                };
            }
        }

        document.getElementsByTagName(where)[0].appendChild(elem);
    }

    function callListSync (list, where, type, complete, index) {
        index = index || 0;
        if(index < 0 || index >= list.length) {
            if(complete) complete();
            return;
        }

        var item = list[index];
        addElement(item, where, type, function() {
            callListSync(list, where, type, complete, index + 1);
        });
    }
    return lagload;
})();