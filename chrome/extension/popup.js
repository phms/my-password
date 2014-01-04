/*!
 * My Password
 * http://phms.com.br/mypass/
 *
 * Developed by @fabiophms
 * 2011-2013
 */

"use strict";

var VERSION = "1.16";

var track = {
	send: function(src) {
		(new Image()).src = ("https://google-analytics.com/collect?v=1&z=0&tid=UA-17169655-9&an=My%20Password&av=" + VERSION + "&cid=" + track.id() + src);
	},

	log: function(tag) {
		track.send("&t=appview&cd=" + encodeURIComponent(tag));
	},

	error: function(msg, fatal) {
		track.send("&t=exception&exd=" + encodeURIComponent(msg) + (fatal ? "&exf=0" : ""));
	},

	id: function() {
		var id = localStorage.getItem("googleAnalyticsAnonymousId");
		if (!id) {
			id = (Math.random() * (new Date()).getTime());
			localStorage.setItem('googleAnalyticsAnonymousId', id);
		}

		track.id = function() {
			return id;
		};
		return id;
	}
};

track.log("/start");

function MENU() {
	this.host = document.getElementById("field_host");
	this.key = document.getElementById("field_key");
	this.field1 = document.getElementById("field_1");
	this.field2 = document.getElementById("field_2");
	this.img = document.getElementById("img_key");
	this.enableDoubleCheck = false;

	this.changeHostname = function() {
		this.host.className = "";
		this.host.readOnly = false;
		this.host.focus();

		track.log("/btn/changeHostname");
	};

	this.copyKeyToClipboard = function() {
		var type = this.key.type;
		this.key.type = "text";
		this.key.select();
		document.execCommand("Copy");
		this.key.type = type;

		track.log("/btn/copyKeyToClipboard");
	};

	this.toggleKeyFieldType = function() {
		if (String(this.key.type).toLowerCase() === "text") {
			this.key.type = "password";
			this.img.src = "img/font.png";

			track.log("/btn/toggleKeyFieldType/password");
		} else {
			this.key.type = "text";
			this.key.select();
			this.img.src = "img/asterisk_yellow.png";

			track.log("/btn/toggleKeyFieldType/text");
		}
		// Fix to IE - http://www.codingforums.com/showthread.php?t=107073
		// function replaceT(obj){var newO=document.createElement('input');newO.setAttribute('type','password');newO.setAttribute('name',obj.getAttribute('name'));obj.parentNode.replaceChild(newO,obj);}
	};

	this.toggleDoubleCheck = function() {
		var tr = document.getElementById("tr_field_2");

		if (!this.enableDoubleCheck) {
			this.enableDoubleCheck = true;
			tr.style.display = "table-row";
			this.key.value = "";
			this.field2.focus();

			track.log("/btn/toggleDoubleCheck/true");
		} else {
			this.enableDoubleCheck = false;
			tr.style.display = "none";
			this.field2.value = "";
			//this.field2.style.display = "none";

			track.log("/btn/toggleDoubleCheck/false");
		}
	};

	this.checkKeypass = function() {
		var result = (this.field1.value !== this.field2.value),
			img = document.getElementById("img_field_2");
		img.src = result ? "img/stop.png" : "img/accept.png";
		img.style.display = "inline";

		track.log("/alert/doubleCheckResult/" + result);
	};

	this.generateKey = function() {

		var f1 = this.field1.value,
			f2 = this.field2.value,
			msg = document.getElementById("tr_msg");

		msg.style.display = "none";

		track.log("/btn/generateKey");

		if (f1 && this.enableDoubleCheck && f1 !== f2) {
			(msg.getElementsByTagName("td")[0]).textContent = chrome.i18n.getMessage("wrong_key_check");
			msg.style.display = "table-row";
			this.field2.value = "";
			this.field2.focus();

			track.log("/alert/wrongKeyCheck");
		} else if (f1 || (this.enableDoubleCheck && f1 === f2)) {
			keypass4all.set(this.host.value, f1);
			this.key.value = keypass4all.get();

			if (chrome && chrome.runtime) {
				chrome.tabs.executeScript(null, {
					code: "var keypass4all = '" + keypass4all.get() + "';",
					allFrames: true
				});
				chrome.tabs.executeScript(null, {
					file: "/tabs.js",
					allFrames: true
				});

				track.log("/success");
			}
		} else if (!f1) {
			track.log("/close");

			window.close();
		}
	};
}


function addEvent(id, event, func) {
	document.getElementById(id).addEventListener(event, function() {
		menu[func]();
	});
}


if (chrome && chrome.runtime) {
	var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? "runtime" : "extension";

	chrome[runtimeOrExtension].sendMessage({
		greeting: "start"
	}, function(response) {
		var tab = response,
			url = document.createElement("a");

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

		//window.menu = new MENU();

		track.log("/chromeRuntime");

		return true;
	});
} else {
	track.error("ReferenceError: 'chrome.runtime' is not defined");
}

document.onkeydown = function(e) {
	if (e.keyCode === 9) { //tab
		e.preventDefault();
		if (document.activeElement.id === "field_1") {
			menu.toggleDoubleCheck();
		} else if (document.activeElement.id === "field_2") {
			menu.checkKeypass();
			menu.generateKey();
		}
	}

	if (e.keyCode == 13) { //enter
		e.preventDefault();
		menu.checkKeypass();
		menu.generateKey();
	}
};

document.addEventListener("DOMContentLoaded", function() {
	window.menu = new MENU();

	addEvent("img_host", "click", "changeHostname");
	addEvent("img_field_1", "click", "toggleDoubleCheck");
	addEvent("img_key", "click", "toggleKeyFieldType");
	addEvent("field_2", "change", "checkKeypass");
	addEvent("button", "click", "generateKey");
	addEvent("img_button", "click", "copyKeyToClipboard");

	menu.field1.focus();

	track.log("/load");
});