# 2 指令 directive

在上一节我们知道，VUE的template模板通过VUE指令API实现与页面的视图层联系。所以本节将聚集在实现视图层交互的VUE指令系统directive的基础使用。

我们先回顾下，原生HTML元素的一个结构包含哪些内容？
```html
<button id="example" class="example" style="display:none" disabled onclick="handleClick"> content </button>
```
    html元素包括：
        标签：开始标签 <button>  结束标签 </button>
        特性及值： id="example"   class="example"   style="display:none"   
                    disabled (值类型为布尔值时，出现为true，元素中没有则为false)
        属性及值： display：none
        事件绑定： onclick="handleClick"
        内容： content

template中HTML元素写法与原生完全一样。不同的是当需要vue去控制元素某些部位的值时需要采用vue指令去绑定该值。
```html
<button v-if="true" id="example" v-bind:class="{example:true}" v-bind:style="[baseStyle]" v-bind:disabled="true" v-on:click.stop="handleClick">{{ content }}</button>
```
所以我们根据html的元素结构来学习对应的vue指令

在上面的这个例子，指令有四种形态，如`v-if`，`v-bind:disabled`，`v-on:click.stop`，`{{ }}`。

- 不带参数指令，一般控制着整个html元素的显示，如`v-if` / `v-show`根据值真假控制元素的可见和不可见，`v-for` 用于循环列表元素的批量生成。
- 带参数的指令`v-bind`绑定HMTL元素的特性，控制着该特性的表现，如`disabled`值为真，则disabled特性生效，按钮禁用。
- 带参数和事件修饰符的指令`v-on:click.stop`，事件修饰符只出现在事件绑定指令`v-on`上。


> disabled称为指令v-bind的参数,
    click称为指令v-on的参数，stop称为指令v-on的事件修饰符。
    {{ }}插值，严格上不算VUE标准指令，我归结在一起也是方便自己记忆而已。

所以对vue指令的可以总结为以下几类：

1. 绑定元素内容的指令：`{{}}`-输出字符串文本作为内容的插值， `v-html` - 输出DOM节点作为内容的指令
1. 绑定元素显示的指令：`v-if/else`， `v-show`， `v-for`
1. 绑定元素特性的指令：`v-bind` 特性名称作为指令的参数
1. 绑定元素事件的指令：`v-on` 事件名作为指令参数，及其相关修饰符
1. 表单元素实现值双向绑定的指令：`v-model`

后面，我们学习每一个指令的具体知识点。

