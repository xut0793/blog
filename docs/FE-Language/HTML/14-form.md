# 表单元素 form

- 认识表单form
- 表表单的各类元素和属性
- 表单的校验
- 表单数据的提交和用JS提交表单数据
- 使用CSS样式化表单和一些高级CSS技巧
- 自定义一个表单组件


## 认识表单

前面讲的所有HTML元素都是从服务端获取数据在用户终端展示，而HTML表单及其相关元素则是反向，收集客户端输入的数据发送给服务端。所以HTML表单是用户和应用程序进行交互的主要入口。

HTML表单是由一个或多个输入的小部件组成。这些小部件即可做为form的子元素，也可在form元素之外作为单独的HTML元素，通常这些小部件能够清楚地指示用户输入表单所需的内容。在web设计中，表单设计所涉及的用户体验考虑是非常多的，具体可以查看相关UI设计或用户体验资源。

一个表单内容基本包含在`<form></form>`元素之内。最常用的表单控件包括`input` `label` `botton` `select` `option`等。

其中`input`元素是所有HTML元素中最强大也最复杂的，目前`input`元素`type`特性有22个值表示22种不同UI效果的输入控件。input元素有大量 type 属性和 attribute 属性，之间相互组合。很多 attribute 属性只在特定的几个 type 类型上有效。

- form
    - label
    - button
    - textarea
    - select
    - option
    - optgroup
    - fieldset
    - legend
    - datalist  -html5新增
    - keygen    -html5新增
    - output    -html5新增
    - input
        - text      --默认值
        - password
        - radio
        - checkbox
        - range
        - file
        - button
        - reset
        - submit
        - image
        - hidden
        - search    -html5新增
        - number    -html5新增
        - color     -html5新增
        - tel       -html5新增
        - email     -html5新增
        - url       -html5新增
        - time      -html5新增
        - date      -html5新增
        - datetime-local    -html5新增
        - month     -html5新增
        - week      -html5新增

## form 元素

form元素是一个表单包裹元素，它的特性主要与表单数据提交的HTTP请求相关，除了HTML元素的全局属性外，还包括：

- action: 表单数据提交的URL
- method：表单数据提交HTTP方法，只支持`GET / POST`
- enctype: 表单数据提交的编码格式，只在`method="POST"`有用。值类型包括`	application/x-www-form-urlencoded`(默认值) / `multipart/form-data` / `text/plain`
- accept-charset: 表单数据的字符集，默认是表单所在文档html的字符集
- name: 表单名称，要求唯一性
- target：对action URL返回值打开页面方式，值与超链接a元素一样
- autocomplete：on/off 是否启用表单的input框输入自动完成功能，HTML5新增
- novalidate：表单提交时不进行验证，HTML5新增

表单元素的HTTP请求发送，默认绑定在`type=submit`的`input`或`button`子元素上或者在JS中调用form对象的sumbit方法`form.submit()`。如果要劫持form表单自动提交HTTP请求的行为，可以通过监听form元素的`submit`事件，然后阻止目标元素的默认行为，使用自定义方法。

```js
// 这里使用常规的元素获取方式，但实际上获取表单元素方式有多种，包括DOM对象中特定的form元素API
var form = document.getElementById("myForm");

// ...然后接管表单的提交事件
form.addEventListener("submit", function (event) {
    event.preventDefault(); // 阻止表单元素的默认发送行为

    sendData();
});
```

## label 标签

标签label元素主要作为表单输入元素的标题，如：
```html
<label for="name">Name:</label>
<input type="text" id="name" placeholder="please input you name">
```
规则就是 label 标签的`for`属性与它相对应的表单输入元素的id属性相关联即可，比如上例中的 input 标签的 `id` 属性，也可以是其它输入元素如textarea等。

并且写法上建议label标签与关联的元素分开写，不要将关联元素嵌套在label元素里，因为屏幕设置不理解嵌套元素之间的隐含关系，它只从for属性关联性来理解。这种最佳实践事实上也是为了更好的语义化。

```html
<!-- 即使是多标签最佳写法 -->
<div>
  <label for="username">Name: <abbr title="required">*</abbr></label>
  <input id="username" type="text" name="username">
</div>
```
<div>
  <label for="username">Name: <abbr title="required">*</abbr></label>
  <input id="username" type="text" name="username" placeholder="please input your name...">
</div>

使用label元素关联表单输入元素有几个好处：

- 更好的语义化，屏幕阅读器正确读出当前输入的标签名，如上例所示会读出诸如“Name, edit text”，如果缺少标签则会读出“Edit text blank”之类的东西，这样不知道当前编辑的是什么，对用户输入没什么帮助。
- 点击标签名即可将聚集在输入元素上，这样控件的可点击区域扩大了，用户体验上更容易聚集到输入框中。

## 表单的校验
待补充

## 表单数据的提交和用JS提交表单数据
待补充