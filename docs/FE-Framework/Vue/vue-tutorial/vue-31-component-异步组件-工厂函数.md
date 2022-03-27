# 32 异步组件

只有在这个组件需要使用的时候才从服务器加载这一个组件模块，用于渲染，并且会把结果缓存起来供未来复用。

实现方法：
组件定义的时候，以一个工厂函数的形式传入，在需要组件的执行这个函数，然后将组件选项作为结果返回，vue拿到返回的结果再构建组件。

```js
// 常规的组件定义
Vue.component('async-example', {
    template: `<div>this is a global component</div>`
})
```

```js
// 异步组件定义，以一个工厂函数形式，包含resolve,reject回调参数
Vue.component('async-example', function (resolve, reject) {
    // do some thing
    // 处理其它逻辑，并在完成后向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
      // 组件定义的其它选项
    })

    // 或者调用reject回调表示失败
    reject({
        template: `<div>result is failed</div>`
    })
})
```
将组件定义为一个`.vue`的单文件组件`my-async-component.vue`，然后和 webpack 的 code-splitting 功能一起配合使用，实现组件异步加载
```js
Vue.component('async-webpack-example', function (resolve) {
    // do some thing
    // 这个特殊的 `require` 语法将会告诉 webpack
    // 自动将你的构建代码切割成多个包，这些包
    // 会通过 Ajax 请求加载
    require(['./my-async-component'], resolve)
})
```
使用ES6的promise语法实现异步加载
```js
Vue.component('async-webpack-example',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```
```js
new Vue({
  // 局部注册组件，并异步加载
  components: {
    'async-webpack-example': () => import('./my-async-component')
  }
})
```
`vue 2.3.0`以上版本扩展了异步加载，可以自定义控制异步加载的状态。使用结构如下：
```js
Vue.component('async-webpack-example',
    () => ({
        // 需要加载的组件 (应该是一个 `Promise` 对象)
        component: import('./MyComponent.vue'),
        // 异步组件加载时使用的组件
        loading: LoadingComponent,
        // 加载失败时使用的组件
        error: ErrorComponent,
        // 展示加载时组件的延时时间。默认值是 200 (毫秒)
        delay: 200,
        // 如果提供了超时时间且组件加载也超时了，
        // 则使用加载失败时使用的组件。默认值是：`Infinity`
        timeout: 3000
    })
)
```
## 路由懒加载
Vue实现按需加载（懒加载），官方推荐使用结合webpack的代码分割功能进行。定义为异步加载的组件，在打包的时候，会打包成单独的js文件存储在static/js文件夹里面，在调用时使用ajax请求回来插入到html中。

再进这下，为了不产生太多细小的js文件请求，也可以通过webpack特定的API将部分组件打包在一起形成一个js文件请求过来。

在webpack中有三种方式实现按需加载：

**require实现**
这里的require是AMD规范的引入关键词，resolve是全部引入成功以后的回调函数，第一个参数是依赖，require会先引入依赖模块，再执行回调函数。
```js
{
    path: '/promisedemo',
    name: 'PromiseDemo',
    component: resolve =>  require(['../components/PromiseDemo'], resolve)
}
```

**webpack 2.4以上 + ES2015**
这里的import()方法由es6提出，import()方法是动态异步加载，返回一个Promise对象，then方法的参数是加载到的模块。
区别于Node.js的require（）方法是同步阻塞加载，import()方法是异步非阻塞加载的。
```js
// 下面2行代码，没有指定webpackChunkName，每个组件打包成一个js文件。
const ImportFuncDemo1 = () => import('../components/ImportFuncDemo1')
const ImportFuncDemo2 = () => import('../components/ImportFuncDemo2')
// 下面2行代码，指定了相同的webpackChunkName，会合并打包成一个js文件。
// const ImportFuncDemo = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo')
// const ImportFuncDemo2 = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo2')
export default new Router({
    routes: [
        {
            path: '/importfuncdemo1',
            name: 'ImportFuncDemo1',
            component: ImportFuncDemo1
        },
        {
            path: '/importfuncdemo2',
            name: 'ImportFuncDemo2',
            component: ImportFuncDemo2
        }
    ]
})
```

**webpack提供的require.ensure()**

> 过时的方法

 webpack把这个模块导出一个js文件，然后用到这个模块的时候，就动态构造script标签插入DOM，再由浏览器去请求。回调函数是在依赖加载完成之后执行。内部实现也依赖于promise。
 多个路由指定相同的chunkName，会合并打包成一个js文件。
 ```js
{
    path: '/promisedemo',
    name: 'PromiseDemo',
    component: r => require.ensure([], () => r(require('../components/PromiseDemo')), 'demo')
},
{
    path: '/hello',
    name: 'Hello',
    // component: Hello
    component: r => require.ensure([], () => r(require('../components/Hello')), 'demo')
}
 ```


[点击查看import()函数](https://www.cnblogs.com/liujian9527/p/9869370.html)
[NodeJS中的require和import](https://www.cnblogs.com/guanghe/p/6560698.html)
[异步组件在VUE项目中的实践](https://www.cnblogs.com/yzq-fighting/p/7731545.html)
[vue异步组件(高级异步组件)使用场景及实践](https://segmentfault.com/a/1190000012138052)

