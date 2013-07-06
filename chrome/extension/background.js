/*!
 * My Password
 * http://phms.com.br/keypass4all/
 *
 * Developed by @fabiophms
 * 2011-2013
 */

var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

chrome[runtimeOrExtension].onMessage.addListener(function (request, sender, sendResponse) {
	chrome.tabs.getSelected(null, function (tab) {
		console.log(tab.url);
		if(request.greeting == "start") {
			sendResponse(tab);
		}
	});

	return true;
});
