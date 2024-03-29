# 发布策略

## 前言

本文只作概念理解，具体实践待日后实践再总结

蓝绿部署、滚动部署、灰度发布、A/B测试、金丝雀发布、流量切分等等概念，经常混淆，影响沟通效率。根本原因是这些名词经常出现，人们耳熟能详能够熟练地谈起，但对这些术语的理解却没有达成一致。

## 直接停服部署

应用部署的时候停止服务，并对外提供一个维护页进行提示，待应用部署完毕后，重新启动，再对外提供服务。

优势：直接部署的方式一般应用于服务器需求较少的业务，这种方式降低了资源成本，部署起来也相当方便；
劣势：缺点就是业务需要停止服务，如某些证券公司在不开盘的时候都会停服维护，但在 C 端应用中就不可能实施。

## 蓝绿部署 Blue/Green Deployment

蓝绿部署：建立两套完全一样配置的生产环境，绿色环境指当前正在使用的生产环境，蓝色环境指将要发布新版本的环境（热备环境）。应用更新时，绿色环境仍然对外提供服务，蓝色环境升级到应用版本，测试通过后，通过负载均衡变更，将流量指向蓝色环境。

此时，两套环境的角色可以互换，蓝色环境变为绿色环境，原来的绿色环境变为蓝色环境（热备环境），

> 蓝绿环境并没有特指某个环境，会随着发布轮流变更。一般将提供稳定服务的环境称为绿色环境，另一个热备环境称为蓝色色环境。
> 这里的一套生产环境，可以是一台服务器或是一个生产集群环境

蓝绿部署的基本理念就是保证至少一个可以实时提供服务的线上环境。对蓝色环境（热备环境）的使用也有不同的方式，比如：
- 蓝绿两个环境在平时都对外提供服务，通过负载均衡服务器分配，各承接 50% 流量。当要进行版本发布时，将流量 100% 分配到绿色环境，蓝色环境停服，用于升级新版本应用，待回归测试完成后，再通过负载均衡服务器切换流量到蓝色环境，再对绿色环境进行升级，并最终保证两个环境全部完成版本更新。
- 另一种方式是，蓝绿环境在平时只有一套对外服务，一套用于生产测试。

优势：
- 蓝绿部署至少保证一个环境提供服务，实现了不停服更新应用版本，新旧版本升级平滑过渡，不会影响用户访问
- 更新后的绿色环境接入生产环境，如果有问题发生时，可很方便地从绿色环境回滚到蓝色环境，无需重新构建
- 蓝绿部署时环境切换，只需要修改负载均衡服务器的流量开头，操作简单，容易实现。

劣势：
- 两套完全相同配置的环境，产生了冗余的维护和管理成本，以及设备开销

蓝绿部署能够简单快捷实施的前提假设是目标系统是非常内聚的，如果目标系统相当复杂，那么如何切换、两套系统的数据如何同步等问题，都需要仔细考虑。

## 滚动部署 Rolling Update Deployment

现在应用部署都是多台服务器的集群形式，在有多个集群实例的服务中，在不影响正常服务的情况下，停止一个或多个实例，进行版本更新，待验证合格后，再将实例加入到集群中提供正常服务，直到所有实例都更新到最新版本。
- 一次滚动式发布一般由若干个发布批次组成，每批停服的实例数量一般是可以配置的。并且配合灰度策略，通过负载均衡服务器做好流量分发，引导一部分用户使用新版本，验证后逐步升级剩余实例。例如第一批 1 台（金丝雀），第二批 10%，第三批 50%，第四批 100%。每个批次之间留观察间隔，通过手工验证或监控反馈确保没有问题再发下一批次，所以总体上滚动式发布过程是比较缓慢的 (其中金丝雀的时间一般会比后续批次更长，比如金丝雀 10 分钟，后续间隔 2 分钟)。
- 回退是发布的逆过程，将新版本流量从 LB 上摘除，清除新版本，发老版本，再将 LB 流量接入老版本。和发布过程一样，回退过程一般也比较慢的。

优势：
- 比起蓝绿部署不需要准备二套一样的集群，两倍的实例数，通过现有的机器或增加少量的机器就可以做到版本升级。
- 用户体验影响小，体验较平滑。
劣势：
- 但也引入了复杂度，需要控制好更新过程中服务会有新老版本用户共存的兼容情况、防止部署过程中自动伸缩的触发导致实例中版本的不确定、部署过程中出错的回滚策略等。
- 发布工具比较复杂，需要平滑的流量摘除和拉入能力。
- 发布和回退时间比较缓慢。

## 跨区域部署/灾备部署

跨区域服务部署就是将业务部署在不同区域的两个或多个机房。

跨区域部署一方面提升用户体验，让用户访问到离自己最近的数据中心；同时这也是一种灾备的考量，可以应对机房断电、自然灾害等严重事故，提升服务的可用性。

## 灰度发布 Canary Releases

黑白色的中间色是灰色，灰度发布是指在黑与白之间，能够平滑过渡的一种发布方式。也就是能让用户在新旧版本之间平滑过渡的发布方式。

灰度发布的重点是是**灰度策略**：
- 灰度策略中最重要的是制定**放量规则**：可以是按流量百分比，按用户ID，设置IP，按地域，或其它用户画像的特征来筛选新功能版本的流量。
- 但实现灰度发布的闭环流程，还包括：放量规则涉及到的用户筛选、发布频率、应用的部署策略、回滚策略、埋点系统（用户反馈信息或用户行为如何收集），以此决定下一批次的放量。

灰度发布从实现的方式上可以分为：物理灰度和逻辑灰度
- 物理灰度：根据机器维度进行灰度，直接部署新老版本在不同机器，控制流量打在新老版本上面，通常使用滚动部署的方式实现。
- 逻辑灰度：通过内嵌的代码逻辑来判断当前使用新版本还是旧版本。

[灰度发布在前端逻辑灰度的做法](https://juejin.cn/post/6844903969110622222)
```js
const component1 = () => {
 return (<div>我是A组件</div>)
}
const component2 = () => {
 return (<div>我是B组件</div>)
}
const isPass = getRule(params) // 查询灰度策略，符合规则的使用新版本
render() {
  if (isPass) { // 在白名单
    return component1()
  } else {
    return component2()
  }
}
```

在灰度发布的具体实现中，有两种常见的模式：金丝雀发布和 AB test 发布

## 金丝雀发布

金丝雀命名的来历：
> 矿井中的金丝雀：17 世纪，英国矿井工人发现，金丝雀对瓦斯这种气体十分敏感。空气中哪怕有极其微量的瓦斯，金丝雀也会停止歌唱；当瓦斯含量超过一定限度时，虽然鲁钝的人类毫无察觉，金丝雀却早已毒发身亡。当时在采矿设备相对简陋的条件下，工人们每次下井都会带上一只金丝雀作为瓦斯检测指标，以便在危险状况下紧急撤离。

所以在类度发布多批次逐步放量的过程中，可以根据用户接受度（用户投诉多不多）和观察本次功能是否存在上线前未发现的异常，来决定是否继续发布推送新功能，如果新功能反馈较差或者存在功能异常问题，则停止放量或者回滚到之前稳定的版本，及时修改问题。这样便避免一次推送情况下，如果出现问题则造成线上问题突然上升造成阻塞用户使用的问题。

金丝雀发布的优势：
1.提前收集用户对新功能的使用意见，及时完善产品功能
2.控制未知异常只出现在小范围内，不影响大多数用户
3.发现产品是否存在外在问题（如合规），可及时回滚至已旧版本

## AB test 发布

AB test就是一种灰度发布方式，线上同时运行 A / B 两个版本的应用，通过负载均衡服务器按照放量规则进行流量切分，按让一部分用户用A，一部分用户用B。当然也不仅限于两个版本，也可以是多个版本功能同时上限，测试各个版本的用户接受度。

部署策略可以使用蓝绿部署的方式，也可以采用类似滚动部署的分流策略（为A版本分配10%的流量，为B版本分配10%的流量，为C版本分配80%的流量）。

## 滚动部署、灰度发布、金丝雀发布、AB test 发布的区别

- 滚动部署关注的角度更偏向于运维人员如何调配服务器的硬件控制，灰度发布在部署策略的实现上会采用滚动部署的方式。
- 灰度发布是一套完整的发布方案，包括实际部署策略选择滚动部署、制定放量规则和发布指将、通过埋点系统分析用户反馈，解决问题，决定回滚策略等闭环细节。
- 金丝雀发布是灰度发布的一种具体方式，目标是确保新上线的系统稳定，用户体验的平滑过渡，关注的焦点是新系统的BUG、隐患。
- AB test 也是灰度发布的一种具体方式，目标是选择一个更被用户接受的版本功能，关注的焦点是不同功能的版本之间的差异，譬如说体验感、转化率、订单情况等。灰度过后，会选择一个最优的功能版本进行上线。

## 参考链接

- [蓝绿部署、金丝雀发布（灰度发布）、A/B测试的准确定义](https://www.lijiaocn.com/%E6%96%B9%E6%B3%95/2018/10/23/devops-blue-green-deployment-ab-test-canary.html) --- 指出了 AB test 关注点在多功能版本差异
- [要进大厂？前端灰度发布必须要知道](https://juejin.cn/post/6844903969110622222) --- 指出灰度中逻辑灰度在前端实现的伪代码
- [常见应用发布方式浅析](https://blog.csdn.net/zhinengyunwei/article/details/104043703) --- 图文并茂，列举了多种服务器部署方式
- [灰度发布：灰度很简单，发布很复杂](https://blog.csdn.net/justdo2008/article/details/80551247) --- 明确了灰度是一个系统性概念，包含一系列工作的集合。
- [前端工程化：构建、部署、灰度](https://zhuanlan.zhihu.com/p/71562853)