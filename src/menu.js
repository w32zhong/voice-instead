function selectionOnClick(info, tab) {
  chrome.tabs.sendMessage(tab.id, {my_msg: info.selectionText});
}

var selection = chrome.contextMenus.create({"title": "Voice Instead","contexts":["selection"],"onclick":selectionOnClick});
