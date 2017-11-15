/**
* background js listener some event
*/

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    var type = request.type?request.type:"!! bad !!";
    if(type == 'notification'){
      _HU_Notification.show(request.body,request.title,request.time);
    }
    sendResponse({return_msg: "get "+type+" request"}); // optional response
  }
);
