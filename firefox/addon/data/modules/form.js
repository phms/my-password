/*!
 * My Password
 * http://phms.com.br/keypass4all/
 *
 * Developed by @fabiophms
 * 2012
 */

var host = document.getElementById("field_host"),

key = document.getElementById('field_key'),

field1 = document.getElementById("field_1"),

field2 = document.getElementById("field_2"),

enableDoubleCheck = false,

skinPath = "../skin/",

lineHeight = 15,

changeHostname = function(){
    host.className = "";
	host.readOnly = false;
	host.focus();
},

copyKeyToClipboard = function(){
	var type = key.type;
	key.type = "text";
	self.port.emit("copy", key.value);
	key.type = type;
},

toggleKeyFieldType = function(img){
    if (img){
    	if (String(key.type).toLowerCase() == "text") {
    		key.type = "password";
    		img.src = skinPath + "font.png";
    	} else {
    		key.type = "text";
    		key.select();
    		img.src = skinPath + "asterisk_yellow.png";
    	}
    }
},

toggleDoubleCheck = function(){
	var tr = document.getElementById("tr_field_2");
    document.getElementById("img_field_2").style.display = "none";

	if (!enableDoubleCheck){
		tr.style.display = "table-row";
		key.value = "";
		enableDoubleCheck = true;
        self.port.emit("resize", lineHeight);
	} else {
		tr.style.display = "none";
		field2.value = "";
		enableDoubleCheck = false;
        self.port.emit("resize", -lineHeight);
	}
},

checkKeypass = function(){
	var img = document.getElementById("img_field_2");
	img.src = skinPath + ((field1.value !== field2.value) ? "stop.png" : "accept.png");
	img.style.display = "inline";
},

closeForm = function(){
    self.port.emit("close");
},

showMsg = function(msg){
    var box = document.getElementById("tr_msg");
    if (msg) {
        (box.getElementsByTagName("td")[0]).textContent = msg;
        box.style.display = "table-row";
        self.port.emit("resize", lineHeight);
    } else {
        box.style.display = "none";
        self.port.emit("resize", -lineHeight);
    }
},

generateKey = function() {
	var f1 = field1.value,
		f2 = field2.value;

	if (f1 && enableDoubleCheck && f1 !== f2) {
        showMsg("Double check not match!");
		field2.value = "";
        field2.focus();
	} else if (f1 || (enableDoubleCheck && f1 === f2)) {
		myPassword.set(host.value, f1);
		key.value = myPassword.get();

		if (typeof self !== "undefined") {
            self.port.emit("password", myPassword.get());
		}
        showMsg("New key applied in the form");
	} else if (!f1) {
		closeForm();
	}
};

document.getElementById("img_host").onclick = changeHostname;
document.getElementById("img_check").onclick = toggleDoubleCheck;
document.getElementById("img_copy").onclick = copyKeyToClipboard;
document.getElementById("img_key").onclick = function(){toggleKeyFieldType(document.getElementById("img_key"));};
document.getElementById("field_2").onchange = checkKeypass;
document.getElementById("btn_run").onclick = generateKey;

self.port.on("show", function (host, icon) {
    if (icon) { 
        document.getElementById("img_host").setAttribute("src", icon);
    }

    if (host && "string" == typeof(host)){
	    document.getElementById("field_host").value = host.replace(/^ww\w*\./, "");
        field1.focus();
    } else {
        changeHostname();
    }

	// document.getElementById("label_host").textContent = chrome.i18n.getMessage("label_host") + ":";
	// document.getElementById("label_field_1").textContent = chrome.i18n.getMessage("label_field_1") + ":";
	// document.getElementById("label_field_2").textContent = chrome.i18n.getMessage("label_field_2") + ":";
	// document.getElementById("label_key").textContent = chrome.i18n.getMessage("label_key") + ":";
	// document.getElementById("label_button").textContent = chrome.i18n.getMessage("label_button");
});

self.port.on("hide", function () {
    host.value = "";
    key.value = "";
    field1.value = "";
    field2.value = "";
    enableDoubleCheck = true;
    toggleDoubleCheck();
    checkKeypass();
    if (String(key.type).toLowerCase() == "text") {
        toggleKeyFieldType();
    }
    myPassword.clear();
    showMsg();
});
