function ApplyToAllTabsOpened() {
  chrome.windows.getAll({'populate': true}, function(windows) {
    for (var i = 0; i < windows.length; i++) {
      var tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
	chrome.tabs.executeScript(tabs[j].id, {file: "jquery.min.js"});
	chrome.tabs.executeScript(tabs[j].id, {file: "jquery.jplayer.min.js"});
        chrome.tabs.executeScript(tabs[j].id, {file: "content.js"});
      }
    }
  });
}

function selectionOnClick(info, tab) {
  chrome.tabs.sendMessage(tab.id, {my_msg: info.selectionText});
}

var selection = chrome.contextMenus.create({"title": "Voice Instead","contexts":["selection"],"onclick":selectionOnClick});

ApplyToAllTabsOpened();
