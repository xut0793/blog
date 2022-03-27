# HTML5的template内容模板

[[toc]]

HTML内容模板template元素将它其中的内容存储在页面文档中，以供后续使用，该内容的DOM结构在加载页面时会被解析器处理，但最终内容不会在页面中显示。
![`template`内容模板元素](./imgs/template.png)

## template元素的特点

- 天生隐藏，不可见性：`display:none`及其内容
- childNodes无效，即在js中不能像常规元素一样获取其内容，必须使用`content`属性获取。
- 文档任意位置：head/body/script都可以

### template的不可见具体指两个方面：
一个是指本身不可见性，是因为`display:none`属性。如果把这个属性置为`display:block`打开，它还是在页面有占位,并且可以设置相应属性。
![`template`内容模板元素](./imgs/template1.png)
![`template`内容模板元素](./imgs/template2.png)
另一个是指其内容的不可见性，它内部的子节点理论上是不存在的，即使`display：block;`后内容也不会显示。js调用常规元素的属性获取也不行。必须通过特殊的`content`属性获取其存储的节点内容。
![ `template` 内容模板元素](./imgs/template3.png)

### 放置文档任意位置 head / body / script

![`template` 内容模板元素](./imgs/template4.png)


## 这个元素的意义何在呢？
有一个需求，需要根据Ajax请求返回的数据渲染表格内容，使用原生DOM或jQuery的做法，for循环遍历数据列表，每次循环都要创建tr元素和td元素，为td添加内容后插入到tr元素中，然后拼接tr元素，遍历结束后再将所有tr元素插入到table中。

这还是简单的元素结构，如果还有添加类、样式或事件，就更为麻烦了。此时如果我们用模板元素将结构定义好，那么在js中只需要复用元素，更改对应的内容即可插入父节点中，更为便捷。这也是现代MVVM框架常用的模板方式。
[DEOM:template](https://codepen.io/pen/?&editable=true)

## 参考链接：
[MDN: template](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/template)
[cnblog](https://www.cnblogs.com/hanguidong/p/9381317.html)
