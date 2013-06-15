/**
 * Developed by @fabiopmhs
 * 2011
*/

var keypass4all = {
	encrypt_key : null,
	host: null,

	get_host : function () {
		if (!this.host) {
			this.host = String(document.location.host).replace(/^ww\w*\./, "");
		}
		return this.host;
	},

	set : function (private_key) {
		if (this.is_key(private_key)) {
			this.encrypt_key = this.encrypt(this.get_host() + private_key);
		} else {
			console.error("keypass4all: Invalid private password format.");
		}
	},

	put : function () {
		if (this.encrypt_key) {
			var i, inputs = document.getElementsByTagName("input");
			for (i = 0; i < inputs.length; i++) {
				if (inputs[i].type.toLowerCase() === "password") {
					inputs[i].value = this.encrypt_key;
				}
			}
		} else {
			console.error("keypass4all: Encrypt key is null.");
		}
	},

	encrypt: function (str) {
		var pos, number, upper, lower, md5 = MD5(str);

		// DEBUG
		console.log("original: ", str);
		console.log("encrypt: ", md5);

		if (!md5) {
			console.error("Invalid MD5 return.");
			return "";
		}

		pos = Number(String(md5.match(/\d+/g).join("")).substring(0,10));
		if (isNaN(pos)) {pos = 3;}
		else {
			number = pos - parseInt(pos/10, 10)*10;
			pos = String(pos / (pos + 3));
			pos = pos.charAt(pos.length-1);
		}
		
		upper = String(md5.match(/[a-z]+/g).join(""));
		if (!upper) {upper = "H";}
		else {
			lower = upper.charAt(0).toLowerCase();
			upper = upper.charAt(upper.length-1).toUpperCase();
		}
				
		md5 = String(md5).substr(0, 10) + number + lower;
		
		md5 = md5.split("");
		md5[pos] = "!@#$%&*{}:".charAt(pos);
		md5[pos-1] = upper;
		md5 = md5.join("");
		
		console.log("key: ", md5);
		
		return md5;
	},

	is_key : function (s) {
		if (s && typeof s === "string") {
			return true;
		}
		return false;
	}
};


chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	if (request.private_key) {
		keypass4all.set(request.private_key);
		keypass4all.put();

		sendResponse({encrypt_key: keypass4all.encrypt_key});
	} else { // snub them.
		sendResponse({});
	}
});