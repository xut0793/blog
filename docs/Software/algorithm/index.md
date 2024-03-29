# 算法

## 什么是算法

算法（Algorithm）是指用来操作数据、解决程序问题的一类方法。设计算法的目的是为了节约程序运行时占用CPU时间或者内存空间。

## 算法复杂度
对于同一个问题，使用不同的算法，也许最终得到的结果是一样的，但在过程中占用CPU运行时间或者消耗的内存空间却会有很大的区别，那么应该如何去衡量不同算法之间的优劣呢？

主要还是从算法所占用的「时间」和「空间」两个维度去考量。
- 时间维度：是指执行当前算法执行所占用CPU时间，我们通常用「时间复杂度」来描述。
- 空间维度：是指执行当前算法需要占用多少内存空间，我们通常用「空间复杂度」来描述。

因此，评价一个算法的效率主要是看它的时间复杂度和空间复杂度情况。然而，有的时候时间和空间却又是「鱼和熊掌」，不可兼得的，有时需要用空间换取时间，或者时间换取空间，这就需要从中去取一个平衡点。

### 时间复杂度
如果想要知道一个算法的执行的时间，首先想到的方法就是把这个算法程序执行一遍，通过`console.time / console.timeEnd`统计出来，或者一些监听工具，就能得到算法执行的时间和占用内存的大小。事实上这种评估方法也称为**事后统计法**。
> 事后统计法是用测试程序和数据来运行已编写好的算法，对其执行时间进行比较。
事后统计法看似可以精确的得出算法的执行时间和内存占用空间，但这种方法有非常大的局限性。
- 算法的运行依赖计算机硬件和软件因素。比如用 Inter Core i9 处理器和 Inter Core i3 处理器的电脑执行同一算法，肯定i9执行速度更快。
- 算法的执行受数据规模的影响很大。比如对于几个数字的排序，不论是使用选择排序还是插入排序，亦或是快速排序，其执行耗时的差异基本没有。

所以我们需要另一种方法来判断算法的优劣，它叫**事前分析法**，这是一种不依赖具体环境和数据规模影响，只对算法执行效率进行分析的方法。

那么，如何在不运行代码的情况下对代码的执行效率进行分析呢？来看一个例子。

```js
function sum(n) {
  let sum = 0;                        // 执行 1 次
  for (let i = 0; i < n; i++) {       // 循环执行 n 次
    let base = i;                     // 执行 n 次
    for (let j = 0; j < n; j++) {     // 执行 n * n 次
      sum += base + j;                // 执行 n * n 次
    }
  }
}
```
现在假设计算机执行一行代码的时间都是一样的，记为单位时间 unitTime。
基于此，上述程序执行总时间记为 `T(n) = (1+n+n+n*n+n*n) * unitTime = (2n²+2n+1) * unitTime`。

其中，`2n²+2n+1` 表示代码语句执行的总次数，可以抽象为 `fn(n) = 2n²+2n+1`，即`T(n) = fn(n) * unitTime`。

所以，可以得出结论：**算法程序执行的总时间T(n)与代码执行次数fn(n)成正比**，抽象成公式表示为 **T(n)=O(f(n))**，这种表示法称为**大O表示法**。

大O表示法`T(n)=O(f(n))`，也叫算法的渐近时间复杂度，简称时间复杂度。表示随数据规模n的增大，算法执行时间的增长率。

#### 时间复杂度分析

像上述例子推导出的时间复杂度是 `T(n)=O(2n²+2n+1)`，那这段代码的时间复杂度我们称为 `O(n²)`。这中间的计算过程涉及到时间复杂度分析的一些基本法则：
- 加法常数项可以忽略：`2n²+2n+1` 中忽略 `1`，变成 `2n²+2n`
- 除去最高阶项，其它次项可以忽略： `2n²+2n` 忽略 `2n`，变成 `2n²`
- 与最高次项相乘的常数可以忽略: `2n²` 忽略 `2`，变成 `n²`，也就是结果 `O(n²)`。

##### 1.加法常数项可以忽略
如下表，将算法B的加法常数项1和算法A的加法常数项3去掉后，得到算法B1和算法A1。
在不同的执行次数下，算法B都是劣于算法A的。同样算法B1也是劣于算法A1。
因此，加法常数项对算法的复杂度几乎无影响。

| 次数  | 算法A(2n+3) | 算法B(5n+1) | 算法A1(2n) | 算法B(5n) |
| :---: | :---------: | :---------: | :--------: | :-------: |
|  n=1  |      5      |      6      |     2      |     5     |
|  n=2  |      7      |     11      |     4      |    10     |
|  n=3  |      9      |     16      |     6      |    15     |
| n=10  |     23      |     51      |     20     |    5 0    |
| n=100 |     203     |     501     |    200     |    500    |

##### 2.除去最高阶项，其它次项可以忽略
如下表，算法B相比于算法A，少了加法常数项2和次低项2n。
随着执行次数n的增大，算法A的执行效率越来越趋近与算法B。
因此，在进行算法的时间复杂度分析时，应主要关注最高阶项。

|  次数   | 算法A(2n²+2n+2) | 算法B(2n²) |
| :-----: | :-------------: | :--------: |
|   n=1   |        6        |     2      |
|   n=2   |       14        |     8      |
|   n=3   |       26        |     18     |
|  n=10   |       222       |    200     |
|  n=100  |      20202      |   20000    |
| n=1000  |     2002002     |  2000000   |
| n=10000 |    200020002    | 200000000  |

##### 3.与最高阶项相乘的常数可以忽略
如下表，将算法A和算法B的高阶项相乘的常数去掉后，得到算法A1和算法B1 
随着执行次数n的增加，算法A执行效率劣于算法B，算法A1的执行效率也是劣于算法B1。
因此，在进行算法的时间复杂度分析时，与最高次项相乘的常数并不重要。

|  次数  | 算法A(2n²) | 算法B(10n) | 算法A1(n²) | 算法B(n) |
| :----: | :--------: | :--------: | :--------: | :------: |
|  n=1   |     2      |     10     |     1      |    1     |
|  n=2   |     8      |     20     |     4      |    2     |
|  n=3   |     18     |     30     |     9      |    3     |
|  n=10  |    200     |    100     |    100     |    10    |
| n=100  |   20000    |    1000    |   10000    |   100    |
| n=1000 |  2000000   |   10000    |  1000000   |   1000   |

#### 常见的时间复杂度

常见时间复杂度主要有以下几种：

从上至下依次的时间复杂度越来越大，执行的效率越来越低。

| 大O表示法 | 非正式术语 |
| :-------: | :--------: |
|   O(1)    |   常数阶   |
|  O(logn)  |   对数阶   |
|   O(n)    |   线性阶   |
| O(nlogn)  | 线性对数阶 |
|   O(n²)   |   平方阶   |
|   O(n³)   |   立方阶   |
|  O(n^k)   |  k次方阶   |
|  O(2^n)   |   指数阶   |

##### 常数阶 O(1)

```js
function double(n) {
  let sum = 0    // 执行 1 次
  sum = n * 2    // 执行 1 次
  return sum     // 执行 1 次
}
```
代码共有三行，每行代码都是只执行一次，因此这段代码的运行次数函数是f(n)=3。那么，按照大O表示法，其时间复杂度是不是要记作T(n)=O(3)呢？但是大O表示法中，有一个基本法则：**用常数1取代运行时间中的所有加法常数**。因此，这段代码的时间复杂度是`T(n)=O(1)`。

所以说，对于这种与问题规模n无关，执行时间恒定的算法，其时间复杂度都记作`O(1)`，又称之为常数阶。

##### 对数阶 O(logn)

```js
function logarithm(n) {
  let count = 1           // 执行 1 次
  while (count <= n) {    // 执行 logn 次
    count = count * 2     // 执行 logn 次
  }
}
```
该段代码什么时候会停止执行呢？当count 大于 n 时。也就是说多少个2相乘后其结果值会大于n，即 `2^x=n`。由 `2^x=n` 可以得到 $x=log_2{n}$，所以这段代码执行总次数是$f(n)=2*log_2{n}+1$，忽略掉加法常数`1`和最高阶项相乘的常数`2`。所以时间复杂度是$O(log_2{n})$。

根据代数知识，对数换底公式：$log_a x = log_b{x} * log_b{a}$，所以采用2为底和采用任意一个数为底，只相差一个常数乘积，而算法分析中的大O表示法规则，与最高阶项相乘的常数可以忽略，也就是说对数以哪个底不重要，数量级对了就行。

大O表示法中 $O(log_2{n})$ 和 $O(log_a{n})$ 都是一样的，所以表示对数阶复杂度时省略对数的底，写成`O(logn)`。

> [指数和对数](https://www.shuxuele.com/algebra/exponents-logarithms.html)是一对反函数。$2^3=8$ 与 $log_2 8=3$，即 $log_a{a^x}=x$


##### 线性阶 O(n)

```js
function sum(n) {
  let sum = 0                    // 执行 1 次
  for (let i = 0; i < n; i++) {  // 执行 n 次
    sum += i                     // 执行 n 次
  }
  return sum                    // 执行 1 次
}
```

for 循环中的代码，第三行和第四行代码都执行 n 次，即 `f(n)=2n+2` 。根据复杂度分析规则，忽略掉加法常数`2`和最高阶项相乘的常数`2`。所以时间复杂度是 `O(n)`。
##### 线性对数阶 O(nlogn)

线性对数阶 `O(nlogn)` 就是将一段时间复杂度为 `O(logn)`的代码执行 n 次，如下代码所示。
```js
function fn(n) {
  let count = 1                   // 执行 1 次
  for (let i = 0; i < n; i++) {   // 执行 n 次
    while (count <= n) {          // 执行 n * logn 次
      count = count * 2           // 执行 n * logn 次
    }
  }
}
```

##### 平方阶 O(n²)

平方阶 O(n²)，即双重循环。外循环中将内循环这个时间复杂度为O(n)代码在执行n次，所以整个这段代码的时间复杂度为O(n²)。
```js
function fn(n) {
  for (let i = 0; i < n; i++) {     // 执行 n 次
    for (let i = 0; i < n; i++) {   // 执行 n * n 次
      console.log(i + j)            // 执行 n * n 次
    }
  }
}
```
当内层循环和外层循环的次数不一致时，时间复杂度又该怎么表示呢？
```js
function fn(m, n) {
  for (let i = 0; i < m; i++) {     // 执行 m 次
    for (let i = 0; i < n; i++) {   // 执行 m * n 次
      console.log(i + j)            // 执行 m * n 次
    }
  }
}
```
内层循环执行m次，其时间复杂度为O(m)，外层循环执行次数为n次，其时间复杂度为O(m)。整段代码的时间复杂度是就是`O(m*n)`，即循环的时间复杂度等于循环体的时间复杂度乘以该循环运行次数。

##### 立方阶O(n³)、K次方阶O(n^k)

参考上面的O(n²) 去理解就好了，O(n³)相当于三层n循环，其它的类似。

##### 时间复杂度：最好、最坏、平均、均摊

我们以判断一个目标值在数组中是否存在为例来看一下如何进行最好、最坏、平均情况时间复杂度的分析。
假设目标值在数组中要么唯一存在要么不存在，代码如下：

```js
function isExist(target, list) {
  let exist = false                                 // 执行 1 次
  for (let i = 0, len = list.length; i< n; i++) {   // 执行 n 次
    if (list[i] === target) {                       // 执行 n 次
      exist = true                                  // 执行 n 次
    }
  }
  return exist                                      // 执行 1 次
}
```
对于上述代码其总执行次数`f(n)=2n+2`，即其时间复杂度用大O记法表示是`T(n)=O(2n+2)`，根据复杂度分析规则，加法常数项和最高阶项的常数项乘积都可以忽略，因此`T(n)=O(n)`。

对于上述代码，如果假定目标是唯一存在的，并且当在数组中找到目标值后，剩余元素就不用继续查找了，以此需求，对代码进行优化：
```js
function isExist(target, list) {
  let exist = false                                 // 执行 1 次
  for (let i = 0, len = list.length; i< n; i++) {   // 执行 n 次
    if (list[i] === target) {                       // 执行 n 次
      exist = true                                  // 执行 n 次
      break                                         // 找到就中断循环
    }
  }
  return exist                                      // 执行 1 次
}
```
此时，上述的时间复杂度就不适用了。因为第四行第五行不一定会执行 n 次。
- 如果目标值存在于数组中第一个位置，那么数组中剩余元素就不用考虑了，因此上述代码的时间复杂度是O(1)。对于这种最理想情况的时间复杂度我们称之为**最好情况时间复杂度**。
- 如果目标值存在于数组中最后一个位置，那么数组中的每个元素都需要和目标值进行比较，因此上述代码的时间复杂度是O(n)。对于这种最坏情况下的时间复杂度我们称之为**最坏情况时间复杂度**。

但是，不论是最好情况还是最坏情况，都是极端情况下才会发生的，因此为了更好的表示一个算法的时间复杂度，我们需要引入**平均情况时间复杂度**。

以上述代码为例，当考虑目标在数组中时，可能在数组中的任意位置，即有 n 种情况。另外在加一种目标不在数组中的情况，加起来，就是说对于判断目标值是否在数组中这个算法来说一共有n+1中情况。

我们把这`n+1`种情况下需要执行算法的每次时间复杂度加起来，在除以n+1，就可以得到一个平均情况时间复杂度，即：

| 元素可能的位置 | 循环次数 |
| :------------: | :------: |
|       1        |    1     |
|       2        |    2     |
|       3        |    3     |
|      ...       |   ...    |
|       n        |    n     |
|    不存在时    |    n     |

所以平均情况复杂度计算：

$T(n)=O(\frac{1+2+3+...+n+n}{n+1})=O(\frac{n(n+3)}{2(n+1)})=O(n)$

上述介绍的复杂度分析都是基于一个算法从头到尾运行，然后分析它的时间复杂度。但是，有时候会出现一个复杂度比较高的算法，是和其它操作是一起的，此时，在将这个较高复杂度的算法和其它操作一起进行复杂度分析时，需要将其均摊到其它操作上，这种分析称之为**均摊复杂度分析**。

```js
class MyVector {
  constructor() {
    this.data = new Array(10)
    this.size = 0 // 数组中已存储的元素格式
    this.capacity = 10 // 数组中可容纳的元素个数
  }
  push(e) {
    if (this.size === this.capacity) {
      // 如果原有数组已满，则扩容为原数组的2倍
      this.resize(this.capacity * 2)
    }
    this.data[this.size++] = e
  }
  resize(newCapacity) {
    if (newCapacity < this.size) return
    let newData = new Array(newCapacity)
    for (let i = 0; i < this.size; i++) {
      // 把原有数组中的元素一次复制到新的数组中
      newData[i] = this.data[i]
    }
    this.data = newData
    this.capacity = newCapacity
  }
}
```
上述代码中的 push 方法是每次向数组末尾添加一个元素，然后当数组满时，进行扩容，扩容为原有数组的2倍；resize 方法是用于扩容的，所谓的扩容就是新开辟一个容量大小为 newCapacity 的数组，然后将原数组的元素依次复制到新数组中。


根据之前对时间复杂度的分析方法，resize 方法的时间复杂度 `T(n)=O(n)`。
接着看下 push 方法的时间复杂度。对于 push 这个方法来说，其中有两个操作，一个是向数组末尾添加元素，每次执行添加操作时，时间复杂度是`O(1)`；一个是扩容，每次扩容的时间复杂度是`O(n)`。那么，push 方法的时间复杂度是`O(n)`吗？

扩容这一步，是在数组满的情况下才会触发执行，也就是在扩容之前，会有 n 次向数组末尾添加元素的操作，若每次操作耗时是1，总耗时为 n。扩容操作在数组满时触发 1 次，耗时是 n，所以说将数组添加满，并进行扩容总共需要 n+1 次操作，这些操作总耗时是2n。

因此，在将扩容这个操作的耗时均摊到之前每次添加元素到数组末尾这个操作上时，每次操作耗时为 $\frac{2n}{n+1}$，约等于2，是一常数，所以说将数组添加满并进行扩容操作，其时间复杂度不是O(n)，而是O(1)。这种时间复杂度分析的方法，称之为**均摊时间复杂度分析**。

#### 总结
- 没有循环语句，记作O(1)，也称为常数阶。
- 只有一重循环，则算法的基本操作的执行频度与问题规模n呈线性增大关系，记作 `O(n)`，也叫线性阶。嵌套二重循环，则算法复杂度记为 `O(n²)`

### 空间复杂度

既然时间复杂度不是用来计算算法程序具体耗时的，那么我们也应该明白，空间复杂度也不是用来计算程序实际占用的空间的。

空间复杂度是对一个算法在运行过程中临时占用内存空间大小的一个量度，同样反映的也是一个趋势。
我们用`S(n)=O(f(n))`定义，也叫算法的渐近空间复杂度，简称空间复杂度。表示随数据规模n的增大，算法占用内存空间的增长率。

常见的空间复杂度有：O(1)、O(n)、O(n²)。
时间复杂度的分析规则同样适用于空间复杂度分析：
1. 加法常数项可以忽略
2. 除去最高阶项，其它次项可以忽略
3. 与最高阶项相乘的常数可以忽略
4. 用常数1取代运行时间中的所有加法常数

#### 1.空间复杂度 O(1)

```js
function sum(n) {
  let sum = 0                    // 声明一个变量空间，存放 m
  for (let i = 0; i < n; i++) {  // 声明一个变量空间，存放 i
    sum += i                     
  }
  return sum                    
} 
```
上述代码时间复杂度是`O(n)`，但是占用内存空间存储2个变量，并且不随数据规模 n 变化而增长，所以算法空间复杂度为 `O(1)`

#### 2.空间复杂度 O(n)

```js
function sum(n) {
  let arr = new Array(n)         // 声明一个数组，数组长度 n ，即占用 n 个内存空间
  for (let i = 0; i < n; i++) {  // 声明一个变量空间，存放 i
    arr.push(i)                    
  }
  return arr                    
} 
```
上述算法程序中声明了一个数组空间，用于存储变量，它会随着数据规模 n 的变化而增长，所以算法空间复杂度为 `O(n)`。
#### 1.空间复杂度 O(n²)

同理，如果算法程序中声明一个二维数组的内存空间用于存放变量，则算法空间复杂度为 `O(n²)`。

## 算法模式（算法范式）
算法模式，也叫算法范式，是对某一类问题总结的通用算法。
- BF算法：查找所有可能性并选择最佳解决方案的问题，如最大子数列、旅行推销员问题。
- 贪心法：在当前选择最佳选项，不考虑以后情况，如背包问题。
- 分治法：将问题分成较小的部分，然后解决这些部分，如二分查找、快速排序、树深度优化搜索等。
- 动态规划：使用以前找到的子解决方案构建解决方案，如斐波那契数、最长公共子串等。
- 回溯法：类似于 BF算法 试图产生所有可能的解决方案，但每次生成解决方案，测试如果它满足所有条件，那么只有继续生成后续解决方案。 否则回溯并继续寻找不同路径的解决方案。

算法的本质是**穷举**。

但是，你千万不要觉得穷举这个事儿很简单，穷举有两个关键难点：**无遗漏**、**无冗余**。遗漏，会直接导致答案出错；冗余，会拖慢算法的运行速度。

所以，当你看到一道算法题，可以从这两个维度去思考：
1. 如何穷举？即无遗漏地穷举所有可能解。
2. 如何聪明地穷举？即避免所有冗余的计算。

不同类型的题目，难点是不同的，有的题目难在「如何穷举」，有的题目难在「如何聪明地穷举」。
- 什么算法的难点在「如何穷举」呢？一般是递归类问题，最典型的就是动态规划系列问题。
- 什么算法的难点在「如何聪明地穷举」呢？一些耳熟能详的非递归算法技巧，都可以归在这一类，如贪心算法、KMP算法等。

> 算法的本质内容参考[labuladong的算法小抄-刷题心得](https://labuladong.gitee.io/algo/1/3/)

## 参考链接
- [算法复杂度分析，这次真懂了](https://zhuanlan.zhihu.com/p/361636579)