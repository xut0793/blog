# BOM

[[toc]]


在早期，微软的Internet Explorer 4和网景公司的Netscape Navigator 4 浏览器有一个共同的特色，提供了一个浏览器对象模型（Browser Object Model)来支持开发者可以访问和操作浏览器的窗口，但问题依然是各家厂商实现技术和接口不一存在很多兼容性问题。尴尬的是BOM一直是各大浏览器中Javascript语言事实上的一部分，但一直没有成为标准。直到HTML5发布，有了希望，HTML5致力于推动BOM的实现写进标准规范中，将BOM的实现细节朝着兼容性越来越高的方向发展。

BOM主要包括：

- windows : 浏览器接口的根对象
- navigator ：提供浏览器详细信息的对象
- screen ： 提供用户显示器和窗口的详细信息
- location ：提供浏览器加载的页面的详细信息，如URL等
- history ：提供页面操作的历史记录信息
- document : 提供当前加载页面的DOM信息
- frames ： 提供嵌入页面的对象