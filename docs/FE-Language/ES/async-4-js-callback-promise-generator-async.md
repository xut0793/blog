# JS异步编程实例理解

回顾JS异步编程方法的发展，主要有以下几种方式：

1. Callback
1. Promise
1. Generator
1. Async

#### 需求
显示购物车商品列表的页面，用户可以勾选想要删除商品（单选或多选），点击确认删除按钮后，将已勾选的商品清除购物车，页面显示剩余商品。

为了便于本文内容阐述，假设后端没有提供一个批量删除商品的接口，所以对用户选择的商品列表，需要逐个调用删除接口。

用一个定时器代表一次接口请求。那思路就是遍历存放用户已选择商品的id数组，逐个发起删除请求del，待全部删除完成后，调用获取购物车商品列表的接口get

#### 实现
```js
let ids = [1, 2, 3] // 假设已选择三个商品
let len = ids.length
let count = 0

let start // 便于后面计算执行时间
```
#### 1. **callback**
传统常规的写法，如果是多个继行任务就会陷入回调地狱。比如此例中`get`作为`del`的回调函数
```js
let get = () => {
    setTimeout(() => {
        console.log(`get:${new Date() -start}ms`)
    }, 1000)
}

let del = (id, cb) => {
    setTimeout(() => {
        console.log(id)
        count++
        if (count === len) {
            cb()
        }
    }, 1000)
}

let confirmDel = () => {
    start = new Date()
    for (id of ids) {
        del(id, get)
    }
    console.log(`done:${new Date() -start}ms`)
}

confirmDel()
```
注意观察和对比done的打印顺序和get完成时间。
setTimeout是异步执行的，没有阻塞主流程的执行，所以done最先打印。
三个del任务是并行的，加上一个回调执行时间，所以整个点击删除按钮事件耗时2秒左右
```js
done:1ms
1
2
3
get:2007ms
```

#### 2. Promise
```js
let getP = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`get:${new Date() -start}ms`)
            resolve()
        }, 1000)
    })
}

let delP = (id, cb) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(id)
            count++
            if (count === len) {
                cb()
            }
            resolve()
        }, 1000)
    })
}

let confirmDelP = () => {
    start = new Date()
    for (id of ids) {
        delP(id, getP)
    }
    console.log(`done:${new Date() -start}ms`)
}

confirmDelP()
```
单纯常用Promise写法，看上去结构跟回调写法一样，而且运行时间也一样。
```js
done:2ms
1
2
3
get:2007ms
```
但是，如果使用Promise.all方法，就能很好将并发任务（三个del)和继发任务（get)区分开了，就是get不用嵌入回调中了。

#### 3. Promise.all
Promise对象then / catch / all / race / finally，以及resolve / reject更多内容请参阅`MDN`
```js
let delP_1 = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(id)
            resolve()
        }, 1000)
    })
}

let getP_1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`get:${new Date() -start}ms`)
            resolve()
        }, 1000)
    })
}

let confirmDelP_all = () => {
    start = new Date()
    let p_Arr = ids.map(id => delP_1(id))

    Promise.all(p_Arr)
        .then(() => {
            return getP_1()
        })
        .then(() => {
            console.log(`done:${new Date() -start}ms`)
        })
}
confirmDelP_all()
```
在这里，代码的语义就很直观了，先并发三个删除`del`，全部成功后执行`get`，`get`成功后`done`。
注意看`done`的打印顺序
```js
1
2
3
get:2008ms
done:2010ms
```
#### 4. Generator
`Generator`类型是一种特殊的函数，它拥有自己独特的语法和方法属性。比如函数名前加*，配合yield 返回异步回调结果， 通过next 传入函数、next返回特殊的包含value和done属性的对象等等，具体见`MDN`

`Generator`是一种**惰性求值**函数，执行一次next()才开启一次执行，到yield又中断，等待下一次next()。所以本人更喜欢叫它**步进函数**，非常适合执行继发任务

假设现在每一个接口请求都是继发任务，就是说只有当上一个请求成功后，才开始下一个请求。在实际的场景中，通常是当前请求需要使用上一个请求返回的结果数据。此时使用`Generator`函数是最好的方式。

```js
let generator

let getG = () => {
    setTimeout(() => {
        console.log(`get:${new Date() -start}ms`)
        generator.next()
    }, 1000)
}

let delG = (id) => {
    setTimeout(() => {
        console.log(id)
        generator.next()
    }, 1000)
}

function *confimrDelG () {
    start = new Date()
    for (id of ids) {
        yield delG(id)
    }
    yield getG()
    console.log(`done:${new Date() -start}ms`)
}

generator = confimrDelG()
generator.next()
console.log('会被阻塞吗？')
```
观察打印的时间，四个异步任务4秒左右。
注意"阻塞“文字最先打印
```js
会被阻塞吗？
1
2
3
get:4009ms
done:4011ms
```
我理解`Generator`就是一个用来装载异步继发任务的容器，不阻塞容器外部流程，但是容器内部任务用`yield`设置断点，用`next`步进执行，可以通过next向下一步任务传值，或者直接使用yield返回的上一任务结果。


#### 5. async / await

#### `async` 函数
我们先看MDN上关于async function怎么说的：
> When an async function is called, it returns a Promise. When the async function returns a value, the Promise will be resolved with the returned value. When the async function throws an exception or some value, the Promise will be rejected with the thrown value.

也就是说async函数会返回一个Promise对象。

- 如果async函数中是return一个值，这个值就是Promise对象中resolve的值；
- 如果async函数中是throw一个值，这个值就是Promise对象中reject的值。

例子显示下，我们先用`Promise`写法

```js
function imPromise(num) {

  return new Promise(function (resolve, reject) {
    if (num > 0) {
      resolve(num);
    } else {
      reject(num);
    }
  })
}

imPromise(1).then(function (v) {
  console.log(v); // 1
})

imPromise(0).catch(function (v) {
  console.log(v); // 0
})
```
再用`Async`写法
```js
async function imAsync(num) {
  if (num > 0) {
    return num // 这里相当于resolve(num)
  } else {
    throw num // 这里相当于reject(num)
  }
}

imAsync(1).then(function (v) {
  console.log(v); // 1
});

// 注意这里是catch
imAsync(0).catch(function (v) {
  console.log(v); // 0
})
```
所以理解`Async`为`new Promise`的语法糖也是这个原因。但要注意一点的是上面`imPromise`函数和`imAsync`函数调用返回的结果区别。

> `new Promise`生成的是一个`pending`状态的`Promise`对象，而`async`返回的是一个`resolved`或`rejected`状态的`Promise`对象,就是一个已经终结状态的`promise`对象。理解这点，对下面的`await`理解很重要。
```js
let p = imPromise(1)
console.log(p) // Promise { pending }
let a = imAsync(1)
console.log(a) // Promise { resolved }
```

### `await`
再来看看MDN对于await是怎么说的：
> An async function can contain an await expression, that pauses the execution of the async function and watis for the passed Promise's resolution, and then resumes the async function's execution and returns the resolved value.

await会暂停当前async函数的执行，等待后面的Promise的计算结果返回以后再继续执行当前的async函数

- **`await`等待什么？？**

**await等待一个Promise对象从pending状态到resoled或rejected状态的这段时间。**
所以如果要实现中断步进执行的效果，`await`后面接的必须是一个`pedding`状态的`promise`对象，其它状态的`promise`对象或非`promise`对象一概不等待。
这也是`await`和`yield`的区别（`yield`不管后面是什么，执行完紧接着的表达式就中断）。

####  async / await 解决了什么问题？

`Promise`解决`callback`嵌套导致回调地狱的问题，但实际上并不彻底，还是在`then`中使用了回调函数。而`async / await`使得异步回调在写法上完成没有，就像同步写法一样。
看个例子：
```js
// callback
get((a) => {
    (a,b) => {
        (b,c) => {
            (c,d) => {
                (d,e) => {
                    console.log(e)
                }
            }
        }
    }
})
```
```js
// promise
get()
    .then(a => p1(a))
    .then(b => p1(b))
    .then(c => p1(c))
    .then(d => p1(d))
    .then(e => {console.log(e)})
```
```js
// async / await
(async (a) => {
    const b = await A(a);
    const c = await A(b);
    const d = await A(c);
    const e = await A(d);
    console.log(e)

})()
```

#### `async / await` 实现继发任务
我们用`async / await`改写上面`Generator`的例子
```js
let delP_1 = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(id)
            resolve()
        }, 1000)
    })
}

let getP_1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`get:${new Date() -start}ms`)
            resolve()
        }, 1000)
    })
}

async function confimrDelAsync () {
    start = new Date()
    for (id of ids) {
        await delP_1(id)
    }
    await getP_1()
    console.log(`done:${new Date() -start}ms`)
}

confimrDelAsync()
console.log('被阻塞了吗？')
```
打印结果基本跟`generator`一样。但在语义上更明确。
```js
被阻塞了吗？
1
2
3
get:4014ms
done:4016ms
```

#### `async / await` 实现并发任务

```js
let delP_1 = (id) => {
    setTimeout(() => {
        console.log(id)
    }, 1000)
}

let getP_1 = () => {
    setTimeout(() => {
        console.log(`get:${new Date() -start}ms`)
    }, 1000)
}

async function confimrDelAsync () {
    start = new Date()
    for (id of ids) {
        await delP_1(id)
    }
    await getP_1()
    console.log(`done:${new Date() -start}ms`)
}

confimrDelAsync()
console.log('被阻塞了吗？')
```
不返回`Promise`对象，或者使`promise`对象处理`resoled`状态，就可以不执行等待。但这样的写法跟直接用同步方式写一样，所以并不推荐，显得多此一举。
```js
done:4ms
1
2
3
get:1009ms
```

#### `async / await` 实现并发和继发的混合任务

如果事件函数中并发任务和继发任务都有，此时使用`async / await`才是最好的解决方式。其中的并发任务用`promise.all`实现，因为它返回的正是`await`可用的`pending`状态的`Promise`对象。

```js
let delP_1 = (id) => {
    setTimeout(() => {
        console.log(id)
        resolve()
    }, 1000)
}

let getP_1 = () => {
    setTimeout(() => {
        console.log(`get:${new Date() -start}ms`)
        resolve()
    }, 1000)
}

async function confimrDelAsync_all () {
    start = new Date()

    let p_Arr = ids.map(id => delP_1(id))

    await Promise.all(p_Arr)
    await getP_1()
    console.log(`done:${new Date() -start}ms`)
}
confimrDelAsync_all()
console.log('被阻塞了吗？')
```
观察时间是继发任务的一半。且不阻塞主流程。
```js
被阻塞了吗？
1
2
3
get:2009ms
done:2010ms
```

> **所以说`async`是`promise`的语法糖，但是函数返回的`promise`的状态是不一样的。说`await`是`yield`的语法糖，但是`await`只能接受`pending`状态的`promise`对象**

> `async`可以单独使用，`await`不能单独使用，只能在`async`函数体内使用

所以针对开头的需求：

> 显示购物车商品列表的页面，用户可以勾选想要删除商品（单选或多选），点击确认删除按钮后，将已勾选的商品清除购物车，页面显示剩余商品。

最好的解决方案是：
> `promise.all` 与 `async / await`结合

其次是：
> `promise.all`

在实际项目中还应该加上捕获错误的代码。
在`async / await`中结合`try...catch`
在`promise`中，因为错误具有冒泡以性质，所以在结尾加上`.catch`即可。

#### 尾声
文章只是自己的一个并发和继发混合需求引发的知识总结。但JS编程还有很多内容，包括异步事件、事件循环（浏览器和nodejs区别）、异步任务错误的捕获、promise/generator/async具体API细节等。还需要继续学习。

#### 参考链接
[https://blog.csdn.net/ken_ding/article/details/81201248](https://blog.csdn.net/ken_ding/article/details/81201248)
[https://segmentfault.com/a/1190000009070711?from=timeline&isappinstalled=0#articleHeader5](https://segmentfault.com/a/1190000009070711?from=timeline&isappinstalled=0#articleHeader5)
《Javascript ES6 函数式编程入门指南》 第10章 使用Generator






