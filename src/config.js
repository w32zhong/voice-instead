function config_default() {
	return {
		'selectSpeed': "0.5",
		'selectVolume': "1.0",
		'selectVoice': "US"
	};
}

function isEmpty(obj) {
	if (obj.selectSpeed == null ||
	obj.selectVolume == null ||
	obj.selectVoice == null)
		return true;
	else
		return false;
}

function config_read(ret_callbk) {
	chrome.storage.local.get(null, function (config) {
		if (isEmpty(config)) {
			console.log('first time read config, set to default values.');
			config = config_default();
			config_write(config);
		}

		ret_callbk(config);
	});
}

function config_write(config) {
	console.log("writing new config...");
	console.log(config);
	chrome.storage.local.set(config);
}
