/*!
 * keypass4all
 * http://phms.com.br/keypass4all/
 *
 * Developed by @fabiophms
 * 2011
 */

function MENU() {
	this.host = document.getElementById("field_host");
	this.key = document.getElementById('field_key');
	this.field1 = document.getElementById("field_1");
	this.field2 = document.getElementById("field_2");
	this.enableDoubleCheck = false;
	
	this.changeHostname = function(){
		this.host.className = "";
		this.host.readOnly = false;
		this.host.focus();
	};
	
	this.copyKeyToClipboard = function(){
		var type = this.key.type;
		this.key.type = "text";
		this.key.select();
		document.execCommand("Copy");
		this.key.type = type;
	};
	
	this.toggleKeyFieldType = function(img){
		if (String(this.key.type).toLowerCase() === "text") {
			this.key.type = "password";
			img.src = "img/font.png";
		} else {
			this.key.type = "text";
			this.key.select();
			img.src = "img/asterisk_yellow.png";
		}
		// Fix to IE - http://www.codingforums.com/showthread.php?t=107073
		// function replaceT(obj){var newO=document.createElement('input');newO.setAttribute('type','password');newO.setAttribute('name',obj.getAttribute('name'));obj.parentNode.replaceChild(newO,obj);}
	};
	
	this.toggleDoubleCheck = function(){
		var tr = document.getElementById("tr_field_2");
		
		if (!this.enableDoubleCheck){
			tr.style.display = "table-row";
			this.key.value = "";
			this.enableDoubleCheck = true;
		} else {
			tr.style.display = "none";
			this.field2.value = "";
			this.field2.style.display = "none";
			this.enableDoubleCheck = false;
		}
	};
	
	this.checkKeypass = function(){
		var img = document.getElementById("img_field_2");
		img.src = (this.field1.value !== this.field2.value) ? "img/stop.png" : "img/accept.png"
		img.style.display = "inline";
	};
	
	this.generateKey = function() {
		var f1 = this.field1.value,
			f2 = this.field2.value,
			msg = document.getElementById("tr_msg");
		
		msg.style.display = "none";
	
		if (f1 && this.enableDoubleCheck && f1 !== f2) {
			(msg.getElementsByTagName("td")[0]).textContent = chrome.i18n.getMessage("alert_wrong_key_check");
			msg.style.display = "table-row";
			this.field2.value = "";
		} else if (f1 || (this.enableDoubleCheck && f1 === f2)) {
			keypass4all.set(this.host.value, f1);
			this.key.value = keypass4all.get();
			
			if (typeof chrome !== "undefined") {
				chrome.tabs.executeScript(null, {code: "var keypass4all = '"+keypass4all.get()+"';", allFrames: true});
				chrome.tabs.executeScript(null, {file: "/tabs.js", allFrames: true});
			}
		} else if (!f1) {
			window.close();
		}
	};
}

if (typeof chrome !== "undefined") {
	chrome.tabs.getSelected(null, function (tab) {
		var url = document.createElement("a");
		url.setAttribute("href", tab.url);
		document.getElementById("field_host").value = String(url.host).replace(/^ww\w*\./, "");
	
		if (tab.favIconUrl) {
			document.getElementById("img_host").setAttribute("src", tab.favIconUrl);
		}
		
		document.getElementById("label_host").textContent = chrome.i18n.getMessage("label_host") + ":";
		document.getElementById("label_field_1").textContent = chrome.i18n.getMessage("label_field_1") + ":";
		document.getElementById("label_field_2").textContent = chrome.i18n.getMessage("label_field_2") + ":";
		document.getElementById("label_key").textContent = chrome.i18n.getMessage("label_key") + ":";
		document.getElementById("label_button").textContent = chrome.i18n.getMessage("label_button");
		
		window.menu = new MENU();
		menu.field1.focus();
	});
}
