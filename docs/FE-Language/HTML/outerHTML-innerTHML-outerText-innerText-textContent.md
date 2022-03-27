# 区分：`outerHTML` `innerTHML` `outerText` `innerText` `textContent`

## 获取值
```html
<div id="outer">
    外部
    <div id="inner">
        内部
        <span style="display:none">浙江省</span>
        <!-- 这是注释 -->
        <span>杭州西湖美</span>
    </div>
</div>
```
```js
var d_outer = document.querySelector("#outer")
var d_inner = document.querySelector("#inner")

// 获取值
console.log("outerHTML >>>",d_outer.outerHTML)
console.log("innerHTML >>>",d_outer.innerHTML)
console.log("outerText >>>",d_outer.outerText)
console.log("innerHTML >>>",d_outer.innerText)
console.log("textContent >>>",d_outer.textContent)
```
```
outerHTML >>> <div id="outer">
            外部
            <div id="inner">
                内部
                <span style="display:none">浙江省</span>
                <span>杭州西湖美</span>
            </div>
        </div>
innerHTML >>> 
            外部
            <div id="inner">
                内部
                <span style="display:none">浙江省</span>
                <span>杭州西湖美</span>
            </div>
        
outerText >>> 外部
内部 杭州西湖美
innerHTML >>> 外部
内部 杭州西湖美
textContent >>> 
            外部
            
                内部
                浙江省

                杭州西湖美
            
        
```
![img](./image/get.png)
- `outerHTML`会获取包括其自身，以及后代元素的所有HTML内容。意义上的包含outer外部即自身,会对内容中的标签符号进行转义。
- `innerHTML`获取除自身外的，内部HTML内容。意义上的inner内部，会对内容中标签符号进行转义。
- `outerText`微软IE浏览器最先提出的属性，暂未被写入W3C标准，但被大部分其它厂商浏览器支持，获取其包含的所有元素节点文本内容，但不包括隐藏的元素节点。
- `innerText`同样是微软提出的属性，但2016年已被写入W3C标准。获取所有文本内容，获取值时表现也`outerText`一致。获取其包含的所有元素节点文本内容，但不包括隐藏的元素节点。
- `textContent`获取所有节点的文本内容。虽然都是获取文本内容，但是与`outerText/innerText`有很多不同：
    - 可以返回隐藏元素的文本内容；
    - `textContent`属性不仅对元素节点有效。对于属性节点，注释节点等都是有效的，也会返回`<style>`和`<script>`节点的文本内容；
    - 对.\t、\r、\n与连续的空格效果会生效，虽然我们只演示了\n换行。但`outerText/innerText`只对`div`元素节点显示换行

## 赋值

### outerHTML赋新值
```js
d_outer.outerHTML = "<span>这是outerHTML的赋值</span>"
// outerHTML赋值后再获取值，并不是最新的值，还是原来的值
console.log("outerHTML >>>",d_outer.outerHTML)
console.log("innerHTML >>>",d_outer.innerHTML)
console.log("outerText >>>",d_outer.outerText)
console.log("innerHTML >>>",d_outer.innerText)
console.log("textContent >>>",d_outer.textContent)
```
`d_outer.outerHTML`赋值表现与取值一样，会包括自身元素一起，都被替换，不会在页面中显示，但原有DOM片段仍在内存中，所以再次获取值仍然与赋值前一样。
![outerHTML](./image/outerHTML.png)
[传送门：MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/outerHTML)

### innerHTML赋值
```js
d_outer.innerHTML = "<span>这是innerHTML的赋值</span>"
// innerHTML赋值后再获取值,前后表现一致，为最新的值
console.log("outerHTML >>>",d_outer.outerHTML)
console.log("innerHTML >>>",d_outer.innerHTML)
console.log("outerText >>>",d_outer.outerText)
console.log("innerHTML >>>",d_outer.innerText)
console.log("textContent >>>",d_outer.textContent)
```
`d_outer.innerHTML`赋值表现与取值一致，仅对内部内容进行替换，并且重新获取值是最新内容。
![innerHTML](./image/innerHTML.png)

### outerText赋值
```js
d_outer.outerText = "<span>这是outerText的赋值</span>"
// outerText赋值后再获取值,并不是最新的值，还是原来的值。同outerHTML表现一样
console.log("outerHTML >>>",d_outer.outerHTML)
console.log("innerHTML >>>",d_outer.innerHTML)
console.log("outerText >>>",d_outer.outerText)
console.log("innerHTML >>>",d_outer.innerText)
console.log("textContent >>>",d_outer.textContent)
```
`d_outer.outerText`有兼容性，并不是W3C标准属性。
- 赋值新内容会连自身元素也被替换。
- 不会对内容中的标签符号进行转换，默认全为字符文本。
- 重新取值仍然为内存中原来的值。
除了第二点外，基本表现与`outerHTML`一致。
![outerText](./image/outerText.png)

### innerText赋值
```js
d_outer.innerText = "<span>这是innerText的赋值</span>"
// innerText赋值后再获取值
console.log("outerHTML >>>",d_outer.outerHTML)
console.log("innerHTML >>>",d_outer.innerHTML)
console.log("outerText >>>",d_outer.outerText)
console.log("innerHTML >>>",d_outer.innerText)
console.log("textContent >>>",d_outer.textContent)
```
`d_outer.innerText`赋值新内容，仅对后代节点内容进行替换。同样不会对赋值内容中的标签符号进行转义，默认全为字符文本。
![innerText](./image/innerText.png)

### textContent赋值
```js
d_outer.innerText = "<span>这是textContent的赋值</span>"
// textContent赋值后再获取值
console.log("outerHTML >>>",d_outer.outerHTML)
console.log("innerHTML >>>",d_outer.innerHTML)
console.log("outerText >>>",d_outer.outerText)
console.log("innerHTML >>>",d_outer.innerText)
console.log("textContent >>>",d_outer.textContent)
```
`d_outer.outerText`赋值新内容，仅对后代节点内容进行替换。同样不会对赋值内容中的标签符号进行转义，默认全为字符文本。同`innerText`赋值完全一致。
![textContent](./image/textContent.png)

## 总结
![textContent](./image/get1.png)