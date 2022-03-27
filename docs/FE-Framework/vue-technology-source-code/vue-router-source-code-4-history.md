# VueRouter源码4: history 路由实例

[[toc]]

VueRouter 构造函数源码，主要是初始化一系列属性。其中核心两点：
1. `this.matcher = createMatcher(options.routes || [], this);` 中 createMactcher 函数：创建路由映射表 pathList pathMap nameMap
2. `this.history` 实际的路由实例。依模式调用不同的路由构造器

上一节分析了路由匹配器的生成，这节看下源码中路由实例的生成 history

```js
class VueRouter {
  constructor (options = {}) {
    this.app = null;  // Vue 根实例，即 new Vue 实例, 在 init 函数中 this.app = app
    this.apps = []; // 存入各组件实例
    this.options = options; // 路由配置对象，即 new VueRouter({ routes: routes })
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];
    this.matcher = createMatcher(options.routes || [], this);
    // 返回两个工具函数 match / addRoutes，路由映射关系 pathList / pathMap / nameMap 存在 createMatcher 函数的闭包属性中

    let mode = options.mode || 'hash';
    // 在浏览器不支持 history.pushState 的情况下，根据传入的 fallback 配置参数，决定是否回退到hash模式
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false;
    if (this.fallback) {
      mode = 'hash';
    }
    if (!inBrowser) {
      mode = 'abstract';
    }
    this.mode = mode;

    /**
     * this.history 表示路由历史的具体的实现实例，它是根据 this.mode 的不同实现不同，
     * HTML5History / HashHistory / AbsractHistory 都继承自 History 基类，然后不同的 mode 定义不同的类。
     */
    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base);
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback);
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base);
        break
      default:
        {
          assert(false, `invalid mode: ${mode}`);
        }
    }
  }
 
  /**
   * 省略原型方法
   * init
   * match
   * push
   * replace
   * go
   * back
   * forward
   * addRoutes
   * resolve
   * onReady
   * onError
   * beforeResolve
   * beforeEach
   */
}
```

上述构造函数中，会通过 mode 不同，实现不同场景下的路由实例。不管种类不同，但其肯定都具有一些共同的属性和方法，所以会有一个基类来定义这些共同的属性和方法。

## 基类 History

```js
class History {

  // implemented by sub-classes
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
  }
  
  /**
   * 省略原型方法
   * onReady
   * onError
   * listen
   * teardownListeners
   * updateRoute
   * transitionTo
   * confirmTransition
   */
}

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      const baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

const START = createRoute(null, {
  path: '/'
});
/**
 *  START = {
 *    name: undefined,
 *    path: '/',
 *    fullPath: '/'
 *    query: {},
 *    params: {},
 *    meta: {},
 *    hash: '',
 *    matched: []
  * }
 * }
*/
```

基类 History 中，原型对象上的核心方法：
- transitionTo 和 confirmTransition 实现路径切换，执行路由生命周期
- updateRoute 实现了路由改变，触发组件渲染

待到后面路由器初始化 init 方法中分析其实现。

## 子类 HashHistory

```js
class HashHistory extends History {
  constructor (router, base, fallback) {
    super(router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  /**
   * 原型方法
   * push
   * replace
   * go
   * getCurrentLocation
   * setupListeners
   * ensureURL
   */
}

function ensureSlash () {
  const path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  let href = window.location.href;
  const index = href.indexOf('#');
  // empty path
  if (index < 0) return ''

  href = href.slice(index + 1);
  // decode the hash but not the search or hash
  // as search(query) is already decoded
  // https://github.com/vuejs/vue-router/issues/2708
  const searchIndex = href.indexOf('?');
  if (searchIndex < 0) {
    const hashIndex = href.indexOf('#');
    if (hashIndex > -1) {
      href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
    } else href = decodeURI(href);
  } else {
    href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
  }

  return href
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

// 这就是我们输入首页 127.0.0.1:5500时，会变成 127.0.0.1:5500#/的原因
function getUrl (path) {
  const href = window.location.href;
  const i = href.indexOf('#');
  const base = i >= 0 ? href.slice(0, i) : href;
  return `${base}#${path}`
}
```

## 子类 HTML5History

```js
class HTML5History extends History {
  constructor (router, base) {
    super(router, base);

    this._startLocation = getLocation(this.base);
  }

  /**
   * 原型方法
   * push
   * replace
   * go
   * getCurrentLocation
   * setupListeners
   * ensureURL
   */
}

function getLocation (base) {
  let path = decodeURI(window.location.pathname);
  // 如果当前 path 包含 base 路径则去掉
  if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
  // 返回结果 /vue.html#/info/13?q=keyword
}
/**
 * eg. url = http://127.0.0.1:5500/vue.html#/info/13?q=keyword
 * hash: "#/info/13?q=keyword"
 * host: "127.0.0.1:5500"
 * hostname: "127.0.0.1"
 * href: "http://127.0.0.1:5500/vue.html#/info/13?q=keyword"
 * origin: "http://127.0.0.1:5500"
 * pathname: "/vue.html"
 * port: "5500"
 * protocol: "http:"
*/
```
## 子类 AbstractHistory

```js
class AbstractHistory extends History {
  constructor (router, base) {
    super(router, base);
    this.stack = [];
    this.index = -1;
  }

  push (location, onComplete, onAbort) {
    this.transitionTo(
      location,
      route => {
        this.stack = this.stack.slice(0, this.index + 1).concat(route);
        this.index++;
        onComplete && onComplete(route);
      },
      onAbort
    );
  }

  replace (location, onComplete, onAbort) {
    this.transitionTo(
      location,
      route => {
        this.stack = this.stack.slice(0, this.index).concat(route);
        onComplete && onComplete(route);
      },
      onAbort
    );
  }

  go (n) {
    const targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    const route = this.stack[targetIndex];
    this.confirmTransition(
      route,
      () => {
        this.index = targetIndex;
        this.updateRoute(route);
      },
      err => {
        if (isNavigationFailure(err, NavigationFailureType.duplicated)) {
          this.index = targetIndex;
        }
      }
    );
  }

  getCurrentLocation () {
    const current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  }

  ensureURL () {
    // noop
  }
}
```