# Jest

`Jest` 是一个由 Facebook 开发的测试运行器 (test runner) 。测试运行器就是运行测试代码的程序。

## API

### `describe / test`

`describe`,`test`代表一个执行块(作用域),可以通过`describe`块来将测试分组,如果没有`describe`,那整个文件就是一个 describe.

注意：多层嵌套的 `describe` 时执行顺序：（待补充例子）

### 钩子函数

钩子函数主要用于编写初始化代码，有两种：

1. 全局钩子，在配置文件中定义

- setupFiles
- setupFilesAfterEnv
- clearMocks
- resetMocks
- resetModules
- restoreMocks

2. 测试文件内色子，包括：

- beforeAll
- afterAll
- beforeEach
- afterEach

默认情况下,before 和 after 的块可以应用到文件中的每个测试. 此外可以通过 describe 块来将测试分组.

当 before 和 after 的块在 describe 块内部时,则其只适用于该 describe 块内的测试.

```js
beforeAll(() => console.log('外 - beforeAll')) // 1
afterAll(() => console.log('外 - afterAll')) // 12
beforeEach(() => console.log('外 - beforeEach')) // 2 6
afterEach(() => console.log('外 - afterEach')) // 4 10
test('', () => console.log('外 - test')) // 3

describe('describe inside', () => {
  beforeAll(() => console.log('内 - beforeAll')) // 5
  afterAll(() => console.log('内 - afterAll')) // 11
  beforeEach(() => console.log('内 - beforeEach')) // 7
  afterEach(() => console.log('内 - afterEach')) // 9
  test('', () => console.log('内 - test')) // 8
})
```

## Mock 函数

Jest 中的三个与 Mock 函数相关的 API,分别是`jest.fn()`,`jest.spyOn()`,`jest.mock()`

### `jest.fn()`

- `jest.fn()`是创建 Mock 函数最简单的方式,如果没有定义函数内部的实现,`jest.fn()`会返回`undefined`作为返回值
- `jest.fn()`所创建的 Mock 函数还可以设置返回值,定义内部实现或返回 Promise 对象

```js
import { ajaxMock } from '../../__mock__/ajax.mock'
describe('ajax_test', () => {
  it('ajax_是否被调用', async () => {
    const mockFun1 = jest.fn()
    mockFun1.mockReturnValueOnce(456).mockReturnValueOnce(789)
    const mockFun2 = jest.fn(() => {
      return 456
    })
    await ajaxMock(mockFun1)
    await ajaxMock(mockFun1)
    await ajaxMock(mockFun2)

    expect(mockFun1).toBeCalled() // 被执行
    expect(mockFun1.mock.calls.length).toBe(2) // 调用次数
    expect(mockFun2.mock.results[0].value).toBe(456) // 返回结果
  })
})
```

### `jest.mock()`

实际开发过程,一些请求方法可能我们在其他模块被调用的时候,并不需要进行实际的请求,可以使用`jest.mock()`去 mock 整个模块

```js
import call from '../src/call'
import ajax from '../src/ajax'

jest.mock('../src/ajax.js')

test('mock 整个 ajax.js模块', async () => {
  await call.getData()
  expect(ajax.ajaxGetData).toHaveBeenCalled()
  expect(ajax.ajaxGetData).toHaveBeenCalledTimes(1)
})
```

### `jest.spyOn()`

jest.spyOn()方法同样创建一个 mock 函数,但是该 mock 函数不仅能够捕获函数的调用情况,还可以正常的执行被 spy 的函数.实际上,jest.spyOn()是 jest.fn()的语法糖,它创建了一个和被 spy 的函数具有相同内部代码的 mock 函数.

```js
import call from '../src/call'
import ajax from '../src/ajax'

test('使用jest.spyOn()监控ajax.ajaxGetData被正常调用', async () => {
  expect.assertions(2)
  const spyFn = jest.spyOn(ajax, 'ajaxGetData')
  await call.getData()
  expect(spyFn).toHaveBeenCalled()
  expect(spyFn).toHaveBeenCalledTimes(1)
})
```

## 快照 snapshot

jest 可以对整体的 html 进行测试有没有更改,方法就是 Snapshot 测试(快照测试),目前来说是 jest 专有的测试方法,通过对比前后的快照,可以很快找出 UI 的变化之处.

- `wrapper.html()`获取整个 DOM
- `toMatchSnapshot()`第一次运行快照测试时会生成一个快照文件,之后每次执行测试的时候,会生成一个快照,然后对比最初生成的快照文件,如果没有发生改变,则通过测试；否则测试不通过,同时会输出结果,对比不匹配的地方.
- 代码发生变化的时候,通过 控制台 按 u 来更新 快照
- 多处 test case 更改的时候,按 i 来交互式的 更新快照
- Jest 会为快照测试在临近测试文件的地方自动创建一个 `__snapshots__` 目录。

```js
test('component DOM snapshot', () => {
  const wrapper = shallowMount(MiniStep, {
    propsData: {
      steps: ['step1', 'step2'],
      active: 2,
    },
  })
  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
})
```

## 测试覆盖率 coverage

jest 执行完会生成一个覆盖率统计表, 所有在覆盖率统计文件夹下的文件都会被检测,覆盖率指标:

- Statements: 语句覆盖率,执行到每个语句；
- Branches: 分支覆盖率,执行到每个 if 代码块；
- Functions: 函数覆盖率,调用到程式中的每一个函数；
- Lines: 行覆盖率, 执行到程序中的每一行

```
=============================== Coverage summary ===============================
Statements   : 53.41% ( 47/88 )
Branches     : 30% ( 3/10 )
Functions    : 42.11% ( 16/38 )
Lines        : 56.63% ( 47/83 )
================================================================================
```

如果在配置文件中配置了覆盖率输出文件 `coverageReporters: ['html', 'text-summary'],` 其中 `text-summary`，对应控制台的输出，如上图。`html`则会在 `coverage` 目录下有 `index.html`文件，也可以打开注意具体各目录文件的细致覆盖率。

## 常用的断言

- toBe()----测试具体的值
- toEqual()----测试对象类型的值
- toBeCalled()----测试函数被调用
- toHaveBeenCalledTimes()----测试函数被调用的次数
- toHaveBeenCalledWith()----测试函数被调用时的参数
- toBeNull()----结果是 null
- toBeUndefined()----结果是 undefined
- toBeDefined()----结果是 defined
- toBeTruthy()----结果是 true
- toBeFalsy()----结果是 false
- toContain()----数组匹配,检查是否包含
- toMatch()----匹配字符型规则,支持正则
- toBeCloseTo()----浮点数
- toThrow()----支持字符串,浮点数,变量
- toMatchSnapshot()----jest 特有的快照测试
- .not.toBe()----前面加上.not 就是否定形式

## 配置文件jest.config.js
```js
module.exports = {
  /*****************************************************************
   * 测试环境
   ****************************************************************/
  // The test environment that will be used for testing
  // 用于测试的测试环境。Jest中的默认环境是通过 jsdom 实现的类似于浏览器的环境。如果你正在构建node服务，则可以使用 'node' 值设置类 node 环境
  testEnvironment: 'jsdom',

  // Options that will be passed to the testEnvironment
  // 传递给testEnvironment的选项
  testEnvironmentOptions: {},

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  // 此选项设置jsdom环境的URL。
  testURL: "http://localhost",

  // Adds a location field to test results
  testLocationInResults: false,

  /*****************************************************************
   * 模块路径解析
   *****************************************************************/
  // The root directory that Jest should scan for tests and modules within
  // Jest应该扫描其中的测试和模块的根目录
  // 在任何其他属性中基于路径的配置设置中使用'<rootDir>'作为字符串令牌将返回此值。
  rootDir: '/',

  // A list of paths to directories that Jest should use to search for files in
  // Jest应该用来在其中搜索文件的目录的路径列表
  // 默认情况下，根只有一个条目<rootDir>，但在某些情况下，您希望在一个项目中有多个根，例如根:["<rootDir>/src/"， "<rootDir>/tests/"]。
  roots: [
    "<rootDir>"
  ],

  // Run tests from one or more projects
  // 从一个或多个项目运行测试, 当为项目配置提供一组路径或glob模式时，Jest将同时在所有指定项目中运行测试。这对于一个人或者同时从事多个项目的时候是很好的。
  // projects: undefined,
  "projects": [
    "<rootDir>/packages/*",
    "<rootDir>/examples/*"
  ]

  // An array of directory names to be searched recursively up from the requiring module's location
  // 指定需要从所需模块的位置上递归搜索的目录名数组。
  // 设置此选项将覆盖默认值，如果你希望仍然在node_modules中搜索包，请将它和其他选项一起包含:["node_modules"， "bower_components"]
  moduleDirectories: [
    "node_modules"
  ],

  // An array of file extensions your modules use
  // 指定 jest 可匹配的文件扩展名。当引入的模块文件没有指定文件扩展名，那么Jest将从这里逐个寻找这些扩展名。类似 webpack 的 resolve.extensions 配置
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "vue"
  ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // 从正则表达式到模块名称的映射, 类似 webpack 中的 resolve.alias, 然后在测试文件中 xxx.spec.js 中可以使用 @ 去映射路径
  // moduleNameMapper: {},
  moduleNameMapper: {'^@/(.*)$': '<rootDir>/src/$1',},

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // 设置一个忽略匹配文件的正则字符串数组。
  // 这些路径对模块加载器来说是“可见的”。但如果给定模块的路径与设置值匹配，那么在测试环境中它将不能被 require()。
  modulePathIgnorePatterns: [],

  // The glob patterns Jest uses to detect test files
  // 匹配需要执行的测试文件
  // 默认情况下，它会在__tests__文件夹中查找.js和.jsx文件，以及任何后缀为.test或.spec的文件
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // 该测试路径下匹配的测试文件将被跳过
  testPathIgnorePatterns: [
    "\\\\node_modules\\\\"
  ],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // 同 testMatch 属性，不可以两个属性同时设置
  testRegex: [],

  // The directory where Jest should store its cached dependency information
  // Jest用来储存依赖信息缓存的目录。
  // Jest 尝试去扫描你的依赖树一次（前期）并且把依赖树缓存起来，其目的就是抹去某些在运行测试时需要进行的文件系统排序。
  // 这一配置选项让你可以自定义Jest将缓存数据储存在磁盘的哪个位置。
  cacheDirectory: "C:\\Users\\xutao29099\\AppData\\Local\\Temp\\jest",

  /*****************************************************************
   * 测试覆盖率相关配置项 coverage
   ****************************************************************/

  // Indicates whether the coverage information should be collected while executing the test
  // 指定是否收集测试时的覆盖率信息。
  // 由于要带上覆盖率搜集语句重新访问所有执行过的文件，这可能会让你的测试执行速度被明显减慢。
  // 所以 run-script 中可以配置两个命令：test:unit: 'jest' 和 test:coverage: 'jest --coverage'
  collectCoverage: false,

  // Indicates which provider should be used to instrument code for coverage
  // 指定应该使用哪个程序来检测代码的覆盖率
  coverageProvider: 'v8',

  // The directory where Jest should output its coverage files
  // 指定 Jest 输出覆盖信息文件的目录。以下设置会在根目录创建 coverage 目录用于存入覆盖率统计文件
  coverageDirectory: 'coverage',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // 可以用一个 glob 的通配模式 的数组来指出仅哪些文件需要云收集覆盖率信息。
  // 如果一个文件匹配上指定的模式，即使没有关于它的测试用例存在，或也没有任何测试用例依赖它，它的覆盖率信息也将被收集。
  // 该选项要求 collectCoverage 被设成true，或者通过 --coverage 参数来调用 Jest。
  // collectCoverageFrom: undefined,
  collectCoverageFrom : ["src/**/*.{js,jsx}", "!**/node_modules/**", "!**/vendor/**"]

  // An array of regexp pattern strings used to skip coverage collection
  // 使用regexp模式字符串数组，指定用于跳过覆盖率收集的目录，默认是跳过 node_modules
  // coveragePathIgnorePatterns: ["\\\\node_modules\\\\"],
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/build/", ],

  // Force coverage collection from ignored files using an array of glob patterns
  // 使用一组glob模式从被忽略的文件强制收集覆盖率
  forceCoverageMatch: [],

  // A list of reporter names that Jest uses when writing coverage reports
  // 指定覆盖率报告输出的文件类型
  coverageReporters: [
    "json",
    "text",
    "lcov",
    "clover"
  ],

  // An object that configures minimum threshold enforcement for coverage results
  // 为覆盖率设置最小阈值的配置对象，如果不满足阈值，jest 将返回失败。
  // 当指定为正数时，阈值被认为是所需的最小百分比。例如：`statements: 90` 意味着语句覆盖率最小是90%
  // 当一个阈值被指定为负数时，它表示允许的未覆盖实体的最大数量。例如：`statements: -10` 表示不允许超过10个未覆盖的语句。
  // 阈值可以指定为全局、仅路径、或全局和路径同时存在。
  // 如果globs或路径与global一起指定，匹配路径的覆盖数据将从整体覆盖中减去，阈值将独立应用。对所有匹配glob的文件应用globs的阈值。如果没有找到path指定的文件，将返回错误。
  // 如下示例全局分支 50% 的覆盖率将应用除 "./src/components/**/*.js" 和 "./src/api/very-important-module.js" 以外的所有 collectCoverageFrom 指定的被测试文件
  // coverageThreshold: undefined,
  coverageThreshold: {
    "global": {
      "branches": 50, // if 语句分支
      "functions": 50,
      "lines": 50,
      "statements": 50
    },
    "./src/components/**/*.js": {
      "branches": 40,
      "statements": 40
    },
    "./src/api/very-important-module.js": {
      "branches": 100,
      "functions": 100,
      "lines": 100,
      "statements": 100
    }
  }

  /****************************************************
   * 自定义相关处理器
   ******************************************************/
  // Allows you to use a custom runner instead of Jest's default test runner
  // 允许您使用自定义运行器，而不是Jest的默认测试运行器 jest-runner
  runner: "jest-runner",

  // This option allows use of a custom test runner
  testRunner: "jasmine2",

  // A path to a custom resolver
  // 自定义路径解析器
  resolver: undefined,

  // This option allows the use of a custom results processor
  // 此选项允许使用自定义结果处理程序
  testResultsProcessor: undefined,

  // Use this configuration option to add custom reporters to Jest
  reporters: undefined,

  // A map from regular expressions to paths to transformers
  // 设置文件预处理器，用于转换源文件为jest环境可用的文件类型或语法
  transform: undefined,

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  // 设置不需要被 transform 转换器处理的文件路径
  transformIgnorePatterns: [
    "\\\\node_modules\\\\",
    "\\.pnp\\.[^\\\\]+$"
  ],

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // 用于快照测试的快照序列化器模块的路径列表
  // snapshotSerializers: [],
  snapshotSerializers: [ 'jest-serializer-vue' ],

  // A path to a custom dependency extractor
  // 自定义依赖项提取器的路径
  dependencyExtractor: undefined,

  // A preset that is used as a base for Jest's configuration
  // 用作 Jest 配置的一个预设插件，例如 preset: '@vue/cli-plugin-unit-jest',
  preset: undefined,

  /*********************************************************
   * 全局调用设置
   *********************************************************/
  // A path to a module which exports an async function that is triggered once before all test suites
  // 指定一个模块的路径，该模块导出在所有测试套件之前触发一次的异步函数（return async fn 或 new Promise())
  globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // 指定一个模块的路径，该模块导出在所有测试套件之后触发一次的异步函数（return async fn 或 new Promise())
  globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // 设置一组可以在所有测试环境中可用的全局变量
  // 如果你在这指定了一个全局引用值（例如，对象或者数组），之后在测试运行中有些代码改变了这个被引用的值，这个改动对于其他测试不会生效。
  globals: {},
  // globals: {"__DEV__": true},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // 用于运行测试的最大工作程序数量。可以指定为百分比 % 或一个数字。
  // maxWorkers: 10% 将使用你的CPU数量的10% + 1 作为最大worker数。
  // maxWorkers: 2 将使用最多2个 worker 线路。
  maxWorkers: "50%",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // 每个测试文件都会构建一个测试上下文，并对其上下文环境进行一次处理,行下面配置文件的代码来设置每个测试环境的上下文
  // 这段代码将在setupFilesAfterEnv之前执行。
  // setupTestFrameworkScriptFile 已废弃，用 setupFilesAfterEnv 代替
  setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // 配置文件列表，这些文件运行一些代码来在每次测试之前配置或设置测试框架
  setupFilesAfterEnv: [],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  slowTestThreshold: 5,

  // All imported modules in your tests should be mocked automatically
  // 设为 true 时，测试文件中所有导入的模块都被自动模拟。但类似 fs 这样的 Node 核心模块，默认是不模拟的，如果需要可以使用 `jest.mock('fs')` 显式指定模拟
  // 开启自动模拟会有一些性消耗，在一些大型工程会更明显。
  // 建议使用默认值 false, 然后通过使用 jest.mock(moduleName) 把项目中的被测模块文件显式的指定为模拟。
  automock: false,

  // Automatically clear mock calls and instances between every test
  // 自动清除每个测试之间的模拟调用和实例
  // 等价于在每个测试之间调用jest.clearAllMocks()。这不会删除可能已经提供的任何模拟实现。
  clearMocks: true,

  // Automatically reset mock state between every test
  // 自动重置每个测试之间的模拟状态
  resetMocks: false,

  // Reset the module registry before running each individual test
  // 在运行每个单独的测试之前，重新设置模块注册表
  resetModules: false,

  // Automatically restore mock state between every test
  // 自动恢复每个测试之间的模拟状态
  restoreMocks: false,

  // Stop running tests after `n` failures
  // 默认值 0，Jest 会运行所有的测试用例，然后产出所有的错误到控制台中直至结束。
  // bail 配置选项可以让 Jest 在遇到第几个失败后就停止继续运行测试用例。
  bail: 0,

  // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
  // 将此值设置为"fake"允许对"setTimeout"等函数使用假计时器
  // 当一段代码设置了我们不希望在测试中等待的长超时时，假计时器是有用的。
  timers: "real",

  // Make calling deprecated APIs throw helpful error messages
  // 设置当调用废弃的 api 时是否抛出有用的错误消息
  errorOnDeprecated: false,

  // Activates notifications for test results
  // 激活测试结果的通知。
  notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // 指定通知模式的枚举。要求{notify: true}
  notifyMode: "failure-change",

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  // 多于一个测试文件运行时展示每个测试用例测试通过情况 Boolean
  verbose: undefined,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // 当 jest 运行在 watch 监视模式下，如果测试文件更改了，会触发重新运行测试。但该属性项匹配的路径中文件如果发生变化，不会触发重新运行测试
  watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // 是否使用cwatchman 抓取文件
  watchman: true,
}
```

## 参考链接
- [Jest 中文文档](https://doc.ebichu.cc/jest/docs/zh-Hans/configuration.html#content)