# VueRouter源码2：router.init 初始化

[[toc]]


## router.init 执行时机

```js
// main.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Info  = { template:'<div>id:{{this.$route.params.id}}</div>'}
const routes = [
  {path:'/info/:id', name: 'info', component:Info}
]
const router = new VueRouter({
  routes
})

const app = new Vue({
  el: '#app',
  render(h) {
    return h(App)
  },
  router
})
```

在完成了路由插件注册 `Vue.use(VueRouter)` 以及路由器的实例化 `const router = new VueRouter({route})` 后，即执行 `new Vue(options)`。

前端我们分析了在路由插件 `Vue.use(VueRouter)` 中执行了 VueRouter 的 install 方法，在 install 方法中主要是向 vue 生命周期钩子 beforeCreate 函数中混入了以下代码：

```js
Vue.mixin({
  beforeCreate: function beforeCreate () {
    if (isDef(this.$options.router)) { 
      // 此时是 new Vue 根实例时，因为只在 new Vue(options) 的 options 中传入了 router
      this._routerRoot = this; // 当前组件实例 vm
      this._router = this.$options.router; // new Vue 时传入的 new VueRouter 实例
      this._router.init(this); // 路由初始化
      Vue.util.defineReactive(this, '_route', this._router.history.current);
    } else { // 其它组件实例化时，保存从父组件上获取根实例 app，因为只有根实例上才含有路由信息
      this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
    }
    registerInstance(this, this);
  },
  destroyed: function destroyed () {
    registerInstance(this);
  }
});
```
其中 beforeCreate 钩子函数在 `new Vue(options)` 执行时会被调用，函数调用路径：`new Vue(options) => this._init(options) => Vue.prototype._init(options) => callHook(vm, 'beforeCreate')`

```js
Vue.prototype._init = function (options) {
  // 省略代码...
  if (options && options._isComponent) {
    // 组件选项合并
    initInternalComponent(vm, options);
  } else {
    // new Vue 时选项合并
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    );
  }
  initLifecycle(vm); // 挂载内部属性：$root/$parent/$refs=[]/$children=[]/_watcher=null，以及一些生命状态标志 flag: _inactive=null/_isMounted=false/_isDestoryed=false/_isBeingDestoryed=false
  initEvents(vm); // 挂载父组件传入的事件监听器 listeners 到实例 vm._events 对象上，来源于 template 解析到的 v-on 绑定的事件函数
  initRender(vm); // 挂载 $attrs/$listeners，以及绑定 _c/$createElement
  callHook(vm, 'beforeCreate');
  initInjections(vm); // resolve injections before data/props 1. 解析 inject 属性的数据；2. 并将其设置响应式（即k-v转为getter/setter）同时挂载到 vm 上
  initState(vm); // 初始 script 中的属性：initProps/initMethods/initData/initComputed/initWatch
  initProvide(vm); // resolve provide after data/props
  callHook(vm, 'created');

  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```
所以`new Vue(options)`会执行上面混入的代码。其中路由器初始化函数是核心代码 `this._router.init(this)`。

## router.init 源码

```js
class VueRouter {
  constructor (options = {}) {
    // 省略代码
    // 主要处理：1、生成路由映射关系；2、new History 实例化路由
  }

  /**
   * 在路由初始化时，核心就是进行路由的跳转，改变 URL 然后渲染对应的组件
   * init 调用分两种情况：全局 new Vue 实例时和 component 组件实例时
   * 
   * 一、component 组件实例时 new vnode.componentOptions.Ctor(options)
   *    1)、 this.apps.push(app)
   *    2)、 在组件销毁钩子函数注册一个回调函数，用于删除保存在 apps 数组中的实例和取消路由监听事件
   * 
   * 二、new Vue 全局实例时，除上面两个任务外，还有
   *    1)、调用 history.transitionTo 函数进行路径切换
   *    2)、调用 history.listen 函数添加路由视图渲染的回调函数 
   */
  init (app /* Vue component instance */) {
    
    assert(
      install.installed,
      `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
        `before creating root instance.`
    );

    this.apps.push(app);

    // set up app destroyed handler
    // 组件销毁钩子回调函数，主要处理：将销毁的组件从 apps 数组中删除，移除相关事件监听
    app.$once('hook:destroyed', () => {
      // clean out app from this.apps array once destroyed
      const index = this.apps.indexOf(app);
      if (index > -1) this.apps.splice(index, 1);
      // ensure we still have a main app or null if no apps
      // we do not release the router so it can be reused
      if (this.app === app) this.app = this.apps[0] || null;

      if (!this.app) {
        // clean up event listeners
        // https://github.com/vuejs/vue-router/issues/2341
        this.history.teardownListeners();
      }
    });

    // main app previously initialized
    // return as we don't need to set up new history listener
    /**
     * 从此往上部分，是 new Vue 和 new vnode.componentOptions.Ctor(options) 都会运行的。
     * 从此往下往下部分，只会初次注册 new Vue({router}) 时才会运行，即注册 transitionTo 和 listen
     */
    if (this.app) {
      return
    }

    this.app = app;

    const history = this.history;

    if (history instanceof HTML5History || history instanceof HashHistory) {
      // 进行路由过渡到目标url上
      history.transitionTo(
        history.getCurrentLocation(), // 当前浏览器地址栏 url：window.location.pathname 或 window.location.href
        setupListeners, // onComplete
        setupListeners // onAbort
      );
      
      // 设置路由变化的事件监听器，如 hashChange 或 popState 事件
      function setupListeners(routeOrError) {
        history.setupListeners();
        handleInitialScroll(routeOrError);
      };

      // 如果 new Router(options) 的 options 中有传入 scrollBehavior 属性，则执行默认滚动方法
      function handleInitialScroll (routeOrError) {
        const from = history.current;
        const expectScroll = this.options.scrollBehavior;
        const supportsScroll = supportsPushState && expectScroll;

        if (supportsScroll && 'fullPath' in routeOrError) {
          handleScroll(this, routeOrError, from, false);
        }
      };
    }

    /**
     * 在 install 注册时混入 beforeCreate 函数中的代码 
     * Vue.util.defineReactive(this, '_route', this._router.history.current)
     * 已将 _route 属性设为响应式，所以对其赋值会触发组件视图渲染更新
     * 
     * 这里将此触发视图更新的函数通过 history.listen 方法赋值给 history.cb ，待 history.transitionTo 方法最后执行。
    */
    history.listen(route => {
      this.apps.forEach(app => {
        app._route = route;
      });
    });
  }

  /**
   * 省略原型方法
   * push
   * replace
   * go
   * back
   * forward
   * currentRoute
   * addRoutes
   * match
   * getMatchedComponents
   * onReady
   * onError
   * beforeEach
   * beforeResolve
   * afterEach
   */
}
```
所以再看基类 History 原型对象上的 transitionTo 方法。

```js
class History {
  constructor (router, base) {
    this.router = router;
    this.base = normalizeBase(base);
    // start with a route object that stands for "nowhere"
    this.current = START;
    this.pending = null;
    this.ready = false;
    this.readyCbs = [];
    this.readyErrorCbs = [];
    this.errorCbs = [];
    this.listeners = [];
    this.cb = null
  }

  listen (cb) {
    this.cb = cb;
  }

  // 更新路由，调用 cb 触发视图渲染
  updateRoute (route) {
    this.current = route;
    this.cb && this.cb(route);
  }

  transitionTo (
    location,
    onComplete,
    onAbort
  ) {
    let route;
    try {
      route = this.router.match(location, this.current);
      /**
       * eg: /info/13?q=test
       * 
       * 经过 match 函数返回结果
       * route = {
       *  name: undefined,
       *  path: '/info/13',
       *  fullPath: '/info/13?q=test'
       *  query: {q: 'test'},
       *  params: {id: 13},
       *  meta: {},
       *  hash: '',
       *  matched: [{
       *    path: '/info/:id',
            regex: /^\/info\/((?:[^\/]+?))(?:\/(?=$))?$/i,
            name: 'info',
            components: {
              default: Info
            }
          }]
      * }
      */
    } catch (e) {
      this.errorCbs.forEach(cb => {
        cb(e);
      });
      // Exception should still be thrown
      throw e
    }
    this.confirmTransition(
      route,
      () => {
        const prev = this.current;
        this.updateRoute(route);
        onComplete && onComplete(route); // setupListeners 函数，注册 hashChange 或 popState 事件监听
        this.ensureURL();
        this.router.afterHooks.forEach(hook => {
          hook && hook(route, prev);
        });

        // fire ready cbs once
        if (!this.ready) {
          this.ready = true;
          this.readyCbs.forEach(cb => {
            cb(route);
          });
        }
      },
      err => {
        if (onAbort) {
          onAbort(err);
        }
        if (err && !this.ready) {
          this.ready = true;
          // Initial redirection should still trigger the onReady onSuccess
          // https://github.com/vuejs/vue-router/issues/3225
          if (!isNavigationFailure(err, NavigationFailureType.redirected)) {
            this.readyErrorCbs.forEach(cb => {
              cb(err);
            });
          } else {
            this.readyCbs.forEach(cb => {
              cb(route);
            });
          }
        }
      }
    );
  }

  confirmTransition (route, onComplete, onAbort) {
    const current = this.current;
    const abort = err => {
      // changed after adding errors with
      // https://github.com/vuejs/vue-router/pull/3047 before that change,
      // redirect and aborted navigation would produce an err == null
      if (!isNavigationFailure(err) && isError(err)) {
        if (this.errorCbs.length) {
          this.errorCbs.forEach(cb => {
            cb(err);
          });
        } else {
          warn(false, 'uncaught error during route navigation:');
          console.error(err);
        }
      }
      onAbort && onAbort(err);
    };
    const lastRouteIndex = route.matched.length - 1;
    const lastCurrentIndex = current.matched.length - 1;
    if (
      isSameRoute(route, current) &&
      // in the case the route map has been dynamically appended to
      lastRouteIndex === lastCurrentIndex &&
      route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
    ) {
      this.ensureURL();
      return abort(createNavigationDuplicatedError(current, route))
    }

    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched
    );

    const queue = [].concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // in-config enter guards
      activated.map(m => m.beforeEnter),
      // async components
      resolveAsyncComponents(activated)
    );

    this.pending = route;
    const iterator = (hook, next) => {
      if (this.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      try {
        hook(route, current, (to) => {
          if (to === false) {
            // next(false) -> abort navigation, ensure current URL
            this.ensureURL(true);
            abort(createNavigationAbortedError(current, route));
          } else if (isError(to)) {
            this.ensureURL(true);
            abort(to);
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort(createNavigationRedirectedError(current, route));
            if (typeof to === 'object' && to.replace) {
              this.replace(to);
            } else {
              this.push(to);
            }
          } else {
            // confirm transition and pass on the value
            next(to);
          }
        });
      } catch (e) {
        abort(e);
      }
    };

    runQueue(queue, iterator, () => {
      const postEnterCbs = [];
      const isValid = () => this.current === route;
      // wait until async components are resolved before
      // extracting in-component enter guards
      const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
      const queue = enterGuards.concat(this.router.resolveHooks);
      runQueue(queue, iterator, () => {
        if (this.pending !== route) {
          return abort(createNavigationCancelledError(current, route))
        }
        this.pending = null;
        onComplete(route);
        if (this.router.app) {
          this.router.app.$nextTick(() => {
            postEnterCbs.forEach(cb => {
              cb();
            });
          });
        }
      });
    });
  }
}
```
