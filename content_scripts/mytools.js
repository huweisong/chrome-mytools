/**
 * Created by weisong3 on 16/9/14.
 */

//配置文件会调用此
function cfgReadyFun(cfg) {
  cfg = typeof(cfg) == "undefined" ? _HU_cfg : cfg ;
  if(typeof(cfg.content_scripts_exec_list) == "object"){
    var exec_list = cfg.content_scripts_exec_list;
    execContentScript(exec_list)
  }
}
/**
* 执行页面增强script
*/
function execContentScript(exec_list){
  for(var i=0;i<exec_list.length;i++){
    if(exec_list[i].status != 1) continue;
    for(var j=0;j<exec_list[i].urls.length;j++){
      if(exec_list[i].urls[j]!="" && window.location.href.indexOf(exec_list[i].urls[j]) === 0){
        if(exec_list[i].timeout>0){
          setTimeout('execContentScriptItem('+JSON.stringify(exec_list[i])+')',exec_list[i].timeout);
        }else{
          execContentScriptItem(exec_list[i]);
        }
        break;
      }
    }
  }
}

function execContentScriptItem(exec_item){
  eval(exec_item.script);
  _HU_Notification.http_content_show(exec_item.desc,exec_item.title);
}


/**
 * 可以接受popup的消息
 */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse,oteh) {
    console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
        "from the extension");
    console.log(request)
    if(typeof (request)!="undefined" && typeof (request.op)=='string'){
        switch (request.op){
            case "reload":
                console.log(request);
                if(request.timeout>0){
                  setTimeout(function(){
                    location.reload();
                  },request.timeout)
                }else{
                  location.reload();
                }
                sendResponse({op:'finish'});
                break;
            default:break;
        }
    }
});
