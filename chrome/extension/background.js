/*!
 * My Password
 * http://phms.com.br/keypass4all/
 *
 * Developed by @fabiophms
 * 2011-2013
 */

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		chrome.tabs.getSelected(null, function (tab) {
			console.log(tab.url);
			if (request.greeting == "hello") {
				sendResponse(tab);
			}
		});
		
		return true;
	}
);