# 文档头部元素 head

[[toc]]

head 元素包含了页面的一些元信息，不会显示在页面中（除title和favicon），但是能被搜索引擎抓取。这些内容包括你想在搜索结果中出现的关键字和页面描述，以及浏览器解析文档依赖的字符集声明、CSS样式、js文件等等。

`<head>`元素包括的子元素主要是`<title>`、`<base>`、`<link>`、`<style>`、`<script>`和`<meta>`这六个元素。

示例：

```html
<!DOCTYPE html>
<html>
    <head>
        <title>京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！</title>
        <link rel="icon" href="//www.jd.com/favicon.ico" mce_href="//www.jd.com/favicon.ico" type="image/x-icon"/>
        <link rel="stylesheet" href="//misc.360buyimg.com/mtd/pc/index_2019/1.0.0/static/css/index.chunk.css" />
        <style>
            body {
              box-sizing: border-box;
            }
        </style>
        <script src="//js.jd.com"></script>
        <script type="text/javascript">
            window.point = {}
            window.point.start = new Date().getTime()
        </script>
        <noscript>这是当浏览器不支持js或用户禁用了js后显示的信息</noscript>
        <meta charset="utf8" version='1'/>
        <meta name="description" content="京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、食品等数万个品牌优质商品."/>
        <meta name="Keywords" content="网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"/>
        <meta name="renderer" content="webkit"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta http-equiv=refresh content="0; url=http://www.baidu.com/baidu.html?from=noscript">
    </head>
    <body>
        <p>这是一个示例页面</p>
    </body>
</html>
```
下面针对主要的元素解释下：

## title 元素

`<title>`元素是必须的，它定义了文档的标题，显示在浏览器的标题栏或标签页上。主要有三个作用：
- 在浏览器标题栏或标签页上显示标题；
- 提供页面被添加到收藏夹时显示的标题；
- 显示在搜索引擎结果中的页面标题；

```html
<title>京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！</title>
```

## base 元素
`<base>`元素两个作用：
- 指定文档里所有相对URL地址的根URL，包括`<a>`中的href、`<img>`中的src、`<link>`中的href、`<form>`中的url。
- 为页面上所有链接指定打开方式target。

所以该元素包含两个特性

- href: 用于文档中相对 URL 地址的基础 URL。
- target：为没有显性使用target引用属性的元素指定默认打开方式。
  - _self：默认值属性值，替换当前浏览器标签页。
  - _blank：打开一个新的浏览器标签页或窗口。
  - _parent：载入结果到父级浏览上下文。如果没有父级结构，该选项的行为和_self一样。
  - _top：载入结果到顶级浏览上下文（该浏览上下文是当前上下文的最顶级上下文）。如果没有父级，该选项的行为和_self一样。

注意：
- 文档中的基础URL可以在JS中使用`document.baseURI`进行查询；
- 一份文档最多一个`<base>`元素。如果指定了多个，只会使用第一个href和target值，其余都会被忽略。

```html
<base target="_blank" href="http://www.example.com/">

<!-- 如果文档主体中有个a链接标签使用相对地址，但最终导航结果是：base url + 相对地址 -->
<a href="test.html"> <!-- http://www.example.com/test.html，并且在新页面打开，因为base中指定了target=_blank -->
<img src="test.png" alt="test picture"> <!-- http://www.example.com/test.png -->
```

## style 元素

`<style>`元素包含了文档的样式化信息，常用于引入内部CSS样式。

该元素常用的特性：
- type 默认为 `text/css`，可省略。
- media 该属性规定该样式适用于哪个媒体，默认值为 all。
```html
<style media="screen and (min-width: 600px)">
    .facet_sidebar {
      display: none;
    }
</style>
<!-- 但是一般直接不直接使用media，而是使用@media，可以避免文档中多个style元素 -->
<style>
@media (max-width: 600px) {
  .facet_sidebar {
    display: none;
  }
}
</style>
<!-- 还有一种使用link元素媒体查询特性来链接外部css文件 -->
<link rel="stylesheet" media="(max-width: 800px)" href="example.css" />
```

## link 元素

`<link>`元素规定了当前文档与外部资源的关系。该元素包含主要特性有：`href`、`rel`、`media`和`sizes`。主要用于：
- 站点图标favicon：`rel="icon"`、`sizes`
- 链接样式表：`rel="stylesheet"`、`media`
- 预加载资源：`rel="preload"`、`as`、`media`

其中`href`和`rel`是常用的，`href`指定了链接的资源的地址(url)，而`rel`指定了资源的类型。

### 网站图标的链接 `rel="icon"`
-  基本用法：
```html
<link rel="icon" href="favicon.ico">
```
- 不同上下文选择不同的图标

也可以在同一页面上包含指向多个不同图标的链接，浏览器将使用rel和sizes 值作为提示来选择最适合其特定上下文的图标。主要是苹果safari浏览器。
> 在iPhone/iPad等苹果移动设备上，可以把网站”添加至主屏幕”，添加时的图标可以在HTML中自定义设置图片。可以在link元素中使用apple-touch-icon和apple-touch-icon-precomposed这两种方法，两者区别是使用apple-touch-icon属性为“增加一层透明高光层的图标”，使用apple-touch-icon-precomposed属性为“设计原图图标”。
```html
<!-- third-generation iPad with high-resolution Retina display: -->
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="favicon144.png">
<!-- iPhone with high-resolution Retina display: -->
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="favicon114.png">
<!-- first- and second-generation iPad: -->
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="favicon72.png">
<!-- non-Retina iPhone, iPod Touch, and Android 2.1+ devices: -->
<link rel="apple-touch-icon-precomposed" href="favicon57.png">
<!-- basic favicon -->
<link rel="icon" href="favicon32.png">
```
### 链接样式表 `rel="stylesheet"`
- 基本用法
```html
<link href="style.css" rel="stylesheet">
```
- 通过媒体查询有条件地加载样式表
```html
<link href="print.css" rel="stylesheet" media="print">
<link href="mobile.css" rel="stylesheet" media="all">
<link href="desktop.css" rel="stylesheet" media="screen and (min-width: 600px)">
<link href="highres.css" rel="stylesheet" media="screen and (min-resolution: 300dpi)">
```
- 监听样式加载完成事件

通过监听发生在样式表上的事件能够知道什么时候样式表加载完毕（onload）或者出现错误（onerror）。

事件触发时机：当样式表以及当前样式表中@import引用的样式表全部加载完毕，load事件就会在样式表应用到内容之前立即触发。

```html
<link rel="stylesheet" href="mystylesheet.css" onload="sheetLoaded()" onerror="sheetError()">
<script>
function sheetLoaded() {
  // Do something interesting; the sheet has been loaded
}

function sheetError() {
  alert("An error occurred loading the stylesheet!");
}
</script>
```

### 预加载资源 `rel="preload"`

[参考资料 MDN 通过rel="preload"进行内容预加载](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content)

对于在页面加载完成后即刻需要的资源，你可能希望在页面加载的生命周期的早期阶段就开始获取，在浏览器的主渲染机制介入前就进行预加载。这一机制使得资源可以更早的得到加载并可用，且更不易阻塞页面的初步渲染，进而提升性能。例如那些在CSS文件中指向的资源，比如字体或是图片；再比如更大的图片和视频文件。

使用`rel="preload"`这种做法将把`<link>` 元素塞入一个预加载器中。连同以下特性一起使用：

- `href` 特性指定需要被预加载资源的资源路径。
- `type` 特性指定可以预加载资源的MIME类型。浏览器将使用type属性来判断它是否支持这一资源，如果浏览器支持这一类型资源的预加载，下载将会开始，否则便对其加以忽略。
- `as` 指定将要预加载的内容的类型。使用这一特性将使浏览器更精确地优化资源加载优先级，为资源设置正常的 Accept 请求头和内容安全策略。`as`的属性值可以是：
  - style: 样式表。
  - script: JavaScript文件。
  - font: 字体文件。
  - image: 图片文件。
  - audio: 音频文件。
  - video: 视频文件。
  - fetch: 那些将要通过fetch和XHR请求来获取的资源，比如一个ArrayBuffer或JSON文件。
  - track: WebVTT文件。
  - worker: 一个JavaScript的web worker或shared worker。
  - document: 一个将要被嵌入到`<frame>`或`<iframe>`内部的HTML文档。
  - embed: 一个将要被嵌入到`<embed>`元素内部的资源。
  - object: 一个将会被嵌入到`<embed>`元素内的文件。

```html
<link rel="preload" href="sintel-short.mp4" as="video" type="video/mp4">

<link rel="preload" href="fonts/zantroke-webfont.eot" as="font" type="application/vnd.ms-fontobject" crossorigin="anonymous">

<!-- 配合media特性实现响应式的预加载！ -->
<link rel="preload" href="bg-image-wide.png" as="image" media="(min-width: 601px)">
```
> 注意媒体查询的两个API：[Window.matchMedia](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia) / [MediaQueryList](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaQueryList)


> crossorigin属性[链接](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link#attr-crossorigin)

## script 元素

`<script>`的作用是在HTML文档中嵌入或引用可执行的脚本。

有四个特性：
- src: 引用外部脚本的URL。指定了 src 属性的script元素标签内不应该再有嵌入的脚本。
- type: 定义src引用脚本的MIME类型。HTML5中可省略，缺省默认为`text/javascript`。如果type特性值为module，则script标签内的代码会被当作ES2015 Module模块。
- nomodule: 布尔属性，用来表明这个脚本在支持 ES2015 modules 的浏览器中不执行，但在不支持ES2015 modules模块化的浏览器中会被执行，所以常用于在旧浏览器中提供回退脚本。
- defer：布尔属性，指示浏览器在文档完成解析后，且在触发 DOMContentLoaded 事件前执行该脚本。该属性对于内联脚本无作用 (即没有src属性的脚本）。
- async：布尔属性，HTML5新增特性，指示浏览器是否在允许的情况下异步执行该脚本。该属性对于内联脚本无作用 (即没有src属性的脚本）。

### type="text/javascript" 和 type="module"
```html
<!-- HTML4 and (x)HTML -->
<script type="text/javascript" src="javascript.js"></script>

<!-- HTML5 可以省略type-->
<script src="javascript.js"></script>

<!-- es6 module -->
<script type="module" src="main.mjs"></script>
<script nomodule src="fallback.js"></script>
```

### defer 和 async 区别

正常情况下，当浏览器在解析HTML源文件时如果遇到script标签，那么解析过程会暂停。如果是内联脚本会立即执行，如果有src属性则发送请求来下载script文件，只有script完全下载并执行后才会继续执行DOM解析。在脚本下载和执行过程中，浏览器是被阻止做其他有用的工作的，包括解析HTML，执行其他脚本，或者渲染CSS布局等。

当前有很多技术来提升页面显示速度，但都需要额外的代码以及针对特定浏览器的技巧。但是现在，script可以通过添加async或者defer属性来让脚本不必同步执行，阻塞浏览器工作。

两者的共同点：
- async和defer标注的script在下载时并不会阻塞浏览器其它工作，如HTML解析，并且两者同样支持onload事件回调来解决需要该脚本来执行的初始化。

两者的区分在于脚本执行时机不同：
- defer：表示下载后先不执行，等到浏览器对文档解析完成后，且在触发 DOMContentLoaded 事件前执行该脚本。并且确保多个defer脚本按其在HTML页面中的出现顺序依次执行。显然 defer 是最接近我们对于应用脚本加载和执行的要求的。
- async：表示下载后立即执行，执行时会阻塞浏览器工作，如HTML解析。并且多个async脚本无法保证按其在页面中的出现顺序执行。所以 async 对于应用脚本的用处不大，因为它完全不考虑依赖（哪怕是最低级的顺序执行）

从实用角度来说呢，首先把所有脚本都丢到 `</body>` 之前是最佳实践，因为对于旧浏览器来说这是唯一的优化选择，此法可保证非脚本的其他一切元素能够以最快的速度得到加载和解析。

```html
<!-- 没有 defer 或 async，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 script 标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行。 -->
<script src="script.js"></script>

<!-- 有 defer，加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。 -->
<script defer src="myscript.js"></script>

<!-- 有 async，加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）。 -->
<script async src="script.js"></script>
```
![script_defer_async.jpg](./imgs/script_defer_async.jpg)

注意：
- `<script>`元素开始标签和结束标签都不能省略，必须有一个结束标记`</script>`。
- `<script>`标签没必要非要放在文档头部；实际上，把它放在文档的尾部（在 `</body>`标签之后）是一个更好的选择，这样可以确保在加载脚本之前浏览器已经解析了HTML内容，并且这样如果脚本引用某个不存在的元素，浏览器会报错。

### `noscript`元素

`noscript`元素的内容只有在下列情况下才会显示出来：
- 浏览器不支持脚本
- 浏览器支持脚本，但脚本被禁用

符合上述任何一个条件，浏览器都会显示 noscript 中的内容。而在除此之外的其他情况下，浏览器不会呈现 noscript 中的内容。

`noscript`标签是一个相当古老的标签，其被引入的最初目的是帮助老旧浏览器的平滑升级更替，因为早期的浏览器并不能支持 JavaScript。noscript 标签在不支持JavaScript 的浏览器中显示替代的内容。这个元素可以包含任何 HTML 元素。这个标签的用法也非常简单：
```html
<noscript>
  <p>本页面需要浏览器支持（启用）JavaScript</p>
</noscript>
```
不过到了现在，浏览器不支持 Javascript 的事情应该已经不会出现了，但是用户也有可能因为各种原因而禁用了 Javascript。如节省流量，延长电池使用时间，或者是不希望自己的隐私被各类统计/追踪脚本泄露等。也有相当一部分用户安装了类似NoScript的浏览器扩展来禁止浏览器运行 Javascript。网站虽然不能强制用户启用浏览器的 Javascript，但是可以提示用户当前浏览器已经禁用脚本，来达到更好的用户体验。

使用 noscript 标签只能给网站用户传达一个信息，即如果不启用 Javascript，网页内容和效果可能不能完全被呈现。但如果有些用户并不懂得如何去开启 Javascript的话，这样的提示信息对他也并没有什么实际的帮助。所以我们还是应该在网站设计之初多多考虑在没有 Javascript(或 HTML5，或其他依赖)的支持的情况下，如何使这样的非常规状况尽可能少的影响到用户的浏览体验。

### 延伸：`onload`、`DOMContentLoaded` 和 `$(document).ready()`
- `onload`：页面上所有的DOM，样式表，脚本，图片等资源都已经加载完成了才触发onload事件。
- `DOMContentLoaded`: 当DOM树构建完成的时候就会执行DOMContentLoaded事件。
- `$(document).ready(handler)`等价于`$(handler)`: 使用的就是监听`DOMContentLoaded`事件`document.addEventListener( "DOMContentLoaded", handler, false );`，但jQuery注册的在前。

另外：window.onload和body中的onload谁在下面就是谁覆盖谁，只会执行后面的那个。
```html
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.9.0.js"></script>
    <script language="javascript">
        window.onload = loadBeforeBody;
        function loadBeforeBody(){console.log("window onload before body");}
    </script>
</head>
<body onload="console.log('body onload');">
    <div id="div1">a</div>
</body>
<script>
      window.onload = loadAfterBody;
      function loadAfterBody(){console.log("window onload after body");}

      $().ready(function() {
        console.log('jQuery().ready(handler)')
      })
      

      if(document.addEventListener){
          function handler(){
              console.log("DOMContentLoaded");
          }
          document.addEventListener( "DOMContentLoaded", handler, false );
      }

      $(function () {
        console.log('jQuery $(handler)')
      })
</script>
</html>
```
输出顺序：
```
jQuery().ready(handler)
jQuery $(handler)
DOMContentLoaded
window onload after body
```
## meta 元素

[MDN meta](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)

`<meta>`元素表示那些不能由 (`<base>`, `<link>`, `<script>`, `<style>` 或 `<title>`) 表示的其它任何元数据信息。包括：
- 提供文档字符集
- 网页描述信息（关键字、描述、作者、视口等信息）
- 网页加载选项信息（刷新、缓存等信息）

主要通过以下三类特性值设置：
属性 | 值 | 描述
--|--|--
charset | UTF-8 | 声明当前文档所使用的字符编码
name | author<br>description<br>keywords<br>copyright<br>viewport | 把 content 属性关联到一个名称
http-equiv | refresh | 定义了能改变服务器和用户引擎行为的编译。这个编译值使用content 来定义，把 content 属性关联到 HTTP 头部。部分值已废弃，具体见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)

### charset
- 声明当前文档所使用的字符编码，推荐使用UTF-8编码。但该声明可以被任何一个元素的 lang 特性的值覆盖。
- 字符编码必须写在`<head>`元素的最开始，如果位于`<title>`标签之后，那么`<title>`标签很可能会乱码。
```html
<meta charset="utf-8"/>
```

### name
```html
<meta name="author" content="littlematch">
<meta name="keywords" content="HTML, CSS, XML" />
<meta name="description" content="Free Web tutorials on HTML, CSS, JavaScript" />
<meta name="copyright" content="本页版权归某某所有">
<!-- 移动端页面适配设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
<!-- 如果是双核浏览器，则使用webkit内核渲染 -->
<meta name="renderer" content="webkit">
<!-- X-UA-Compatible是IE8的一个专有<meta>属性，它告诉IE8采用何种IE版本去渲染网页 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
```
> 关于X-UA-Compatible更详细的内容[链接1](https://www.cnblogs.com/chendc/p/5423337.html)[链接2](https://www.cnblogs.com/nidilzhang/archive/2010/01/09/1642887.html)

### http-equiv

除refresh值外，其它大部分值已废弃。具体参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)
- refresh: 让网页多少秒刷新，或跳转到其他网页。
  - 如果content 只包含一个正整数,则是重新载入页面的时间间隔(秒);
  - 如果content 包含一个正整数并且跟着一个字符串,则是重定向到指定链接的时间间隔(秒)。
```html
<meta http-equiv="refresh" content="5">
<meta http-equiv="refresh" content="5;url=http://www.baidu.com">
```

### 延伸 name=viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
```
它提供有关视口初始大小的提示，仅供移动设备使用。
content Value | 可能值 | 描述
--|--|--
width | 一个正整数或者字符串device-width | 以pixels（像素）为单位， 定义viewport（视口）的宽度。
height | 一个正整数或者字符串device-height | 以pixels（像素）为单位， 定义viewport（视口）的高度。
initial-scale | 一个0.0 到10.0之间的正数 | 定义设备宽度（纵向模式下的设备宽度或横向模式下的设备高度）与视口大小之间的缩放比率。
maximum-scale | 一个0.0 到10.0之间的正数 | 定义缩放的最大值；它必须大于或等于minimum-scale的值，不然会导致不确定的行为发生。
minimum-scale | 一个0.0 到10.0之间的正数 | 定义缩放的最小值；它必须小于或等于maximum-scale的值，不然会导致不确定的行为发生。
user-scalable | 一个布尔值（yes 或者no） | 如果设置为 no，用户将不能放大或缩小网页。默认值为 yes。