# Browserslist

Browserslist 叫做目标环境配置表，用于在不同的前端工具之间共享目标浏览器或Node环境。

比如 babel 使用了 @babel/preset-env 这个预设，此时 babel 就是读取 browserslist 的配置来确定哪些 ES next 语法需要转换成兼容语法。比如 browserslist 配置的目标浏览器支持箭头函数，那 babel 就不会转译代码中的箭头代码。
另外比如 Autoprefixer、postcss 等就可以根据我们的browserslist，来自动判断是否要增加 CSS 前缀（例如"-webkit-"）。

截止目前，有以下工具会自动读取项目中的 browserslist 信息：
- Autoprefix
- babel
- postcss-preset-env
- postcss-normalize
- eslint
- stylelint

> 具体工具对应的配置例子可以查看 [browserslist](https://github.com/browserslist/browserslist-example)

## browserslist 配置文件

browserslist 配置可以直接写在 package.json 文件的 `browserslist` 属性中

```json
// package.json
{
  "browserslist": ["default"] // browserslist 默认配置
  // 等效于
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "Firefox ESR",
    "not dead"
  ]
}
```
也可以在项目根目录上单独建立配置文件 `.browserslistrc`
```rc
# Browsers that we support 
> 0.5%
last 2 versions
Firefox ESR
not dead
```

## browserslist 查询路径

Browserslist 会按以下路径查找配置文件：

- 工具传入的配置选项。例如 Autoprefixer 使用时传入的 browsers 选项。
- package.json 中 browserslist 属性值，推荐这种方式。
- .browserslistrc 当前或父目录中的配置文件。
- BROWSERSLIST 环境变量。

如果上述方法没有产生有效结果，则 Browserslist 将使用默认值： `> 0.5%, last 2 versions, Firefox ESR, not dead`。

## browserslist 配置语法

> 具体配置列表 查看 [https://github.com/browserslist/browserslistv](https://github.com/browserslist/browserslist#full-list)

Browserslist 的数据都是来自 [Can I Use](https://caniuse.com/) 网站的查询结果。

查询语句中可以使用关键字： `or（并集） / and（交集） / not（排除）`

```
defaults：                                             Browserslist 的默认值（> 0.5%, last 2 versions, Firefox ESR, not dead）。

> 5%：                                                 通过全局使用情况统计信息选择的浏览器版本，即市场份额大于 5% 的浏览器。 >=，< 和 <= 也可以使用。
  > 5% in US：                                         使用美国使用情况统计信息。它接受两个字母的国家/地区代码。
  > 5% in alt-AS：                                     使用亚洲地区使用情况统计信息。有关所有区域代码的列表，请参见caniuse-lite/data/regions。
  > 5% in my stats：                                   使用自定义用法数据。
  > 5% in browserslist-config-mycompany stats：        使用来自的自定义使用情况数据 browserslist-config-mycompany/browserslist-stats.json。
  cover 99.5%：                                        提供覆盖率的最受欢迎的浏览器。
  cover 99.5% in US：                                  与上述相同，但国家/地区代码由两个字母组成。
  cover 99.5% in my stats：                            使用自定义用法数据。

dead：                                                 24个月内没有官方支持或更新的浏览器。现在是 IE 10，IE_Mob 11，BlackBerry 10，BlackBerry 7， Samsung 4和OperaMobile 12.1。

last 2 versions：                                      每个浏览器的最后2个版本。
  last 2 Chrome versions：                             最近2个版本的Chrome浏览器。
  last 2 major versions and last 2 iOS major versions：最近2个主要版本的所有次要/补丁版本。

node 10 and node 10.4：                                选择最新的Node.js 10.4.x版本。
  current node：                                       Browserslist 现在使用的Node.js版本。
  maintained node versions：                           所有 Node.js版本，仍由 Node.js Foundation 维护。

iOS 7：                                                直接使用iOS 浏览器版本7。
  Firefox > 20：                                       Firefox的版本高于20 >=，<并且<=也可以使用。它也可以与Node.js一起使用。
  ie 6-8：                                             选择一个包含范围的版本。
  Firefox ESR：                                        最新的[Firefox ESR]版本。
  PhantomJS 2.1 or PhantomJS 1.9：                     选择类似于PhantomJS运行时的Safari版本。

since 2015 or last 2 years：                           自2015年以来发布的所有版本（since 2015-03以及since 2015-03-10）或者最近 2 年发布的所有版本。
unreleased versions or unreleased Chrome versions：    Alpha和Beta版本。
not ie <= 8：                                          排除先前查询选择的浏览器。
extends browserslist-config-mycompany：                从browserslist-config-mycompanynpm包中查询 。
supports es6-module：                                  支持特定功能的浏览器。 es6-module这是 “can i use” 页面 feat 的 URL上的参数。有关所有可用功能的列表，请参见 caniuse-lite/data/features
browserslist config：                                  在Browserslist配置中定义的浏览器。在差异服务中很有用，可用于修改用户的配置，例如 browserslist config and supports es6-module。
```

写好的查询语句可以直接在终端上运行查看结果：如 `npx browserslist '> 0.5%, not IE 11'`，返回符合条件的浏览器数组

```js
// npx browserslist '> 0.5%, not IE 11'
and_chr 76  
and_ff 68   
and_qq 1.2  
and_uc 12.12
android 76  
baidu 7.12
chrome 77
chrome 76
chrome 75
chrome 74
edge 18
edge 17
firefox 69
firefox 68
firefox 60
ie 11
ie_mob 11
ios_saf 13
ios_saf 12.2-12.3
ios_saf 12.0-12.1
kaios 2.5
op_mini all
op_mob 46
opera 62
opera 60
safari 13
safari 12.1
samsung 9.2
samsung 8.2
```

看一段 `@babel/preset-env`，对目标浏览器的处理代码：

```json
// .babelrc.json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "58",
          "ie": "11",
          "browsers": ["last 2 versions", "safari 7"],
          "node": "current"
        },
      }
    ]
  ]
}
```
```js
// babel-preset-env/src/index.js
import getTargets from "./targets-parser";
const targets = getTargets(validatedOptions.targets); // validatedOptions.targets 就是上述配置对象中的 targets

// babel-preset-env/src/targets-parser.js
import browserslist from "browserslist";
import semver from "semver";

const browserNameMap = {
  android: "android",
  chrome: "chrome",
  and_chr: "chrome",
  edge: "edge",
  firefox: "firefox",
  ie: "ie",
  ios_saf: "ios",
  safari: "safari",
};

// Convert version to a semver value.
// 2.5 -> 2.5.0; 1 -> 1.0.0;
const semverify = (version) => {
  if (typeof version === "string" && semver.valid(version)) {
    return version;
  }

  const split = version.toString().split(".");

  while (split.length < 3) {
    split.push(0);
  }

  return split.join(".");
};

// 校验配置参数 "browsers": ["last 2 versions", "safari 7"],
const isBrowsersQueryValid = (browsers) =>
  typeof browsers === "string" || Array.isArray(browsers);

// broswers 中同一浏览器版本取最小值
const semverMin = (first, second) => {
  return first && semver.lt(first, second) ? first : second;
};

/**
  browsers = [
    "and_chr 76",
    "android 76", 
    "baidu 7.12",
    "chrome 74",
    "ios_saf 12.2-12.3",
  ]
*/
const getLowestVersions = (browsers) => {
  return browsers.reduce(
    (all, browser) => {
      const [browserName, browserVersion] = browser.split(" ");
      const normalizedBrowserName = browserNameMap[browserName];

      if (!normalizedBrowserName) {
        return all;
      }

      try {
        // Browser version can return as "10.0-10.2"
        const splitVersion = browserVersion.split("-")[0];
        const parsedBrowserVersion = semverify(splitVersion);

        all[normalizedBrowserName] = semverMin(
          all[normalizedBrowserName],
          parsedBrowserVersion,
        );
      } catch (e) {}

      return all;
    },
    {},
  );
};

const outputDecimalWarning = (decimalTargets) => {
  if (!decimalTargets || !decimalTargets.length) {
    return;
  }

  console.log("Warning, the following targets are using a decimal version:");
  console.log("");
  decimalTargets.forEach(({ target, value }) =>
    console.log(`  ${target}: ${value}`));
  console.log("");
  console.log(
    "We recommend using a string for minor/patch versions to avoid numbers like 6.10",
  );
  console.log("getting parsed as 6.1, which can lead to unexpected behavior.");
  console.log("");
};

const targetParserMap = {
  __default: (target, value) => [target, semverify(value)],

  // Parse `node: true` and `node: "current"` to version
  node: (target, value) => {
    const parsed = value === true || value === "current"
      ? process.versions.node
      : semverify(value);

    return [target, parsed];
  },

  // Only valid value for Uglify is `true`
  uglify: (target, value) => [target, value === true],
};

const getTargets = (targets = {}) => {
  let targetOpts = {};

  // Parse browsers target via browserslist
  // 解析 targets.borwsers 属性
  if (isBrowsersQueryValid(targets.browsers)) {
    targetOpts = getLowestVersions(browserslist(targets.browsers));
  }

  // Parse remaining targets
  // 解析剩余的 targets 属性
  const parsed = Object.keys(targets).reduce(
    (results, target) => {
      if (target !== "browsers") {
        const value = targets[target];

        // Warn when specifying minor/patch as a decimal
        if (typeof value === "number" && value % 1 !== 0) {
          results.decimalWarnings.push({ target, value });
        }

        // Check if we have a target parser?
        const parser = targetParserMap[target] || targetParserMap.__default;
        const [parsedTarget, parsedValue] = parser(target, value);

        if (parsedValue) {
          results.targets[parsedTarget] = parsedValue;
        }
      }

      return results;
    },
    {
      targets: targetOpts,
      decimalWarnings: [],
    },
  );

  outputDecimalWarning(parsed.decimalWarnings);

  return parsed.targets;
};

export default getTargets;
```

`@babel/preset-env` 插件仓库内维护了一份各种不同浏览器 API，对应浏览器版本的 json 数据，当解析出目标浏览器后就可以匹配出需要处理兼容 API ，然后加载对应 API 的插件。

```json
// plugins.json
{
  "check-es2015-constants": {
    "chrome": "49",
    "edge": "14",
    "firefox": "51",
    "safari": "10",
    "node": "6",
    "ios": "10",
    "opera": "36",
    "electron": "1"
  },
  "transform-es2015-arrow-functions": {
    "chrome": "47",
    "edge": "13",
    "firefox": "45",
    "safari": "10",
    "node": "6",
    "ios": "10",
    "opera": "34",
    "electron": "0.36"
  },
  // 省略更多....
```