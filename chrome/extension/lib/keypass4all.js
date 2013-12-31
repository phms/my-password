/*!
 * My Password
 * http://phms.com.br/mypass/
 *
 * Developed by @fabiophms
 * 2011-2013
 */

var keypass4all = {
	encrypt_key : null,

	set : function (host, private_key) {
		if (this.is_string(host) && this.is_string(private_key)) {
			this.encrypt_key = this.encrypt(host + private_key);
		} else {
			console.error("keypass4all: Invalid hostname or private password format.");
		}
	},
	
	get : function () {
		return this.encrypt_key;
	},

	is_string : function (s) {
		if (s && typeof s === "string") {
			return true;
		}
		return false;
	},

	encrypt: function (str) {
		var pos, number, upper, lower, md5 = MD5(str);

		// console.log("original: ", str);
		// console.log("encrypt: ", md5);

		if (!md5) {
			console.error("keypass4all: Invalid MD5 return.");
			return "";
		}

		pos = Number(String(md5.match(/\d+/g).join("")).substring(0,10));
		if (isNaN(pos)) {
			number = 7;
			pos = 3;
		} else {
			number = pos % 10;
			pos = pos % 8;
		}
		
		// console.log("pos: ", pos);
		
		upper = md5.match(/[a-z]/g);
		if (upper.length === 0) {
			lower = "w";
			upper = "H";
		}
		else {
			lower = upper[pos%upper.length].toLowerCase();
			upper = upper[upper.length-1].toUpperCase();
		}

		md5 = String(md5).substr(0, 8) + number + lower;
		
		md5 = md5.split("");
		md5[pos] = "!@#$%&{}".charAt(pos);
		md5[Math.abs(pos-3)] = upper;
		md5 = md5.join("");
		
		// console.log("key: ", md5);
		
		return md5;
	}
};