# 响应式原理3：派发更新

上一节完成了依赖收集，理解了 Observer / Dep / Watcher 三个核心的类定义。此时，我们再看一个属性值变化了，到底是如何触发更新的。

```js
// 1. 对属性值赋值触发 setter 中的 dep.notify()
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  // 省略代码...
  const dep = new Dep()
  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (getter && !setter) { return } 
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      // 在这里通知依赖
      dep.notify()
    }
  });
}

// 2. 遍历之前收集到的依赖，调用依赖自身的 update 方法。
// 重要的点是需要确保依赖触发的正确顺序，原因见下面 queueWatcher 方法里的说明
Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (!config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update(); // watcher.update
  }
};  

// 3. 依赖的列新会依据依赖的种类执行不同的操作
// 如果是 computed-watcher 则进行 this.dirty = true，大部分依赖会执行 queueWatcher
Watcher.prototype.update = function update () {
  if (this.lazy) {
    this.dirty = true;  // computed-watcher 执行
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/** 4. 将更新的依赖推入缓存队列
 * 
 * 这里引入了一个队列的概念，这也是 Vue 在做派发更新的时候的一个优化的点:
 * 它并不会每次数据改变都触发 watcher 的回调，而是把这些 watcher 先添加到一个队列里，然后在 nextTick 后执行 flushSchedulerQueue。
 * 这里有几个细节要注意一下:
 *   首先用 has 对象保证同一个 Watcher 只添加一次；
 *   接着对 flushing 的判断，else 部分的逻辑稍后我会讲；
 *   最后通过 waiting 保证对 nextTick(flushSchedulerQueue) 的调用逻辑只有一次; 
 *   (nextTick 后面单独解析，目前就可以理解它是在下一个 tick，也就是异步的去执行 flushSchedulerQueue。)
*/
var MAX_UPDATE_COUNT = 100;
var queue = [];
var has = {};
var waiting = false;
var flushing = false;
var index = 0;

function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) { // 保证同一个 Watcher 只添加一次，即队列中不会有重复的 watcher
    has[id] = true;
    if (!flushing) { // 如果还未开始执行队列代码，则推入队列等待
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      /**
       * 从后往前遍历，在队列执行期间，如果 watcher.id 刚好可以插入到队列还未执行的部分，那就执行插入
      */
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) { // 保证在 flushSchedulerQueue 执行期间只调用一次，不会重复调用 flushSchedulerQueue。
      waiting = true;

      if (!config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

// 5. 执行队列，即按顺序逐个执行队列中 watcher.run
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  /**
   * queue.sort((a, b) => a.id - b.id) 对队列做了从小到大的排序，这么做主要有以下要确保以下几点：
   * 1.组件的更新由父到子；因为父组件的创建过程是先于子的，所以 watcher 的创建也是先父后子，执行顺序也应该保持先父后子。
   * 2.用户的自定义 watcher 要优先于渲染 watcher 执行；因为用户自定义 watcher 是在渲染 watcher 之前创建的。
   * 3.如果一个组件在父组件的 watcher 执行期间被销毁，那么它对应的 watcher 执行都可以被跳过，所以父组件的 watcher 应该先执行。
   * 
  */
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  /**
   * index 不能定义在局部，因为在队列执行过程中，可能还会有 watcher 插入队列，队列的 queue.length 会变化，并且当前遍历到的 index 在 queueWatcher 也要使用
  */
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null; // 已执行的依赖清控
    watcher.run();
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  // 队列执行完成后重置相关状态
  resetSchedulerState();

  // call component updated and activated hooks
  // 激活相关生命周期钩子函数
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);
}

// 队列执行完成后重置相关状态
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  waiting = flushing = false;
}

// 6. watcher.run 执行订阅者回调
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) { // 用户自定义的 wathcer，即 options.watch 定义
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};
```

最后的调用创建依赖 new Watcher 中传入的回调。针对不同的 watcher 类型，从 watcher.update 到 watcher.run 执行不同的操作：
- 视图渲染的 render-watcher，在 watcher.run 执行cb 是 `updateComponent = () => { vm._update(vm._render(), hydrating) }`
- 计算属性的 computed-watcher，即 `watcher.lazy = true`。在 watcher.update 中执行 `watcher.dirty = true`
- 自定义的 user-watcher，即 `watcher.user = true`。在 watcher.run 执行 cb 即自定义的回调。