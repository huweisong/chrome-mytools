/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
tabs = [];
tab_url = '';
tab_id = 0;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tab_id = tabs[0].id;
    tab_url = tabs[0].url;
    $('#page_qrcode').html('<img src="http://qr.liantu.com/api.php?text='+encodeURIComponent(tab_url)+'">');

    $('a').on('click', function(e) {
        chrome.tabs.create({tab_url:this.href,selected:true});
    });
});

//配置文件会调用此
function cfgReadyFun(cfg) {
  cfg = typeof(cfg) == "undefined" ? _HU_cfg : cfg ;
  if(typeof(cfg.content_scripts_exec_list) == "object"){
    var exec_list = cfg.content_scripts_exec_list;
    renderContentScriptConf(exec_list);
  }
}
/**
* 渲染脚本内容
*/
function renderContentScriptConf(exec_list){
  var panel_html=$("#content_scripts_exec_panel").html();
  for(var i=0;i<exec_list.length;i++){
    for(var j=0;j<exec_list[i].urls.length;j++){
      if(exec_list[i].urls[j]!="" && tab_url.indexOf(exec_list[i].urls[j]) === 0){
        var p = $('<p><input type="checkbox"/><label></label></p>');
        $('label',p).text(exec_list[i].title);
        $('input',p).prop('checked',exec_list[i].status==1).attr('title',exec_list[i].title);
        $("#content_scripts_exec_panel").append(p);
        break;
      }
    }
  }
  $("#content_scripts_exec_panel>p input[type=checkbox]").on('click',function(e){
    var checked = $(this).is(':checked');
    var title = $(this).attr('title');
    var exec_list = _HU_cfg.content_scripts_exec_list;
    for(var i=0;i<exec_list.length;i++){
      for(var j=0;j<exec_list[i].urls.length;j++){
        if(exec_list[i].urls[j]!="" && tab_url.indexOf(exec_list[i].urls[j]) === 0 && title==exec_list[i].title){
          _HU_cfg.content_scripts_exec_list[i].status = checked?1:0;
          break;
        }
      }
    }
    saveCfg(_HU_cfg);
    _HU_Notification.show("保存配置成功\r\n一秒钟后刷新页面");

    chrome.tabs.sendMessage(tab_id, {op: "reload" ,timeout:1000}, function(response) {
      console.log(response);
    });

  });
}

$('.panel-body').hide();
$('.panel-heading').on('click',function(e){
  $('.panel-body',$(this).parents('.main>.panel')).toggle('slow');
});
