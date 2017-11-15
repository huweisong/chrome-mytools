/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _HU_QrCode = {
    /**
     * 二维码解码
     * @param {type} url
     * @returns {undefined}
     */
    decodeQr: function(url) {
        //跨域,通过添加域名或者域名匹配到manifest文件的permissions段 http://tool.oschina.net/
        _HU_Request.post("http://tool.oschina.net/action/qrcode/decode", {url: url}, function(resp) {
        //_HU_Request.post("http://huws.win/to.php?_url_="+encodeURI('http://tool.oschina.net/action/qrcode/decode'), {url: url}, function(resp) {
            if (resp.length > 0 && resp[0].text) {
                _HU_copy(resp[0].text, "text");
                _HU_Notification.show(resp[0].text + "\r\n二维码内容已经复制");
            } else {
                _HU_copy(url, "text");
                _HU_Notification.show("可能不是二维码，图片地址已经复制");
            }
        });
    },
    /**
     * 右键菜单点击事件
     * @param {type} info
     * @param {type} tab
     * @returns {undefined}
     */
    genericOnClick: function(info, tab) {
//        alert(JSON.stringify(info))
        switch (info.menuItemId) {
            case _HU_QrCode.menuItem.qrImage:
                var imgUrl = info.srcUrl;
                _HU_QrCode.decodeQr(imgUrl);
                break;
            case _HU_QrCode.menuItem.image:
                var imgUrl = info.srcUrl;
                _HU_copy(imgUrl, "text");
                _HU_Notification.show("图片地址已经复制");
                break;
            case _HU_QrCode.menuItem.saveImage:
                var imgUrl = info.srcUrl;
                _HU_Notification.show("暂不能找到另存的方法\r\n只支持在chrome浏览器默认下载");
                _HU_download(imgUrl);
                break;
            case _HU_QrCode.menuItem.bigImage:
                var imgUrl = info.srcUrl;
                chrome.tabs.create({url: imgUrl}, function(tab) {
                    _HU_copy(tab.url, "text");
                    _HU_Notification.show("图片地址已经复制");
                });
                break;
            case _HU_QrCode.menuItem.selection:
                var selectionText = info.selectionText;
                var qrUrl = "http://qr.liantu.com/api.php?text=" + encodeURIComponent(selectionText);
                chrome.tabs.create({url: qrUrl});
                break;
            case _HU_QrCode.menuItem.link:
                var linkUrl = info.linkUrl;
                var qrUrl = "http://qr.liantu.com/api.php?text=" + encodeURIComponent(linkUrl);
                chrome.tabs.create({url: qrUrl});
                break;
            default:
                break;
        }
    },
    menuItem: {"qrImage": 0, "image": 0, "selection": 0,"link":0, "saveImage": 0, "bigImage": 0},
    /**
     * 初始化右键菜单
     * @returns {undefined}
     */
    initMenu: function() {
        var contexts = ["image", "selection","link"];
        for (var i = 0; i < contexts.length; i++) {
            var context = contexts[i];
            if (context === "image") {
                var title = "获取二维码内容";
                var id = chrome.contextMenus.create({"title": title, "contexts": [context],
                    "onclick": _HU_QrCode.genericOnClick});
                _HU_QrCode.menuItem.qrImage = id;

                title = "获取图片地址";
                _HU_QrCode.menuItem.image = chrome.contextMenus.create({"title": title, "contexts": [context],
                    "onclick": _HU_QrCode.genericOnClick});

                title = "图片另存为";
                _HU_QrCode.menuItem.saveImage = chrome.contextMenus.create({"title": title, "contexts": [context],
                    "onclick": _HU_QrCode.genericOnClick});

                title = "大窗查看图片";
                _HU_QrCode.menuItem.bigImage = chrome.contextMenus.create({"title": title, "contexts": [context],
                    "onclick": _HU_QrCode.genericOnClick});

            } else if (context === "selection") {
                var title = "文本生成二维码";
                _HU_QrCode.menuItem.selection = chrome.contextMenus.create({"title": title, "contexts": [context],
                    "onclick": _HU_QrCode.genericOnClick});
            } else if(context === "link"){
                var title = "连接生成二维码";
                _HU_QrCode.menuItem.link = chrome.contextMenus.create({"title": title, "contexts": [context],
                    "onclick": _HU_QrCode.genericOnClick});

            }
        }
    },
};
_HU_QrCode.initMenu();
