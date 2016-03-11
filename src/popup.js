function send_msg(msg_header, msg) {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				'my_msg_type': msg_header,
				'my_msg': msg
			}
		);
	});
}

angular.module('Hello', []).controller('HelloCtrl', function($scope) {
	send_msg("stop_cur_speech", 'empty');

	config_read(function (cf) {
		$scope.$apply(function () {
			$scope.selectSpeed = cf.selectSpeed;
			$scope.selectVolume = cf.selectVolume;
			$scope.selectVoice = cf.selectVoice;
			$scope.api_opt = cf.api_opt;
		});
		
		/* in case of deleting storage during session */
		send_msg("adjust_parameters", cf);
	});

	$scope.on_change = function() {
		var new_config =  {
			'selectSpeed': $scope.selectSpeed,
			'selectVolume': $scope.selectVolume,
			'selectVoice': $scope.selectVoice,
			'api_opt': $scope.api_opt,
		};

		send_msg("adjust_parameters", new_config);
		config_write(new_config);
	};

	$scope.test_sentence = function() {
		console.log("test request sent");
		send_msg("select_and_tts",  "This is an example speech.");
	};

	$scope.reset_to_default = function() {
		cf = config_default();
		$scope.selectSpeed = cf.selectSpeed;
		$scope.selectVolume = cf.selectVolume;
		$scope.selectVoice = cf.selectVoice;
		$scope.api_opt = cf.api_opt;
		config_write(cf);

		send_msg("adjust_parameters", cf);
	};
});
