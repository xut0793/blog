# 前端状态量使用枚举的思考

[[toc]]

文章摘自以下[链接](https://www.ruphi.cn/archives/348/)，推荐访问原文。

## 前端常见的状态量描述

我们在日常业务开发中，经常遇到枚举，如商品状态、页面状态、审核状态等，翻阅  以往的一些业务代码，会发现很多地方都是这么写的：

```js
<span v-if="status == 0">审核中</span>
<span v-else-if="status == 1">审核通过</span>
```

以上代码其实存在以下问题：

-   魔数化：一旦有个数值改动，就得全局替换匹配
-   差语义化：无法直观通过值推导出含义

于是，进阶做法我们想的是通过引入常量定义，如：

```js
const STATUS = {
    'AUDITING': 0,
    'PASS':1
}

<span v-if="status == STATUS.AUDITING">审核中</span>
<span v-else-if="status == STATUS.PASS">审核通过</span>
```

但是问题是，我们需要后面状态对应的描述，如“审核中”，“审核通过”也有状态对应。

于是在 VUE 中又会进一步使用过滤器：

```js
const STATUS = {
    'AUDITING': 0,
    'PASS':1
}

const STATUSTODESC = {
    '0': '审核中'
    '1': '审核通过',
}

filters: {
    filterStatusDesc: status => {
        return STATUSTODESC[status] || ''
    }
}

<span v-if="status == STATUS.AUDITING">{{status | filterStatusDesc }}</span>
<span v-else-if="status == STATUS.PASS">{{status | filterStatusDesc }}</span>
```

这样子虽然也挺方便，但是仍然不够完美：

-   定义隔离：枚举值和枚举含义分离，还是会带来一定维护上的问题

## 如何改善

我们期望的应该是定义能够一体化，而不是分散化。参考 Java 里的枚举做法，其实好很多：

```java
public enum AgingTypeEnum {
    ALL(0, "全部"),
    SPECIAL(1, "特批时效"),
    PLATFORM(2, "平台定义");
    // ...
}
```

但是，虽然 TS 里也实现了 enum，但其实做法还是有些不一样，还是不那么利于我们的业务场景。因为 TS 里的 enum，也不是枚举值与含义定义一体化。

```ts
// ts的枚举最多能简化STATUS常量的定义，也不能把描述也加进来
enum STATUS {
	AUDITING = 0,
	PASS = 1
}
```

对于我们的业务场景，可能下面这么做更利于我们的使用：

```js
const STATUS = createEnum({
    AUDITING: [0, '审核中'],
    PASS: [1, '审核通过']
})

<span v-if="status == STATUS.AUDITING">{{status | filterStatusDesc}}</span>
<span v-else-if="status == STATUS.PASS">{{status | filterStatusDesc}}</span>

<p>当前状态：{STATUS.getDescFromValue(syncData.status)}</p>
<p>也可用通过枚举名称获取描述：{STATUS.getDesc('AUDITING')}</p>

filters: {
    filterStatusDesc: status => {
        return STATUS.getDescFromValue(status)
    }
}
```

如此一来，具有以下好处：

-   去魔数化：后端假如改了审核中状态为 2，那么我们就只需要在开头把 0 改为 2 即可
-   语义化：通过 STATUS.AUDITING 我们就可以大概猜出含义
-   定义一体化：枚举值和枚举描述写在了一起，不分散

## 实现

TS 代码实现

```ts
/**
 * 工具函数：枚举状态定义
 * 示例：
 * const STATUS = createEnum({
 *     AUDIT_WAIT: [1, '审核中'],
 *     AUDIT_PASS: [2, '审核通过']
 * })
 * 获取枚举值：STATUS.AUDIT_WAIT
 * 获取枚举描述：STATUS.getDesc('AUDIT_WAIT')
 * 通过枚举值获取描述：STATUS.getDescFromValue(STATUS.WAIT)
 *
 * Created by hzliurufei on 2018-12-17 21:23:28
 * @Last Modified by: tom.xu
 * @Last Modified time: 2019-10-28 11:37:05
 */

interface IEnumDefinition {
	[enumName: string]: [number, string]
}

export default function createEnum(definition: IEnumDefinition): any {
	const strToValueMap = {}
	const numToDescMap = {}
	for (const enumName of Object.keys(definition)) {
		const [value, desc]: [number, string] = definition[enumName]
		strToValueMap[enumName] = value
		numToDescMap[value] = desc
	}
	return {
		...strToValueMap,
		getDesc(enumName: string): string {
			return (definition[enumName] && definition[enumName][1]) || ''
		},
		getDescFromValue(value: number): string {
			return numToDescMap[value] || ''
		}
	}
}
```

JS 版本

```js
export default function createEnum(definition) {
	const strToValueMap = {}
	const numToDescMap = {}
	for (const enumName of Object.keys(definition)) {
		const [value, desc] = definition[enumName]
		strToValueMap[enumName] = value
		numToDescMap[value] = desc
	}
	return {
		...strToValueMap,
		getDesc(enumName) {
			return (definition[enumName] && definition[enumName][1]) || ''
		},
		getDescFromValue(value) {
			return numToDescMap[value] || ''
		}
	}
}
```
