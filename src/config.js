function config_default() {
	return {
		'selectSpeed': "0.5",
		'selectVolume': "1.0",
		'selectVoice': "US"
	};
}

function config_read(ret_callbk) {
	chrome.storage.local.get(null, function (config) {
		ret_callbk(config);
	});
}

function config_write(config) {
	console.log("writing new config...");
	console.log(config);
	chrome.storage.local.set(config);
}
