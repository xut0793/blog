# react-14: JSX 语法

<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-22 23:51:13
 * @LastEditTime: 2019-09-23 01:21:34
 * @Description:
 -->


## 使用 JSX 创建元素

```jsx
// 原生HTML元素
<div id="root">
    <h1>Hello React</h1>
</div>

// React.createElement
ReactDOM.render(
    React.createElement('h1', null, 'Hello React'),
    document.getElementById('root')
)

// JSX
ReactDOM.render(<h1>Hello React</h1>, document.getElementById('root'))
```

## JSX 创建元素添加属性

```jsx
// 原生HTML元素
<div id="root">
    <h1 id="uid" class="bgcolor" style="color:red;" onclick="alert('click')">
        Hello React
    </h1>
</div>

// React.createElement
ReactDOM.render(
    React.createElement(
        'h1',
        {
            id: 'uid',
            className: 'bgcolor',
            style: { color: 'red' },
            onClick: function(e) {
                alert('click')
            }
        },
        'Hello React'
    ),
    document.getElementById('root')
)

// JSX
ReactDOM.render(
    <h1
        id="uid"
        className="bgcolor"
        style={{ color: 'red' }}
        onClick={() => {
            alert('click')
        }}
    >
        Hello React
    </h1>,
    document.getElementById('root')
)
```

JSX 中大部分语法跟之前介绍`React.createElement()`中第二个参数语法一样。特殊的几点：

-   在 JSX 中，使用`{}`花括号动态输出变量。
-   同样，如果传递的是标准 HTML 属性，那么 JSX 转译显示 DOM 元素也拥有这些标准属性。非标准属性会被忽略，但仍可以通过`this.props`访问到。
-   CSS 类 class 同样采用`className`替代。
-   style 行内样式需要以对象形式传入，即有两层双花括号，并且 css 属性名采用小驼峰规范。
    ```
    {{color：'red', fontSize: '18px'}}
    ```
-   事件名采用`on+EventName`，采用小驼峰规范。并且事件处理程序写在花括号`{}`内。
    ```
    onClick={() => {alert('click')}}
    ```

## JSX 中注释

在 JSX 添加注释，需要使用花括号`{}`包裹。注释方式和普通 js 注释一致。

```jsx
const h1 = (
    <div>
        {// 单行注释，应确保右花括号要换行，不然会被注释掉
        }

        { // 单行注释，未换号，报错}

        {/* 多行注释： 建议任何时间都使用多行注释*/}
        
        {/*
        多
        行
        注
        释*/}
        <p>JSX注释</p>
    </div>
)
```

## JSX 中空格处理和换行处理

```jsx
<h1>
    {1} plus {2} is    {3}
</h1>

// 转译输出
<h1>
    <span>1</span><span> plus </span><span>2<span> is   </span><span>3</span>
</h1>

// 视图显示,与HTML结果一致。多个空格会被合并为一个。
1 plus 2 is 3
```

```jsx
<h1>
    {1}
    plus
    {2}
    is
    {3}
</h1>

// 转译输出
<h1>
    <span>1</span><span>plus</span><span>2<span>is</span><span>3</span>
</h1>

// 视图显示,所有空格和换行都被却去除了，有利于在React.createElement()构造。
1plus2is3
```

如果确实需要空格，可以这样写

```jsx
// 显性声明空格
<h1>
    {1}
    {'  '}
    plus
    {'  '}
    {2}
    {'  '}
    is
    {'  '}
    {3}
</h1>
```

## JSX 处理 HTML 实体符号

```js
<h2>more info &raquo</h2> // 正常显示右指尖引号
```

但在 JSX 中为了避免双重编码，需要使用`Unicode`版本的 HTML 实体替代。

```jsx
<h2>{more info \u00bb}</h2> // 正常显示右指尖引号

// 对频繁使用的可以定义变量保存
const RAQUO = '\uOObb'
<h2>{more info} {RAQUO}</h2>
// 或ES模板字符串
<h2>{`more info ${RAQUO}`}</h2>
```

## JSX 条件渲染

-   if / else
-   && 与运算符（短路运算）
-   ？: 三目运算
-   return null 阻止渲染

```jsx
// if / else
const Message = (props) => {
    if (props.isLogin) {
        return <button>Logout</button>
    } else {
        return <button>Login</button>
    }
}

// && 短路运算
const Message = (props) => props.isLogin && <button>Welcome</button>
const Message = (props) => <button>{props.isLogin && 'Welcome'</button>

// ?: 三目运算
const Message = (props) => props.isLogin ? <button>Logout</button> : <button>Login</button>
const Message = (props) => <button>{props.isLogin?'Logout':'login'</button>
```

## JSX 列表渲染

-   ES6 Array.prototype.map()

```jsx
const NumberList = (props) => {
  return (
    <ul>
      {props.numbers.map((number) => <li key={number.toString()}>{number}<li>)}
    </ul>
  );
}
```

## 总结

在 JSX 中记住重点：

-   在`{}`内处理变量输出
-   遵循小驼峰规范
-   JSX 就是 React.creteElement()语法糖
    -   JSX 也是一个表达式，在编译之后，JSX 表达式会被转为普通 Js 函数调用，并且对其取值后得到 js 对象。所以你可以在 if 语句和 for 循环的代码块中使用 JSX，将 JSX 赋值给变量，把 JSX 当作参数传入，以及从函数中返回 JSX。
