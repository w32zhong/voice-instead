g_show_panel_lock = 0;
g_now_playing = 0;
g_api_parameters = {};

function add_only_one(id_name, content)
{
	if (0 == $('#' + id_name, parent.document.body).length)
		$(parent.document.body).append('<div id="' + id_name + '">' + content + '</div>');
}

$(document).ready(function(){
	add_only_one('jquery_jplayer_1', '');
	add_only_one('jquery_jplayer_2', '');

	$("#jquery_jplayer_1").jPlayer({
		loop: false,
		wmode: "window"
	});

	$("#jquery_jplayer_2").jPlayer({
		loop: false,
		wmode: "window"
	});

	console.log("Voice Instead ready.");

	config_read(function (cf) {
		g_api_parameters = cf;
		console.log(g_api_parameters);
	});

	chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.my_msg_type == "select_and_tts") {
			var replaced = request.my_msg;
			/* ignore some char that causes API returning ERR 500 */
			replaced = replaced.replace(/</g, ' ');
			replaced = replaced.replace(/>/g, ' ');
			to_speech(replaced);
		} else if (request.my_msg_type == "adjust_parameters") {
			g_api_parameters = request.my_msg;
			console.log(g_api_parameters);
		} else if (request.my_msg_type == "stop_cur_speech") {
			user_stop_speech();
		}
	});
});

jQuery.fn.center = function ()
{
	this.css("position","absolute");
	this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
				$(window).scrollTop()) + "px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
				$(window).scrollLeft()) + "px");
	return this;
}

jQuery.fn.bottom_center = function () 
{
	this.css("position","fixed");
	this.css("bottom", "0px");
	this.css("height", "-" + g_panel_height);
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
				$(window).scrollLeft()) + "px");
	return this;
}

$(window).scroll(function() 
{ 
	$('#jquery_jplayer_status').center();
	$('#jquery_jplayer_vi_panel').bottom_center();
});

function show_load_status()
{
	add_only_one('jquery_jplayer_status', str_loading());
	
	$("#user_dismiss_status_link").click(function(){ hide_load_status(); });

	$("#jquery_jplayer_status").css({
		"background-color": "yellow",
		"border": "0",
		"font-family": "DejaVu Sans",
		"border-style" : "outset", 
		"-webkit-box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
		"-moz-box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
		"box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
		"z-index": "2147483640 !important",
		"opacity": "0.99"
	}).center().hide().fadeIn();
	
	$('#jquery_jplayer_status').center(); 
}

function user_stop_speech()
{
	var turns=[$("#jquery_jplayer_1"), $("#jquery_jplayer_2")];
	turns[0].jPlayer("mute");
	turns[0].jPlayer("stop");
	turns[1].jPlayer("mute");
	turns[1].jPlayer("stop");
	hide_panel();
}

function user_pause_speech()
{
	var turns=[$("#jquery_jplayer_1"), $("#jquery_jplayer_2")];
	turns[0].jPlayer("pause");
	turns[1].jPlayer("pause");
}

function user_play_speech()
{
	var turns=[$("#jquery_jplayer_1"), $("#jquery_jplayer_2")];
	turns[g_now_playing].jPlayer("play");
}

var g_panel_height = "15 px";
function prepare_panel()
{
	add_only_one('jquery_jplayer_vi_panel', str_panel());
	
	$("#jquery_jplayer_vi_panel").css({
		"background-color": "yellow",
		"font-size": "11px",
		"text-align": "center",
		"padding": "2px 8px 2px 8px",
		"font-family": "DejaVu Sans",
		"color": "#222",
		"margin": "0 0 0 0",
		"height": g_panel_height,
		"z-index": "2147483640 !important",
		"opacity": "0.99"
	}).bottom_center().hide();	

	$('#jquery_jplayer_vi_panel').bottom_center(); 
	$("#user_stop_speech_link").click(function(){ user_stop_speech(); });
	$("#user_pause_speech_link").click(function(){ user_pause_speech(); });
	$("#user_play_speech_link").click(function(){ user_play_speech(); });
}

function hide_load_status()
{
	$("#jquery_jplayer_status").fadeOut(700, function() {$(this).remove();});
}

function try_show_panel()
{
	if (g_show_panel_lock == 0) {
		$("#jquery_jplayer_vi_panel").fadeIn();
	}
}

function delay_and_show_panel()
{
	g_show_panel_lock = 0;
	setTimeout(function(){ try_show_panel(); }, 2000);
}

function hide_panel()
{
	$("#jquery_jplayer_vi_panel").fadeOut(700,function() {$(this).remove();});
	g_show_panel_lock = 1;
}

function str_loading()
{
	var loader = '<img style="float: left;" src="' + chrome.extension.getURL("loader.gif") + '" border="0"/>';
	return loader + '<div style="float: right; font-size:15px; padding: 8px 10px 0px 10px; color: #222;">' + 
	'<span id="jquery_jplayer_status_span">Speach Loading...</span>' + 
	'<br/>' + 
	'Please note, some pages cannot load due to security reason.' + 
	'<br/>' + 
	'Click <a href="javascript:void(0)" id="user_dismiss_status_link">here</a> to dismiss.' + 
	'</div>';
}

function str_panel()
{
	var play = '<div id="user_play_speech_link" class="panel_click_button"><img src="' +
	           chrome.extension.getURL("fa-play.png") + '"/></div>';
	var pause = '<div id="user_pause_speech_link" class="panel_click_button"><img src="' +
	           chrome.extension.getURL("fa-pause.png") + '"/></div>';
	var stop = '<div id="user_stop_speech_link" class="panel_click_button"><img src="' +
	           chrome.extension.getURL("fa-stop.png") + '"/></div>';
	return play + pause + stop +
	//'<br/>Notice: We currently drop variable speed support.' +
//	'Show me your support <a href="https://chrome.google.com/webstore/detail/voice-instead/kphdioekpiaekpmlkhpaicehepbkccbf/reviews" target="_blank">here</a>!' +
	'<br/> In this version, there is a way to handle speech <i>pause-in-the-middle</i> problem!' +
	'<br/> Click upper right Voice Instead popup menu for details.';
}

function tts(text, turn, pause_at_start, u_are_final_buf) {
  var tts_api_url = 'http://example.net';
  //var tts_api_url = "http://api.voicerss.org/?key=a6c5417f9311468eac17ef8f62922d92&c=WAV&hl=en-us&f=22khz_8bit_mono&src=" + encodeURIComponent(text);
  //上面是公开的API，优点是无限句子长度，缺点是限流量。

  if (g_api_parameters.api_opt == 'old') {
	tts_api_url = "http://www.voicerss.org/controls/speech.ashx?hl=en-us&src=" + encodeURIComponent(text);
  } else {
//	  var tts_api_url = "https://text-to-speech-demo.mybluemix.net/api/synthesize?" +
//						"voice=en-US_MichaelVoice" + "&" +
//						"text=" + encodeURIComponent(text);
//    IBM Watson API for backup.

	  var voice_str = "tl=en-US";
	  if (g_api_parameters.selectVoice == "British") {
		voice_str = "tl=en-GB";
	  }
	  var tts_api_url = "https://code.responsivevoice.org/develop/getvoice.php?" +
						"rate=" + g_api_parameters.selectSpeed + "&" +
						"vol=" + g_api_parameters.selectVolume + "&" +
						voice_str + "&" +
						"t=" + encodeURIComponent(text);
	  //上面的API可以调速度！
  }

  var lock=0;
  var turns=[$("#jquery_jplayer_1"), $("#jquery_jplayer_2")];
  
  turns[turn].unbind($.jPlayer.event.timeupdate).bind($.jPlayer.event.timeupdate, function(my_event) { 
	var status = my_event.jPlayer.status;
	var left_time = status.duration - status.currentTime; 
	
	  if (!lock && status.currentTime > 0) {
		  lock = 1;
		  //console.log('lock and hide loading icon...');
		  hide_load_status();
		  delay_and_show_panel();
	  }

	console.log('['+turn+'] left time:'+status.duration+' - '+status.currentTime+' = ' +left_time);
	
	/* !! Important, if our API provides status.duration (non-zero),
	 * we should use "if (left_time < 1.2)" to start ealier on the 
	 * next sentence. */
	var left_time_trigger = 0;
	if (g_api_parameters.api_opt == 'old') {
		//left_time_trigger = 1.2
		//                     120 (default) / 100 = 1.2
		left_time_trigger = g_api_parameters.gap / 100;
		console.log('left_time_trigger = ' + left_time_trigger);
	}

	if (status.duration > 0 && left_time <= left_time_trigger) {
			
		if (u_are_final_buf) {
			console.log('[player ' + turn + ' is the final one, play to the end.]' );
			hide_panel();
		} else {
			g_now_playing = (turn+1)%2;
			//console.log('Change to ' + g_now_playing + ' playing ...');

			console.log('[buffered player ' + (turn+1)%2 + ' palys]');
			turns[(turn+1)%2].jPlayer("unmute");
			turns[(turn+1)%2].jPlayer("play");
			wrap_tts(turn, 1);
		}
	}
	
  });
  
  turns[turn].jPlayer("setMedia", {
    mp3: tts_api_url
  }).jPlayer("load");
  console.log('player ' + turn + ' buffers: [[' + text + ']]');

  if (pause_at_start) {
	  //console.log('[player ' + turn + ' mutes]');
	  turns[turn].jPlayer("mute");
  } else {
	  console.log('[first player ' + turn + ' plays]');
	  turns[turn].jPlayer("play");
  }
}

function to_speech(text) 
{
  window.remain = text;

  $("#jquery_jplayer_1").jPlayer("unmute");

  wrap_tts(0, 0);
  if ( 0 < window.remain.length)
    wrap_tts(1, 1);

  show_load_status();
  prepare_panel();

  g_now_playing = 0;
}

function wrap_tts(turn, pause_at_start)
{
  var n = slice_str(window.remain);
  var text = window.remain.substr(0,n);
  window.remain = window.remain.substr(n);

  if (window.remain == 0) {
	tts(text, turn, pause_at_start, 1);
  } else {
	tts(text, turn, pause_at_start, 0);
  }

  return window.remain;
}

function slice_str(text) 
{
	var sub_str = text;
	var sub_idx, idx = 0;
	var min_len = 80;
	var not_break = 1;

	while (idx < min_len && not_break) {
		/* try period/comma first */
		sub_idx = sub_str.search(/,|\.|;|\?/);

		if (sub_idx == -1 || idx + sub_idx > min_len) {
			/* then try space */
			sub_idx = sub_str.indexOf(' ');

			if (sub_idx == -1 || idx + sub_idx > min_len) {
				if (sub_idx == -1) {
					/* the next word is the last word, break */
					not_break = 0;
					//console.log('slice: add the last words.');
					idx += sub_str.length;
				} else {
					/* exceed min len, break */
					not_break = 0;
					//console.log('slice: now, I do not want more words.');
					idx += sub_idx + 1;
				}
			} else {
				//console.log('slice: increment by space, len = ' + sub_idx);
				idx += sub_idx + 1;
			}
		} else {
			//console.log('slice: increment by period/comma, len = ' + sub_idx);
			idx += sub_idx + 1;
		}

		//console.log('slice: [[' + text.substring(0, idx) + ']] idx = ' + idx + ' / 80');
		sub_str = sub_str.substr(sub_idx + 1);
	}

	return idx;
}
