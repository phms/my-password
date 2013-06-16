/*!
 * My Password
 * http://phms.com.br/keypass4all/
 *
 * Developed by @fabiophms
 * 2012
 */

var data = require("self").data;

var form = require("panel").Panel({
    width: 280,
    height: 200,
    contentURL: data.url("content/form.html"),
    contentScriptWhen: "ready",
    contentScriptFile: [
        data.url("modules/webtoolkit.md5.js"), 
        data.url("modules/core.js"), 
        data.url("modules/form.js")
    ]
});

form.on("show", function() {
    var tab = require("tabs").activeTab,
        host = require("url").URL(tab.url).host;
    form.port.emit("show", host, tab.favicon);
});

form.on("hide", function() {
    form.port.emit("hide");
});

form.port.on("password", function(password){
    require("tabs").activeTab.attach({
        contentScriptFile: data.url("modules/tab.js"), 
        contentScript: "myPassword_put('"+password+"');"
    });    
});

form.port.on("resize", function(px){
    var h = form.height + Number(px);
    h = h < 200 ? 200 : h;
    h = h > 230 ? 230 : h;

    form.resize(form.width, h);
});

form.port.on("copy", function(password){
    let clipboard = require("clipboard");
    clipboard.set(password);
});

form.port.on("close", function(){
    form.resize(form.width, 200);
    form.hide();
});

require("widget").Widget({
    label: "My Password",
    id: "my-password",
    contentURL: data.url("skin/icon.png"),
    panel: form,
});
