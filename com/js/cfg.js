/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _HU_cfg={content_scripts_exec_list:[
    {
      script:"$('#search').val('小米mix2');",
      status:1,
      timeout:0,
      title:"小米",
      desc:"添加搜索mix2",
      urls:["https://www.mi.com/"]
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
