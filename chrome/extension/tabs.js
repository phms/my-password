/*!
 * keypass4all
 * http://phms.com.br/keypass4all/
 *
 * Developed by @fabiophms
 * 2011
 */

function keypass4all_put(encrypt_key) {
	if (encrypt_key && encrypt_key.length >= 10) {
		// console.log("encrypt_key:", encrypt_key);
		var i, inputs = document.getElementsByTagName("input");
		for (i = 0; i < inputs.length; i++) {
			if (String(inputs[i].type).toLowerCase() === "password" && !inputs[i].value) {
				inputs[i].value = encrypt_key;
			}
		}
	} else {
		console.error("keypass4all: Encrypt key is null. >> " + encrypt_key);
	}
}

keypass4all_put(keypass4all);
