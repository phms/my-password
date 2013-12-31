/*!
 * My Password
 * http://phms.com.br/mypass/
 *
 * Developed by @fabiophms
 * 2011-2013
 */

(function (encrypt_key) {
	if (encrypt_key && encrypt_key.length >= 10) {
		// console.log("encrypt_key:", encrypt_key);
		var i, inputs = document.getElementsByTagName("input");
		for (i = 0; i < inputs.length; i++) {
			if (String(inputs[i].type).toLowerCase() === "password" && !inputs[i].value) {
				inputs[i].value = encrypt_key;
			}
		}
	} else {
		console.error("My Password: Encrypt key is null. >> " + encrypt_key);
	}
})(keypass4all);