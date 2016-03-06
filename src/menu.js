function selectionOnClick(info, tab) {
  chrome.tabs.sendMessage(tab.id, {my_msg_type: "select_and_tts", my_msg: info.selectionText});
}

chrome.contextMenus.create({"title": "Voice Instead","contexts":["selection"],"onclick":selectionOnClick});
