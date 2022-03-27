# 响应式原理4：总结

关于 Vue 响应式数据总结： 一个属性 key，一个 proxy，一个 observer， 二个 dep， 三种 watcher。
1. proxy：属性代理
1. Observer：变化侦测
1. Dep：依赖收集
1. Wactcher：派发更新

细节点：
1. 对象 dep 为闭包属性，数组 dep 为 `value.__ob__.dep`
1. 依赖 watcher 创建时，即触发依赖收集 `watcher.get`
1. 依赖收集需要绕一圈经过 watcher 自身，是为了建立 watcher 与 dep 多对多关系。
1. 依赖收集完成后需要清理陈旧的依赖 `watcher.cleanupDeps`
1. 派发更新执行 `queueWatcher`，而不是直接 run
1. 三种依赖执行回调函数不同

整个 data 的响应式处理流程图：

![vue-source-reacive.png](../Vue/image/vue-source-reacive.png)