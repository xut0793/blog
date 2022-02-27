# 文本内容语义化元素

这部分标签主要用于文本行中强调语义、删除、省略词、引用等格式的表现。

[[toc]]

##  em 强调内容表达的意思

em 元素代表对其内容的强调。突出强调的内容会改变语句本身的意义，类似读一句话时重读某一个字或词会表达不一样的意思一样。默认为斜体样式。

比如：

```html
// 这是一句不带任何强调的句子
<p>Cats are cute animals.</p>

// em 包围 Cats，强调猫是种可爱的动物，而不是狗或者其他动物
<p><em>Cats</em> are cute animals.</p>

// em 包围 are，代表句子所说是事实，来反驳那些说猫不可爱的人
<p>Cats <em>are</em> cute animals.</p>

// em 包围 cute，强调猫是一种可爱的动物，而不是有人说的刻薄、讨厌的动物
<p>Cats are <em>cute</em> animals.</p>

// 这里强调猫是动物，而不是植物
<p>Cats are cute <em>animals</em>.</p>  
```

## strong 强调重要性、特殊性或紧急性

strong 元素代表内容的强调重要性、严重性或者紧急性。默认表现为粗体。
```html
// 重要性：章节序号不重要，章节的名字才重要
<h1>Chapter 1: <strong>The Praxis</strong></h1>

// 严重性：标记警告或者警示标志。
<p><strong>Warning.</strong> This dungeon is dangerous.</p>

// 紧急性
<p><strong>Turn off the oven.</strong></p>
```

> 对比 i b 元素
i b元素出现在css还不能表现内容斜体和粗体的那个早期引进来的标签，单纯用来表示内容的斜体和粗体，仅仅是展示，对使用屏幕阅读器等可访问性是没有任何语义的。CSS出现后一段被废弃，但在HTML5中对它们赋予了新的语义：<br>
i 被用来表达的意义：外国文字，分类名称，技术术语等。<br>
b 被用来表达的意义：关键字，产品名称等。但一般仍比较少用。


## 引用 blockquote q cite

HTML也有用于标记引用的特性，至于使用哪个元素标记，取决于你引用的是一块还是一行。

- 块引用： blockquote cite
- 行引用： q cite

### 块引用 blockquote

如果一个块级内容（比如一个段落、多个段落、一个列表等）是从其他地方引用的内容，那应该把它用`<blockquote>`元素包裹起来表示，并且在元素的`cite`特性里用URL来指向引用的资源。

默认表现为整体缩进样式。

```html
<blockquote cite="https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Introduction_to_HTML/Advanced_text_formatting">
    <p>浏览器在渲染块引用时默认会增加缩进，作为引用的一个指示符；MDN是这样做的，但是也增加了额外的样式：</p>
</blockquote>
```
效果（这里vuepress对引用作了特殊样式处理，与浏览器默认效果可能不一致）：
<blockquote cite="https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Introduction_to_HTML/Advanced_text_formatting">
    <p>浏览器在渲染块引用时默认会增加缩进，作为引用的一个指示符；MDN是这样做的，但是也增加了额外的样式：</p>
</blockquote>

### 行引用 q
如果引用内容作为行内容的一部分，则使用`<q>`元素包括，并且同样使用`cite`特性里用URL来指向引用的资源。

默认表现为会为引用内容添加双引号“ ”

```html
<p>行引用的效果是这样的：<q cite="https://developer.mozilla.org/zh-CN/docs/Learn/HTML">浏览器默认将其作为普通文本放入引号内表示引用</q>。</p>
```
效果为：
<p>行引用的效果是这样的：<q cite="https://developer.mozilla.org/zh-CN/docs/Learn/HTML">浏览器默认将其作为普通文本放入引号内表示引用</q>。</p>

### 显示引文 cite

上面不管是块引用还是行引用，表示引用源的URL都是在cite特性里，页面中看不到。如果想要把引用源也在页面上显示出来，可以使用`<cite>`元素。

```html
引用自<cite>MDN cite</cite>
```
引文默认的字体样式为斜体。但经常将cite元素与a元素一起使用，以便点击可跳转到引用源。
```html
<p>要保持乐观，<q cite="http://www.affirmationsforpositivethinking.com/">不要说泄气的话</q>。（源自 <a href="http://www.affirmationsforpositivethinking.com/"><cite>Affirmations for Positive Thinking</cite></a>。）</p>
```
效果为：
<p>要保持乐观，<q cite="http://www.affirmationsforpositivethinking.com/">不要说泄气的话</q>。（源自 <a href="http://www.affirmationsforpositivethinking.com/"><cite>Affirmations for Positive Thinking</cite></a>。）</p>

## 缩略语 abbr

在文本内容中经常使用缩略词来表示一个较长的名称，在HTML中使用`<abbr>`元素来包裹一个缩略语或缩写，并且提供缩写的解释（包含在title属性中）。

```html
<p>我们使用 <abbr title="超文本标记语言（Hypertext Markup Language）">HTML</abbr> 来组织网页文档。</p>
```
效果为：
<p>我们使用 <abbr title="超文本标记语言（Hypertext Markup Language）">HTML</abbr> 来组织网页文档。</p>

## 名词定义 dfn
`<dfn>` 元素标记了被定义的术语，表现为斜体样式。术语定义应当在 `<p>`, `<section>`或定义列表 (通常是`dl-dt-dd` 对)中给出，经常与`<abbr>`连用。

被定义术语的值由下列规则确定：
- 如果 `<dfn>` 元素本身有一个 title 属性，那么该术语的值就是该属性的值。
- 否则，如果它仅包含一个 `<abbr>` 元素，而abbr元素拥有 title 属性，那么该术语的值就是该属性的值。
- 否则，`<dfn>` 元素的文本内容就是该术语的值。
```html
<p>The full name of <dfn id="def-www">The WWW</dfn>is World-Wide Web. </p>

// 综合示例
<dt>
    <dfn>
        <abbr title="World-Wide Web">WWW</abbr>
    </dfn>
</dt>
<dd>The World-Wide Web (WWW) is a system of interlinked hypertext documents accessed on the Internet.</dd>
</dl>
```

## 删除 del 和 插入 ins

显示内容的删除和插入，各自都有两个相同的特性：
- cite：提供一个URI，其中的资源解释作出修改（删除或插入）的原因（比如：根据某次会议讨论），但点击不会跳转。
- datetime：这个属性说明修改的时间和日期，这里的时间和日期格式要符合规范（见下面time元素）。如果设置的值不符合该规范，无法被浏览器自动读取，那么它将没有任何意义。

del表现为文字中划线
ins表现为下划线

```html
// del
<p><del cite="www.baidu.com" datetime="2019-12-08">This text has been deleted</del>, here is the rest of the paragraph.</p>

// ins
<p><ins>这一段文本是新插入至文档的。</ins></p>


// 通常成对出现，有删除就会插入更正的内容
<p>一打有 <del>二十</del> <ins>十二</ins> 件。</p>
```
综合示例
```html
<del>
    <p>“I apologize for the delay.”</p>
</del>
<ins cite="../howtobeawizard.html" datetime="2018-05">
    <p>“A wizard is never late …”</p>
</ins>
```
```css
del,
ins {
    display: block;
    text-decoration: none;
    position: relative;
}

del {
    background-color: #fbb;
}

ins {
    background-color: #d4fcbc;
}

del::before,
ins::before {
    position: absolute;
    left: .5rem;
    font-family: monospace;
}

del::before {
    content: '−';
}

ins::before {
    content: '+';
}

p {
    margin: 0 1.8rem 0;
    font-family: Georgia, serif;
    font-size: 1rem;
}
```
[查看演示效果](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ins)


## 日期时间 time

世界上有许多种书写日期的格式，上边的日期可能被写成：
- 2016年1月20日
- 20/06/16
- 06/20/16
- 20 January 2016
- 20th January 2016
- Jan 20 2016
- The 20th of next month
- 20e Janvier 2016
- 等等...

但是这些不同格式的时间不容易被电脑识别。

假如你想自动抓取页面上所有事件的日期并将它们插入到日历中，使用`<time>` 元素，在`datetime`特性上附上清晰的、可被机器识别的 时间/日期来实现这种需求。

例如：
```html
<!-- 标准简单日期 -->
<time datetime="2016-01-20">20 January 2016</time>
<!-- 只包含年份和月份-->
<time datetime="2016-01">January 2016</time>
<!-- 只包含月份和日期 -->
<time datetime="01-20">20 January</time>
<!-- 只包含时间，小时和分钟数 -->
<time datetime="19:30">19:30</time>
<!-- 还可包含秒和毫秒 -->
<time datetime="19:30:01.856">19:30:01.856</time>
<!-- 日期和时间 -->
<time datetime="2016-01-20T19:30">7.30pm, 20 January 2016</time>
<!-- 含有时区偏移值的日期时间 -->
<time datetime="2016-01-20T19:30+01:00">7.30pm, 20 January 2016 is 8.30pm in France</time>
<!-- 调用特定的周 -->
<time datetime="2016-W04">The fourth week of 2016</time>
```


## 上标 sup 和下标 sub

当在文档化学方程式、和数学方程式时会偶尔使用上标和下标。 `<sup>` 和`<sub>`元素可以解决这样的问题。例如：
```html
<p>咖啡因的化学方程式是 C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>。</p>
<p>如果 x<sup>2</sup> 的值为 9，那么 x 的值必为 3 或 -3。</p>
```
效果为：
<p>咖啡因的化学方程式是 C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>。</p>
<p>如果 x<sup>2</sup> 的值为 9，那么 x 的值必为 3 或 -3。</p>

## 计算机代码显示 code pre samp kbd var

有特定的HTML元素可以来标记计算机代码：
- `<code>`: 用于标记计算机通用代码。
- `<pre>`: 对保留的空格（通常是代码块）——如果您在文本中使用缩进或多余的空白，浏览器将忽略它，不会呈现在页面上。但是，如果您将文本包含-在`<pre></pre>`标签中，那么空白将会以与你在文本编辑器中看到的相同的方式渲染出来。
- `<var>`: 用于标记具体变量名。
- `<kbd>`: 用于标记输入电脑的键盘（或其他类型）输入。
- `<samp>`: 用于标记计算机程序的输出。

```html
// 单行代码：code
<p>请不要使用 <code>&lt;font&gt;</code> 、 <code>&lt;center&gt;</code> 等表象元素。</p>

// 代码块
<pre>
    <code>
const para = document.querySelector('p');
    para.onclick = function() {
    alert('噢，噢，噢，别点我了。');
}
    </code>
</pre>
        
// 表示代码变量    
<p>在上述的 JavaScript 示例中，<var>para</var> 表示一个段落元素。</p>
        
// 表示键盘输入      
<p>按 <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>A</kbd> 选择全部内容。</p>

// 输入和输出
<samp>$ 
    <kbd>ping mozilla.org</kbd>
    <samp>PING mozilla.org (63.245.215.20): 56 data bytes 64 bytes from 63.245.215.20: icmp_seq=0 ttl=40 time=158.233 ms</samp>
</samp>
```
效果：

<p>请不要使用 <code>&lt;font&gt;</code> 、 <code>&lt;center&gt;</code> 等表象元素。</p>

<pre>
    <code>
const para = document.querySelector('p');
    para.onclick = function() {
    alert('噢，噢，噢，别点我了。');
}
    </code>
</pre>
        
<p>在上述的 JavaScript 示例中，<var>para</var> 表示一个段落元素。</p>
        
<p>按 <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>A</kbd> 选择全部内容。</p>

<samp>$ 
    <kbd>ping mozilla.org</kbd>
    <samp>PING mozilla.org (63.245.215.20): 56 data bytes 64 bytes from 63.245.215.20: icmp_seq=0 ttl=40 time=158.233 ms</samp>
</samp>

## 内容注解 ruby rp rb rbc rt rtc

像中文的拼音注解，或者日本假名注解等东亚文字注音或字符注释，使用`ruby`元素。

`<ruby>`是父级元素，包含的子元素：
- `<rb>` - 下方内容主体，
- `<rt>` - 上方标注内容
- `<rp>` - 当浏览器不兼容时备选显示内容
- `<rbc>` - `<rb>`标签的集合，一个`<ruby>`主体中只能存在一个，多个默认第一个有效，其实就是来管理所有的`<rb>`标签。（Q: 不用行不行？A: 完全没问题，顶多DOM不那么那么规范）
- `<rtc>` - `<rt>`标签的加强版，注意，不是合集！一个内容标签最多可以对应两个`<rtc>`标签。这个标签在一定场景下还是有用处的，比如上下都有注释。

```html
// 单字
<ruby>
    <rb>汉<rb>
    <rt>han</rt>
    <rp>（han）</rp>
    <rb>字<rb>
    <rt>zi</rt>
    <rp>（zi）</rp>
    <!-- 也可以简写成这样 -->
    <!-- 汉 <rp>(</rp><rt>han</rt><rp>)</rp>
    字 <rp>(</rp><rt>zi</rt><rp>)</rp> -->
</ruby>

//词语
<ruby>
  明 日 <rp>(</rp><rt>ming ri</rt><rp>)</rp>
</ruby>

// 假名
<ruby>
    <rb>英雄</rb>
    <rt>えいゆう</rt>
    <rp>(えいゆう)</rp>
</ruby>
```
效果：

<ruby>
  汉 <rp>(</rp><rt>han</rt><rp>)</rp>
  字 <rp>(</rp><rt>zi</rt><rp>)</rp>
</ruby>

<ruby>
  明 日 <rp>(</rp><rt>ming ri</rt><rp>)</rp>
</ruby>

<ruby>
    <rb>英雄</rb>
    <rt>えいゆう</rt>
    <rp>(えいゆう)</rp>
</ruby>

rbc 和 rtc 兼容性很差，谨慎使用。以下内容目前仅Firefox全支持
```html
<ruby>
    <rbc>
        <rb>早</rb><rp>(</rp><rt>zao</rt><rp>)</rp>
        <rb>上</rb><rp>(</rp><rt>shang</rt><rp>)</rp>
        <rb>好</rb><rp>(</rp><rt>hao</rt><rp>)</rp>
    </rbc>
</ruby>

<ruby>
    <rb>早上好</rb>
    <rtc style = "ruby-position: over"><rt>zao shang hao</rt></rtc>
    <rtc style = "ruby-position: under"><rt>Good Morning</rt></rtc>
</ruby>
```
>  ruby标签和所有HTML标签一样，支持所有常规的标签属性和事件绑定，也支持对应的CSS样式。但也有些特有的样式：<br>
一、ruby-position 控制ruby标签内容与标注文字的相对位置。样式值：<br>
over 水平文本的上方渲染标注，在垂直文本的右侧渲染。默认值。<br>
under 水平文本的下方渲染标注，垂直文本底部左侧渲染。<br>
二、ruby-align: 表示内容与标注的文字对齐方式<br>
start 起始位置对齐(左对齐)<br>
center 居中<br>
space-between 均匀分布<br>
space-around 在其框内均匀分布内容，但不一定从边缘到边缘填充空间。

详细讲解和效果演示：[HTML`<ruby>`标签从入门到应用](https://www.jianshu.com/p/5d61e42b9463)

本地演示请将代码复制html文件中，用firefox浏览器打开查看。

## 度量 meter 和 进度 progress
在HTML5中，新增了progress和meter元素。
- meter元素为计量条控件，表示某种计量，适用于温度、重量、金额等量化的表现。
- progress元素为进度条控件，可表示任务的进度，如Windows系统中软件的安装、文件的复制等场景的进度。

### meter
表示某种度量，适用于温度、重量、金额等量化的表现，可以设定最大值和最小值，也可以设置阈值，低于或高于阈值都有默认的颜色。

特性：
- value {number} ：设置或获取此控件的值，必须要在min与max值的中间。
- max {number} ：设置此控件的最大值。缺省值：未设定此属性时，控件最大值为1。
- min {number} ：设置此控件的最小值。缺省值：未设定此属性时，控件最小值为0。
- low {number} ：设置过底的阈值，当value小于low并大于min时，显示过低的颜色。
-high {number} ：设置过高的阈值，当value大于high并小于max时，显示过高的颜色。
- optimum {number} ：设置最佳值，

当浏览器不支持此控件时，将显示控件里的内容，支持此控件的浏览器不会展示控件的内容。所以一般value特性值同时也写在内容中。
语法：
```html
// 无属性
<meter></meter>

比例:<meter value="0.4">0.4</meter>// 使用默认值min=0 max=1
分数:<meter value="80" min="0" max="100">80</meter>

容量值：<meter low="0.25" optimum="0.15" high="0.75" value="0.5">0.5</meter>
```

### progress
表示任务的进度，如Windows系统中软件的安装、文件的复制等场景的进度。

特性：
- max {number} ：设置或获取进度条的最大值。缺省值：未设定此属性时，控件最大值为1。
- value {number} ：设置或获取进度条的当前值。缺省值：未设置此值时，此进度条为'不确定'型，无具体进度信息；

无min特性。默认从0开始。全都默认时value的默认取值范围为0~1.0，设置0.2时表示20%的进度。

注意：
- 当浏览器不支持此控件时，将显示控件里的内容，支持此控件的浏览器不会展示控件的内容。所以一般将value值和内容值都输入。
- 当无value属性值时，progress控件将显示一个**加载的动画效果**。具体依浏览器实现而有不同。

```html
// 缺少默认值 max=1
进度：<progress value="0.25" >25%</progress>

// 自定义max值
进度：<progress max="100" value="25" >25%</progress>

// 无value值，页面将显示加载中的动画，动画效果视浏览器实现而有所不同
进度：<progress >正在下载...</progress>
```
[HTML5 progress和meter控件](https://www.cnblogs.com/polk6/p/5466353.html)

## 图像的热点区域 map area

具体请转到图片img章节<br>
[HTML图片热区map area的用法](https://www.cnblogs.com/mq0036/p/3337327.html)<br>
[演示效果](https://www.w3school.com.cn/tiy/t.asp?f=html_areamap)
