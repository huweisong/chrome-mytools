/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _HU_Chrome_Storage = {
    get: function(k_arr, callback) {
        chrome.storage.local.get(k_arr, function(r) {
            callback(r);
        });
    },
    set: function(k_v_arr) {
        chrome.storage.local.set(k_v_arr);
    },
};

var _HU_Notification = {
    timer: 0,
    nottify: undefined,
    close: function() {
        if (_HU_Notification.nottify === undefined) {
            console.log("关闭");
        } else {
            _HU_Notification.nottify.close();
        }
    },
    http_content_show: function(body, title, time) {
      if(location.protocol == "https:"){
        _HU_Notification.show(body, title, time);
      }else{
          //最新的Chrome的Notification要想有效果需要https协议才行
        chrome.extension.sendRequest({type:'notification',body: body,title:title,time:time}, function(response) { // optional callback - gets response
            console.log(response.returnMsg);
        });
      }
    },
    show: function(body, title, time) {
      //最新的Chrome的Notification要想有效果需要https协议才行
        var showtime = typeof (time) === "undefined" ? 5000 : time;
        _HU_Notification.close();
        clearTimeout(_HU_Notification.timer);
        var tit = typeof (title) === "undefined" ? "提示" : title;
        _HU_Notification.nottify = new Notification(tit, {icon: 'com/img/icon38.png', body: body});
        _HU_Notification.nottify.onshow = function() {
            _HU_Notification.timer = setTimeout(function() {
                _HU_Notification.close();
            }, showtime)
        }
    },
    voice_type: {notice: 1, alert: 2, tip: 3},
    voice: function(type) {
        var _hu_audio = document.getElementById('_HU_AUDIO');
        if (!_hu_audio) {
            _hu_audio = document.createElement('audio');
            _hu_audio.setAttribute('id', "_HU_AUDIO");
            _hu_audio.setAttribute('style', "height:0px;width:0px;");
            _hu_audio.preload = "auto";
            _hu_audio.autoplay = "autoplay";
            document.body.appendChild(_hu_audio);
        }
        var src = "";
        switch (type) {
            case _HU_Notification.voice_type.notice:
            case _HU_Notification.voice_type.alert:
            case _HU_Notification.voice_type.tip:
//                    src="chrome-extension://hheanfmdkblenlmgfbidpjaeenejnmmh/com/media/notification/"+type+".mp3";
//                    _hu_audio.src=src;_hu_audio.play();
//                break;
            default:
                src = "http://www.w3school.com.cn/i/song.mp3";
                _hu_audio.src = src;
                _hu_audio.play();
                break;
        }

    },
};

/**
 * insert script to web page
 * @param {type} o
 * @returns {undefined}
 */
function _HU_injectScript(o) {
    var file = o.file, node = o.node ? o.node : "body";
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

/**
 * content script run target page script.
 * if variables disabled or analog click do not work.
 * you can use this function insert javascript code to the target page to run you your script .
 * @param str
 */
function _HU_execScript(str){
    s =document.createElement('script');
    s.innerHTML=str;
    document.body.appendChild(s);
}

/**
 * copy function
 * @param string str
 * @param string mimetype
 * @returns {undefined}
 */
function _HU_copy(str, mimetype) {
    //"permissions": [clipboardWrite"]
    document.oncopy = function(event) {
        event.clipboardData.setData(mimetype, str);
        event.preventDefault();
    };
    document.execCommand("Copy", false, null);
}

/**
 * 下载
 * @param {type} url
 * @returns {undefined}
 */
function _HU_download(url) {
    //"permissions": ["downloads"]
    var name = url.substr(url.lastIndexOf("/") + 1);
    chrome.downloads.download({url: url, filename: name, saveAs: false}, function(res_id) {
        if (typeof res_id === "undefined") // when failing to start the download
        {
            alert("error")
            /*err handling*/
        }
        else
        {
            console.log("do more")
            /*your further task*/
        }
    });
}
/**
 * 另存为
 * @param {type} url
 * @returns {undefined}
 */
function _HU_saveAs(url) {
    var xhr = new XmlHttpRequest();
    alert(url);
    xhr.overrideMimeType("application/octet-stream"); // Or what ever mimeType you want.

    xhr.onreadystatechanged = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {

            var blob = xhr.responseBlob();
            var saveas = document.createElement("iframe");
            saveas.style.display = "none";

            if (!!window.createObjectURL == false) {
                saveas.src = window.webkitURL.createObjectURL(blob);
            }
            else {
                saveas.src = window.createObjectURL(blob);
            }

            document.body.appendChild(saveas);
        }
    };

    xhr.send(url);
}

var _HU_Request = {
    get: function(url, callback) {
        _HU_Request.exec(url, {}, 'get', callback);
    },
    post: function(url, data, callback) {
        _HU_Request.exec(url, data, 'post', callback);
    },
    exec: function(url, data, type, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(type.toUpperCase(), _HU_concatUrlParam(url, data), true);
        xhr.onreadystatechange = function() {
            switch (xhr.readyState){
                case 0:
                    console.log("Uninitialized:初始化状态。XMLHttpRequest 对象已创建或已被 abort() 方法重置。");
                    break;
                case 1:
                    console.log("Open:open() 方法已调用，但是 send() 方法未调用。请求还没有被发送。");
                    break;
                case 2:
                    console.log("Sent:Send() 方法已调用，HTTP 请求已发送到 Web 服务器。未接收到响应。");
                    break;
                case 3:
                    console.log("Receiving:所有响应头部都已经接收到。响应体开始接收但未完成。");
                    break;
                case 4:
                    console.log("Loaded:HTTP 响应已经完全接收。");
                    console.log("HTTP状态码:"+xhr.status);
                    if(xhr.status == 200){
                        if (callback && typeof (callback) === "function") {
                            var result = '';
                            try {
                                result = JSON.parse(xhr.responseText);
                            } catch (e) {
                                result = xhr.responseText;
                            }
                            callback(result);
                        } else {
                            _HU_Request.success(xhr.responseText);
                        }
                    }else{
                        _HU_Request.error(xhr);
                    }
                    break;
                default:break;
            }
        }
        _HU_Request.init();
        xhr.send();
    },
    init: function() {
        _HU_Request.success = _HU_Request.default_success;
        _HU_Request.error = _HU_Request.default_error;
    },
    default_success: function(d) {
        console.log("request success.");
    },
    success: function(d) {
        _HU_Request.default_success(d);
    },
    default_error: function(d) {
        console.log("request error.");
    },
    error: function(d) {
        _HU_Request.default_error(d);
    },
};


/**
 * json串转化为字符串k1=v1&k2=v2连接
 * @param {type} json
 * @returns {String}
 */
function _HU_jsonUrl(json) {
    var str = "", concat = '';
    for (var k in json) {
        var v = json[k];
        var t = typeof (v);
        if (t === "object") {
            str += concat + k + '=' + encodeURIComponent(JSON.stringify(v));
        } else {
            str += concat + k + '=' + encodeURIComponent(v);
        }
        concat = "&";
    }
    return str;
}
/**
 * 拼接url和参数
 * @param {type} url
 * @param {type} json
 * @returns {String}
 */
function _HU_concatUrlParam(url, json) {
    var params = _HU_jsonUrl(json);
    var concat = (url.indexOf("?") === -1 ? "?" : "&");
    return url + concat + params;
}
/**
 * 获取文本的utf8长度
 * @param {type} str
 * @returns {Number}
 */
function getStrUtf8Leng(str) {
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        } else {
            // 如果是中文则长度加3
            realLength += 3;
        }
    }
    return realLength;
}
/**
 * 获取某个url值
 * @param string name
 * @param string url 如果不存在则获取当前url
 * @returns string
 */
function _HU_getUrlParam(name, url) {
    var params = "";
    if (typeof (dourl) === "undefined") {
        params = window.location.search.substr(1);
    } else {
        var pos = url.indexOf("?");
        if (pos > 0) {
            var hpos = url.indexOf("#");
            params.substr(pos + 1);
            if (hpos != -1) {
                params.substr(0, hpos);
            }
        }
    }
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
/**
 * 获取url参数列表
 * @param string url 如果不存在则获取当前url
 * @returns json
 */
function _HU_getUrlParams(url) {
    var params = "", theRequest = {};
    if (typeof (dourl) === "undefined") {
        params = window.location.search.substr(1);
    } else {
        var pos = url.indexOf("?");
        if (pos > 0) {
            var hpos = url.indexOf("#");
            params.substr(pos + 1);
            if (hpos != -1) {
                params.substr(0, hpos);
            }
        }
    }
    var strs = params.split("&");
    for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
    return theRequest;
}

var _HU_Cookie = {
    set: function(cookieName, cookieValue, cookieExpires, cookiePath)
    {
        cookieValue = escape(cookieValue);//编码latin-1
        if (cookieExpires == "")
        {
            var nowDate = new Date();
            nowDate.setMonth(nowDate.getMonth() + 6);
            cookieExpires = nowDate.toGMTString();
        }
        if (cookiePath != "")
        {
            cookiePath = ";Path=" + cookiePath;
        }
        document.cookie = cookieName + "=" + cookieValue + ";expires=" + cookieExpires + cookiePath;
    }, get: function(cookieName)
    {
        var cookieValue = document.cookie;
        var cookieStartAt = cookieValue.indexOf("" + cookieName + "=");
        if (cookieStartAt == -1)
        {
            cookieStartAt = cookieValue.indexOf(cookieName + "=");
        }
        if (cookieStartAt == -1)
        {
            cookieValue = null;
        }
        else
        {
            cookieStartAt = cookieValue.indexOf("=", cookieStartAt) + 1;
            cookieEndAt = cookieValue.indexOf(";", cookieStartAt);
            if (cookieEndAt == -1)
            {
                cookieEndAt = cookieValue.length;
            }
            cookieValue = unescape(cookieValue.substring(cookieStartAt, cookieEndAt));//解码latin-1
        }
        return cookieValue;
    }

};
