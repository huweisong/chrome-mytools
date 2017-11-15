/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _HU_cfg={content_scripts_exec_list:[
  {
    script:"$('.permission input[type=checkbox]').unbind('click').on('click',function(e){\n\
    	var checked = $(this).is(':checked');\n\
    	var p = $(this).parent();\n\
    	$('input[type=checkbox]',p).prop('checked',checked);\n\
    });",
    status:1,
    timeout:0,
    title:"IT门系统角色全选",
    desc:"角色增加了操作父节点，即是操作子节点",
    urls:["http://it.men.test.mi.com/role/update","http://it.men.test.mi.com/role/create"]
  },
    {
      script:"$('#miniLogin_username').val('huweisong');$('#miniLogin_pwd').val('huweisong');",
      status:1,
      timeout:0,
      title:"开发环境cas登录",
      desc:"添加用户名密码",
      urls:["https://casdev.mioffice.cn/login"]
    },
      {
        script:"$('#qr_id_login').addClass('hide');$('#account_login').removeClass('hide');$('#switcher_alogin>a').trigger('click');$('#miniLogin_username').val('huweisong');$('#miniLogin_pwd').val('huweisong');",
        status:1,
        timeout:500,
        title:"线上环境cas登录",
        desc:"添加用户名密码",
        urls:["https://cas.mioffice.cn/login"]
      },
]};
var _HU_cfg_ready = false;
//加载配置
chrome.storage.local.get(['content_scripts_exec_list'],function(r){
    for(var k in r){
        _HU_cfg[k]=r[k];
        //取出配置，存入sessionStorage方便业务获取
        sessionStorage.setItem(k,r[k]);
    }
    _HU_cfg_ready=true;
    //存在业务页面存在配置获取函数
    if(typeof(cfgReadyFun) == 'function')cfgReadyFun(_HU_cfg);
});
setTimeout(function(){
    if(!_HU_cfg_ready){
        saveCfg(cfg);
        _HU_cfg_ready=true;
        if(typeof(cfgReadyFun) == 'function')cfgReadyFun(_HU_cfg);
    }
},1000);

function saveCfg(cfg){
    chrome.storage.local.set(cfg);
}
