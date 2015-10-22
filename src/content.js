g_show_panel_lock = 0;
g_now_playing = 0;

function add_only_one(id_name, content)
{
	if (0 == $('#' + id_name, parent.document.body).length)
		$(parent.document.body).append('<div id="' + id_name + '">' + content + '</div>');
}

$(document).ready(function(){
	add_only_one('jquery_jplayer_1', '');
	add_only_one('jquery_jplayer_2', '');
	swf_path = chrome.extension.getURL("jquery.jplayer.swf");

	$("#jquery_jplayer_1").jPlayer({
		//以下不能解决opera播放mp3的问题，不知为何
		//supplied: "mp3",
		//swfPath: swf_path,
		//solution: "flash, html",
		loop: false,
		wmode: "window"
	});

	$("#jquery_jplayer_2").jPlayer({
		//以下不能解决opera播放mp3的问题，不知为何
		//supplied: "mp3",
		//swfPath: swf_path,
		//solution: "flash, html",
		loop: false,
		wmode: "window"
	});

	//console.log('loading flash player:' + swf_path);

	chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  var replaced = request.my_msg;
		/* ignore some char that causes API returning ERR 500 */
	  replaced = replaced.replace(/</g, ' ');
	  replaced = replaced.replace(/>/g, ' ');
	  to_speech(replaced);
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

jQuery.fn.top_center = function () 
{
	this.css("position","fixed");
	this.css("top", "0px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
				$(window).scrollLeft()) + "px");
	return this;
}

$(window).scroll(function() 
{ 
	$('#jquery_jplayer_status').center(); 
	$('#jquery_jplayer_vi_panel').top_center(); 
});

function show_load_status()
{
	add_only_one('jquery_jplayer_status', str_loading());
	//old version uses: 
	//parent.$('body').append('<div id="jquery_jplayer_status">' + str_loading() + '</div>');
	
	$("#jquery_jplayer_status").css({
		"background-color": "yellow",
		"font-family": "DejaVu Sans",
		"border-style" : "outset", 
		"-webkit-box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
		"-moz-box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
		"box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
		"z-index":"99999999"
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
		"z-index":"99999999"
	}).top_center().hide();	

	$('#jquery_jplayer_vi_panel').top_center(); 
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
	setTimeout(function(){ try_show_panel(); }, 3000);
}

function hide_panel()
{
	$("#jquery_jplayer_vi_panel").fadeOut(700,function() {$(this).remove();});
	g_show_panel_lock = 1;
}

function str_loading()
{
	var loader = '<img style="float: left;" src="' + chrome.extension.getURL("loader.gif") + '" border="0"/>';
	return loader + '<div style="float: right; font-size:15px; padding: 8px 10px 0px 10px; color: #222;"><span id="jquery_jplayer_status_span">Speach Loading...</span></div>';
}

function str_panel()
{
	return '<div id="user_play_speech_link" class="panel_click_button">&#9654;</div> <div id="user_pause_speech_link" class="panel_click_button">&#8545;</div> <div id="user_stop_speech_link" class="panel_click_button">&#9726;</div> &nbsp; Show me your support <a href="https://chrome.google.com/webstore/detail/voice-instead/kphdioekpiaekpmlkhpaicehepbkccbf/reviews" target="_blank">here</a>!';
}

function tts(text, turn, pause_at_start, u_are_final_buf) {
  //var tts_api_url = "http://api.voicerss.org/?key=a6c5417f9311468eac17ef8f62922d92&c=WAV&hl=en-us&f=22khz_8bit_mono&src=" + encodeURIComponent(text);
  //上面是公开的API，优点是无限句子长度，缺点是限流量。
  var tts_api_url = "http://www.voicerss.org/controls/speech.ashx?hl=en-us&src=" + encodeURIComponent(text); // + "&c=ogg";// 开启之后没有duration. 
  //上面是demo页面的调用，只是限句子长度，应该不限流量，正合我意。

  var lock=0;
  var turns=[$("#jquery_jplayer_1"), $("#jquery_jplayer_2")];
  
  turns[turn].unbind($.jPlayer.event.timeupdate).bind($.jPlayer.event.timeupdate, function(my_event) { 
	var status = my_event.jPlayer.status;
	var left_time = status.duration - status.currentTime; 
	
	if (!lock && status.duration > 0) {
	  lock = 1;
	  hide_load_status();
	  delay_and_show_panel();
	}

	//console.log('left time:' + status.duration + ' - ' + status.currentTime);
	
	if (status.duration > 0 && left_time < 1.2) {
		console.log('player ' + turn + ' ending... Am I the final one? ' 
		            + u_are_final_buf);
			
		if (u_are_final_buf) {
			turns[turn].jPlayer("stop");
			hide_panel();
		} else {
			console.log('buffered player ' + (turn+1)%2 + ' palys');

			g_now_playing = (turn+1)%2;
			console.log('Now playing ' + g_now_playing + ' ...');

			turns[(turn+1)%2].jPlayer("unmute");
			turns[(turn+1)%2].jPlayer("play");
			wrap_tts(turn, 1);
		}
	}
	
  });
  
  turns[turn].jPlayer("setMedia", {
    mp3: tts_api_url
  }).jPlayer("load");
  console.log('player ' + turn + ' buffers: ' + text);

  if (pause_at_start) {
	  turns[turn].jPlayer("mute");
  } else {
	  console.log('player ' + turn + ' plays ');
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
  console.log('Now playing ' + g_now_playing + ' ...');
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
				if (idx == 0) {
					/* WTF ... */
					sub_idx = min_len - idx - 1;
					idx += sub_idx + 1; /* exactly min_len */
					console.log('slice: force increment, len = ' + sub_idx);
				} else {
					/* just give up the next word */
					sub_idx = 0;
					not_break = 0;
					console.log('slice: give up the next word. (zero increment)');
				}
			} else {
				console.log('slice: increment by space, len = ' + sub_idx);
				idx += sub_idx + 1;
			}
		} else {
			console.log('slice: increment by period/comma, len = ' + sub_idx);
			idx += sub_idx + 1;
		}

		sub_str = sub_str.substr(sub_idx + 1);
	}

	return idx;
}
