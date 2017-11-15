/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//chrome.tabs.query({'active': true}, function (tabs){
//    var url = tabs[0].url;
//    document.getElementById('qrcode').src = "http://qr.liantu.com/api.php?text=" + encodeURI(url);
//});
//chrome.tabs.getSelected(null,function(tab) {
//    var url = tabs.url;
//    document.getElementById('qrcode').src = "http://qr.liantu.com/api.php?text=" + encodeURI(url);
//});

//配置文件会调用此
function cfgReadyFun(cfg) {
  cfg = typeof(cfg) == "undefined" ? _HU_cfg : cfg ;
  if(typeof(cfg.content_scripts_exec_list) == "object"){
    var exec_list = cfg.content_scripts_exec_list;
    renderContentScriptConf(exec_list);
  }
  $('#cfg_json').val(JSON.stringify(cfg));
  $('#show_cfg_json').on('click',function(e){
    $('#save_cfg_json').removeClass('hidden');
    $('#cfg_json').removeClass('hidden');
  });
  $('#add_cnf').on('click',function(e){
    var panel_html=$("#content_scripts_exec_panel").html();
    var panel = $(panel_html);
    $('.panel-heading',panel).on('click',function(e){
      $('.panel-body',$(this).parents('#content_scripts_exec_list>.panel')).toggle('slow');
    });
    $("#content_scripts_exec_list").append(panel);
    bindContentScriptPanelClick();
  });
  $('#save_cfg_json').on('click',function(e){
    var cfg = JSON.parse($('#cfg_json').val().trim());
    saveCfg(cfg);
    alert("保存配置成功\r\n其他页面刷新生效");
  });
}
/**
* 渲染脚本内容
*/
function renderContentScriptConf(exec_list){
  var panel_html=$("#content_scripts_exec_panel").html();
  for(var i=0;i<exec_list.length;i++){
    var panel = $(panel_html);
    $('.panel-title',panel).text(exec_list[i].title);
    $('input[name=title]',panel).val(exec_list[i].title);
    $('input[name=desc]',panel).val(exec_list[i].desc);
    $('input[name=timeout]',panel).val(exec_list[i].timeout);
    $('textarea[name=urls]',panel).val(exec_list[i].urls.join("\n"));
    $('textarea[name=script]',panel).val(exec_list[i].script);
    $('input[name=status]',panel).prop('checked',exec_list[i].status==1);
    $('input[name=ready]',panel).val(1);

    $('.panel-body',panel).hide();
    $('.panel-heading',panel).on('click',function(e){
      $('.panel-body',$(this).parents('#content_scripts_exec_list>.panel')).toggle('slow');
    });
    if(exec_list[i].status!=1){
      $(panel).removeClass('panel-success');
    }
    $("#content_scripts_exec_list").append(panel);
  }
  bindContentScriptPanelClick();
}
/**
* 绑定点击事件
*/
function bindContentScriptPanelClick(){
  $("#content_scripts_exec_list button[tag=save]").unbind('click').on('click',function(e){
    $('input[name=ready]',$(this).parents('#content_scripts_exec_list form')).val(1);
    saveContentScriptConf();
  });
  $("#content_scripts_exec_list button[tag=del]").unbind('click').on('click',function(e){
    $(this).parents('#content_scripts_exec_list>.panel').remove();
    saveContentScriptConf();
  });
}
/**
* 保存脚本
*/
function saveContentScriptConf(){
  exec_list = [];
  $("#content_scripts_exec_list form").each(function(k,v){
    var ready = $('input[name=ready]',v).val();
    if(ready==1){
      exec_list.push({
        script:$('textarea[name=script]',v).val(),
        status:$('input[name=status]',v).is(':checked')?1:0,
        timeout:$('input[name=timeout]',v).val(),
        title:$('input[name=title]',v).val(),
        desc:$('input[name=desc]',v).val(),
        urls:$('textarea[name=urls]',v).val().split("\n")
      });
    }
  });
  _HU_cfg.content_scripts_exec_list = exec_list;
  saveCfg(_HU_cfg);
  $('#cfg_json').val(JSON.stringify(_HU_cfg));
  alert("保存配置成功\r\n其他页面刷新生效");
}
