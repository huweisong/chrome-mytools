# my chrome extension
+ 添加插件：打开Chrome浏览器，选择拓展程序（ chrome://extensions/ ），打开开发者模式。点击加载已解压的拓展程序，选本目录，或者直接将本目录拖拽到页面。
+ 打包插件：在拓展程序（ chrome://extensions/ ）点击打包拓展程序，然后选择本目录，如果为了应用商店在线升级那么必须使用同一个密钥文件。生成的.crx文件是打包好的插件，直接拖拽到页面就可以添加。
+ 二维码功能
  + 浏览器右上角插件图标,显示地址栏地址二维码
  + 在网页上选中文字,右击生产二维码,便于手机上获取文本
  + 在网页上右击图片,选取二维码功能
      + 如果是二维码,可以获取二维码内容
      + 获取图片地址
      + 图片另存为
      + 新开窗口查看图片
+ 页面注入js脚本
 + 右击插件选项页面，配置需要在某些页面执行的js
 + 页面加载的时候如果有配置js，那么将会执行该js
 + 浏览器右上角插件图标,显示本页面添加的js，可以开启关闭
