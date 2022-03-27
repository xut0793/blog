# 异步任务 nextTick

[[toc]]

## 事件循环 eventLoop

js 是单线程运行，实现异步任务依赖于浏览器实现的事件循环机制。

事件循环大致分为以下几个步骤：
1. 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
2. 主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
3. 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。取出异步任务，进入执行栈，开始执行，以此歪循环。

主线程的一次执行过程就是一个 tick，而所有的异步结果都是通过 “任务队列” 来调度。 

任务队列中存放的是一个个的任务（task）。 ES 规范中规定 task 分为两大类，分别是宏任务 macro task 和微任务 micro task，并且每个宏任务 macro task 执行结束后，都要清空当前所有的微任务 micro task。

在浏览器环境中，常见的微任务 micro task：
- Promise.then
- MutationObsever
- Object.Observer
- process.nextTick (Node环境)

常见的宏任务 macro task ：
- setInterval
- setTimeout
- setImmediate
- MessageChannel
- postMessage
- requestAnimationFrame
- I/O
- UI 交互事件
- Network

![eventloop.png](../Vue/image/eventloop.png)

## 源码实现
```js
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIOS, isNative } from './env'

// 使用 callbacks 而不是直接在 nextTick 中执行回调函数的原因是
// 保证在同一个 tick 内多次执行 nextTick，不会开启多个异步任务，而把这些异步任务都压成一个同步任务，在下一个 tick 执行完毕。
const callbacks = []
let pending = false

// 包装一个函数，执行当前 tick 内的所有 cb
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let microTimerFunc
let macroTimerFunc
let useMacroTask = false 
// 切换使用宏任务还是微任务的开关，因为对于一些 DOM 交互事件，如 v-on 绑定的事件回调函数的处理 click，会强制走 macro task

// 降级适配可用的宏任务API
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// 微任务优先使用 promise，如果不支持，则降级到宏任务执行
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
  }
} else {
  // fallback to macro promise 不支持，则回退到宏任务
  microTimerFunc = macroTimerFunc
}

/**
 * 确保函数执行过程中对数据任意的修改，触发变化执行 nextTick 的时候强制走 macroTimerFunc。
 * 比如对于一些 DOM 交互事件，如 v-on 绑定的事件回调函数的处理，会强制走 macro task
 * 
 * 在执行原生DOM的事件时： add 函数中 handler = withMacroTask(handler)，然后才注册到 addEventListener 中
 */
export function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}

export function nextTick (cb, ctx) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  // 这是当 nextTick 不传 cb 参数的时候，提供一个 Promise 化的调用，比如：nextTick().then(() => {})
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```