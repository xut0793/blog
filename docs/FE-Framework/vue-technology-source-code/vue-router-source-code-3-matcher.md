# VueRouter源码3: matcher 路由匹配器

[[toc]]

完成 VueRouter 插件的注册后，每二步就是实例化路由器对象

```js
const routes = [
  {path:'/info/:id',component:Info}
]

const router = new VueRouter({
  routes
})
```

## VueRouter 构造函数

看 VueRouter 构造函数源码，主要是初始化一系列属性。这里核心两点：
1. `this.matcher = createMatcher(options.routes || [], this);` 中 createMactcher 函数：创建路由映射表 pathList pathMap nameMap
2. `this.history` 实际的路由实例。依模式调用不同的路由构造器

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

## createRouteMap 创建路由映射关系

createMactcher 函数，主要作用是解析我们传入的路由配置 routes ，生成路径或名称与组件的映射关系，但持有这些映射关系的变量 pathList / pathMap / nameMap 存放在 createMatcher 函数的闭包中，返回一个 match 匹配方法和动态添加路由的方法 addRoutes

```js
function createMatcher ( routes, router) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  // 省略代码...
  function match ( raw, currentRoute, redirectedFrom ) {...}
  function redirect ( record, location ) {...}
  function alias ( record, location, matchAs ) {...}
  function _createRoute ( record, location, redirectedFrom ) {...}

  return {
    match: match,
    addRoutes: addRoutes
  }
}
```
可以看到 createMatcher 函数内声明了三个变量 pathList / pathMap / nameMap 保存路径和路由记录的匹配关系。核心函数是 `createRouteMap(routes)`

```js
function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  var pathList = oldPathList || [];
  var pathMap = oldPathMap || Object.create(null);
  var nameMap = oldNameMap || Object.create(null);

  // 遍历我们自定义每项路由，执行 addRouteRecord 函数
  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  // 确保通配符 * 路由放在 pathList 数组最后一项
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]); // 删除通配符项，并取出插入到最后。 splice 返回结果为数组，其中包含删除的数组元素
      l--;
      i--;
    }
  }

  {
    // warn if routes do not include leading slashes
    // 遍历每一项的路由路径，除了 * 通配符路由外，其它路径如果不以 / 开头，则警告
    var found = pathList
    // check for missing leading slash
      .filter(function (path) { return path && path.charAt(0) !== '*' && path.charAt(0) !== '/'; });

    if (found.length > 0) {
      var pathNames = found.map(function (path) { return ("- " + path); }).join('\n');
      warn(false, ("Non-nested routes must include a leading slash character. Fix the following routes: \n" + pathNames));
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

// 关注 addRouteRecord
// 例：{path:'/info/:id', name: 'info', component:Info}
function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path; // '/info/:id'
  var name = route.name; // 'info'

  // path 不能为空，component 不能为字符串
  {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(
        path || name
      )) + " cannot be a " + "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict); // path 去掉结尾的 / ，或者如果有 parent 入参则接上 parent.path/path，针对嵌套路由，存在 children

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions), // 根据路径生成路径匹配正则
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter, // 路由导航卫士
    meta: route.meta || {},
    props:
      route.props == null
        ? {}
        : route.components
          ? route.props
          : { default: route.props }
  };

  // 递归处理嵌套路由
  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    {
      if (
        route.name &&
        !route.redirect &&
        route.children.some(function (child) { return /^\/?$/.test(child.path); })
      ) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
            "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
            "the default child route will not be rendered. Remove the name from " +
            "this route and use the name of the default child route for named " +
            "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
      // 这里是关键一步：处理嵌套路由时传入第五个参数，即父路由的 record，以便在生成嵌套路由匹配记录方法 formatMatch 中生成 matched 属性值包含父路由记录，即而拿到父组件渲染。
    });
  }

  // 将处理后的路由添加到 pathList 和 pathMap
  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  // 如果路由配置有别名，则为别名也生成一个路由记录
  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];
    for (var i = 0; i < aliases.length; ++i) {
      var alias = aliases[i];
      if ( alias === path) {
        warn(
          false,
          ("Found an alias with the same value as the path: \"" + path + "\". You have to remove that alias. It will be ignored in development.")
        );
        // skip in dev to make it work
        continue
      }

      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    }
  }

  // 如果命名路由，则也建立名称和路由记录的映射关系
  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if ( !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
          "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}
```
总结函数调用路径：`createMatcher => createRouteMap => addRouteRecord`
```js
// 1. createMatcher
this.matcher = createMatcher(options.routes || [], this)
// 2. createRouteMap
const { pathList, pathMap, nameMap } = createRouteMap(routes)
// 3. 遍历 routes 每一项 route，调用 addRouteRecrd
routes.forEach(function (route) {
  addRouteRecord(pathList, pathMap, nameMap, route, parent);
});
// 4. 生成 record，添加到 pathList pathMap nameMap
var record = {
  path: normalizedPath,
  regex: compileRouteRegex(normalizedPath, pathToRegexpOptions), // 根据路径生成路径匹配正则
  components: route.components || { default: route.component },
  instances: {},
  name: name,
  parent: parent,
  matchAs: matchAs,
  redirect: route.redirect,
  beforeEnter: route.beforeEnter, // 路由导航卫士
  meta: route.meta || {},
  props:
    route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
};

// 所以，例如 routes = [{path:'/info/:id',component:Info}] 储存的路由映射关系是：
record = {
  path: '/info/:id',
  regex: /^\/info\/((?:[^\/]+?))(?:\/(?=$))?$/i,
  name: 'info',
  components: {
    default: Info
  }
}
pathList = ['/info/:id']
pathMap = {'/info/:id': record}
nameMap = {'info': record}
```
## match 路由匹配方法

createMatcher　函数返回的结果就是一个路由匹配方法和动态添加路由方法。其中动态添加路由方法　addRoutes 内部调用的是上面分析的 createRouteMap 方法，即动态向闭包属性 pathList / pathMap / nameMap 中添加数据。

另一个后面会频繁使用的方法 match ，看下源码实现：

```js
function match (
  raw,
  currentRoute,
  redirectedFrom
) {
  var location = normalizeLocation(raw, currentRoute, false, router); 
  var name = location.name;
  // 优先匹配路由名称
  if (name) {
    var record = nameMap[name];
    {
      warn(record, ("Route with name '" + name + "' does not exist"));
    }
    if (!record) { return _createRoute(null, location) } 

    var paramNames = record.regex.keys
      .filter(function (key) { return !key.optional; })
      .map(function (key) { return key.name; });

    if (typeof location.params !== 'object') {
      location.params = {};
    }

    if (currentRoute && typeof currentRoute.params === 'object') {
      for (var key in currentRoute.params) {
        if (!(key in location.params) && paramNames.indexOf(key) > -1) {
          location.params[key] = currentRoute.params[key];
        }
      }
    }

    location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
    return _createRoute(record, location, redirectedFrom)
  } else if (location.path) {
    location.params = {};
    for (var i = 0; i < pathList.length; i++) {
      var path = pathList[i];
      var record$1 = pathMap[path];
      // 对于 /info/:id 路由 matchRoute 解析出 params 参数 id
      if (matchRoute(record$1.regex, location.path, location.params)) {
        return _createRoute(record$1, location, redirectedFrom)
      }
    }
  }
  // no match 当前路径解析出结果都没有 name / path，则传入 record = null，即当前路由不在自定义的 routes 中，即不存在路由记录 record
  return _createRoute(null, location)
}
```
### normalizeLocation 序列化原始路径

先看下对原始 location 的解析：normalizeLocation

```js
 /**
 * eg: /info/13?q=test
 * 
 * {
 *  _normalized: true,
 *  path: '/info/13',
 *  query: {q:test},
 *  hash: ''
 * }
 */
function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  let next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next._normalized) {
    return next
  } else if (next.name) {
    next = extend({}, raw);
    const params = next.params;
    if (params && typeof params === 'object') {
      next.params = extend({}, params);
    }
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = extend({}, next);
    next._normalized = true;
    const params = extend(extend({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      const rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, `path ${current.path}`);
    } else {
      warn(false, `relative params navigation requires a current route.`);
    }
    return next
  }

  const parsedPath = parsePath(next.path || ''); // {path: '/info/13, query: 'q=keyword', hash:''}
  const basePath = (current && current.path) || '/';
  const path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append) 
    // resolvePath 解析成绝对路径，如 ../info 或者 ?/#开头的接上 base 路径
    : basePath;

  // 将 q=keyword 转为对象 {q:'keyword'}
  const query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  let hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = `#${hash}`;
  }

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}

function parsePath (path) {
  let hash = '';
  let query = '';

  const hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  const queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path,
    query,
    hash
  }
}
```
### createRoute 根据 location 生成路由项

可以看到 match 函数中各分支最终都会调用 _reateRoute 函数

```js
function _createRoute (
  record,
  location,
  redirectedFrom
) {
  if (record && record.redirect) {
    return redirect(record, redirectedFrom || location)
  }
  if (record && record.matchAs) {
    return alias(record, location, record.matchAs)
  }
  return createRoute(record, location, redirectedFrom, router)
}


function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  const stringifyQuery = router && router.options.stringifyQuery;

  let query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  const route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
  }
  return Object.freeze(route)
}

// 将之前经过 normalizeLocation 序列化成对象的 location 处理成完整路径，其中 query 部分需要在 stringifyQuery 函数中 encode 编码。
function getFullPath (
  { path, query = {}, hash = '' },
  _stringifyQuery
) {
  const stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function stringifyQuery (obj) {
  const res = obj
    ? Object.keys(obj)
      .map(key => {
        const val = obj[key];

        if (val === undefined) {
          return ''
        }

        if (val === null) {
          return encode(key)
        }

        if (Array.isArray(val)) {
          const result = [];
          val.forEach(val2 => {
            if (val2 === undefined) {
              return
            }
            if (val2 === null) {
              result.push(encode(key));
            } else {
              result.push(encode(key) + '=' + encode(val2));
            }
          });
          return result.join('&')
        }

        return encode(key) + '=' + encode(val)
      })
      .filter(x => x.length > 0)
      .join('&')
    : null;
  return res ? `?${res}` : ''
}

function formatMatch (record) {
  const res = [];
  // 所以在生成路由记录 addRouteRecord 函数内部，在递归处理嵌套路由时传入 第五个参数父路由的 record
  // addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

/**
 * eg: /info/13?q=test
 * 
 * 经过 normalizeLocation
 * location = {
 *  _normalized: true,
 *  path: '/info/13',
 *  query: {q:test},
 *  hash: ''
 * }
 * 
 * 经过 createRoute
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
 * 
 */
```
这里的关键是 route.matched 数组，它保存着当前 url 能匹配到多少路由记录 routeRecord，而路由记录 routeRecord 是由自定义的 routes 生成的，它里面保持着组件信息，所以根据 url 通过 match 方法生成 route，其中 matched 保存着匹配到 record，间接拿到匹配到的组件。

比如嵌套路由 match('/about/a') 匹配后生成的 route.matched 对象就能拿到组件 About 和 组件 a 的路由记录。

match 函数会在 transitionTo 中调用。

