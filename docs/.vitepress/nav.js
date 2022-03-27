module.exports = [
  {
    text: '设计',
    link: '/Design/',
  },
  {
    text: '前端语言',
    items: [
      { text: 'HTML', link: '/FE-Language/HTML/' },
      { text: 'CSS', link: '/FE-Language/CSS/' },
      { text: 'ES', link: '/FE-Language/ES/' },
      { text: 'TS', link: '/FE-Language/TS/' },
    ],
  },
  {
    text: '前端框架',
    items: [
      {
        text: 'UI组件库',
        items: [{ text: 'Element-UI', link: '/FE-Framework/Element-UI/' }],
      },
      {
        text: 'Web端',
        items: [
          { text: 'Vue技术栈', link: '/FE-Framework/Vue/' },
          {
            text: 'Vue技术栈源码',
            link: '/FE-Framework/vue-technology-source-code',
          },
          { text: 'React技术栈', link: '/FE-Framework/React/' },
        ],
      },
      // {
      //   text: 'Mobile移动端',
      //   items: [
      //     { text: 'H5', link: '/FE-Framework/H5/' },
      //     { text: '小程序', link: '/FE-Framework/mini-app/' },
      //   ],
      // },
      // {
      //   text: 'Desktop桌面端',
      //   items: [
      //     { text: 'PWA', link: '/FE-Framework/PWA/' },
      //     { text: 'Electron', link: '/FE-Framework/Electron/' },
      //   ],
      // },
      // {
      //   text: 'Multi跨端',
      //   items: [{ text: 'Flutter', link: '/FE-Framework/flutter/' }],
      // },
    ],
  },
  {
    text: '前端工程化',
    items: [
      { text: '概念理解', link: '/FE-Engineering/intro-fe-engineering' },
      {
        text: '初始化',
        items: [
          {
            text: '配置环境',
            link: '/FE-Engineering/initial/dev-env',
          },
          { text: '脚手架CLI', link: '/FE-Engineering/initial/cli' },
          {
            text: '工程目录',
            link: '/FE-Engineering/initial/project-directory',
          },
          {
            text: 'package.json',
            link: '/FE-Engineering/initial/package-json',
          },
          {
            text: 'browserslist',
            link: '/FE-Engineering/initial/browserslist',
          },
        ],
      },
      {
        text: '开发DEV',
        items: [
          { text: '本地服务', link: '/FE-Engineering/dev-server' },
          { text: '开发规范', link: '/FE-Engineering/dev-linter/' },
          { text: 'mock环境', link: '/FE-Engineering/dev-mock/' },
          { text: '测试', link: '/FE-Engineering/dev-test/' },
          { text: '调试', link: '/FE-Engineering/dev-debug' },
        ],
      },
      {
        text: '构建CI',
        items: [
          { text: 'Babel', link: '/FE-Engineering/ci-babel/' },
          { text: 'Postcss', link: '/FE-Engineering/ci-postcss/' },
          { text: 'Webapck', link: '/FE-Engineering/ci-webpack/' },
          { text: 'rollup', link: '/FE-Engineering/ci-rollup' },
          { text: 'vite', link: '/FE-Engineering/ci-vite/' },
          { text: 'gulp', link: '/FE-Engineering/ci-gulp/' },
          { text: 'run-script', link: '/FE-Engineering/ci-run-script/' },
        ],
      },
      {
        text: '部署CD',
        items: [
          { text: '自动化部署', link: '/FE-Engineering/cd-deploy/' },
          { text: '发布策略', link: '/FE-Engineering/cd-release/' },
        ],
      },
      {
        text: '运维OP',
        items: [
          { text: '数据监控', link: '/FE-Engineering/op-monitor/' },
          { text: '性能优化', link: '/FE-Engineering/op-performance/' },
        ],
      },
    ],
  },
  {
    text: '前端技术方向',
    items: [
      { text: '响应式网页设计', link: '/FE-Technology/responsive-web-design' },
      { text: 'BFF', link: '/FE-Technology/backend-for-frontend' },
      // { text: 'Serverless', link: '/FE-Technology/serverless' },
      {
        text: '微前端',
        items: [
          {
            text: '微前端概念',
            link: '/FE-Technology/micro-frontend/intro-micro-fe',
          },
          { text: 'qiankun', link: '/FE-Technology/micro-frontend/qiankun' },
          {
            text: 'monorepo工程',
            link: '/FE-Technology/micro-frontend/monorepo',
          },
          { text: 'lerna', link: '/FE-Technology/micro-frontend/lerna' },
        ],
      },
      {
        text: '可视化',
        items: [
          { text: 'SVG', link: '/FE-Technology/visualize/svg/' },
          { text: 'Canvas', link: '/FE-Technology/visualize/canvas/' },
          { text: 'WebGl', link: '/FE-Technology/visualize/webgl/' },
        ],
      },
    ],
  },
  {
    text: '浏览器',
    items: [
      { text: 'BOM', link: '/Browser/1-BOM/' },
      { text: 'DOM', link: '/Browser/2-DOM/' },
      { text: 'CSSOM', link: '/Browser/3-CSSOM/' },
      { text: '渲染', link: '/Browser/4-render/' },
      { text: '缓存', link: '/Browser/5-cache/' },
      { text: '本地存储', link: '/Browser/6-storage/' },
      { text: '安全', link: '/Browser/7-security/' },
      { text: '新API', link: '/Browser/8-new-api/' },
    ],
  },
  {
    text: '网络',
    items: [
      {
        text: '网络协议',
        items: [
          { text: 'HTTP', link: '/Network/protocol/index' },
          { text: 'TCP/UDP', link: '/Network/protocol/tcp-udp' },
          { text: 'DNS', link: '/Network/protocol/dns' },
        ],
      },
      {
        text: '网络通信',
        items: [
          { text: 'XMLHttpRequest', link: '/Network/XMLHttpRequest' },
          { text: 'Axios', link: '/Network/axios/' },
          { text: 'Fetch', link: '/Network/fetch/' },
          { text: 'EventSource', link: '/Network/EventSource' },
          { text: 'WebSocket', link: '/Network/websocket' },
        ],
      },
      {
        text: '接口规范',
        items: [
          { text: 'RESTful', link: '/Network/restful/' },
          { text: 'GraphQL', link: '/Network/graphql/' },
        ],
      },
    ],
  },
  {
    text: '服务端',
    items: [
      { text: 'Node', link: '/Server/node/' },
      { text: 'Connect', link: '/Server/connect/' },
      { text: 'Express', link: '/Server/express/' },
      { text: 'Koa', link: '/Server/koa/' },
      { text: 'Nest', link: '/Server/nest/' },
      { text: 'Bash', link: '/Server/bash/' },
      { text: 'Nginx', link: '/Server/nginx/' },
    ],
  },
  {
    text: '数据库',
    items: [
      { text: 'MySQL', link: '/Database/mysql/' },
      { text: 'MongoDB', link: '/Database/mongodb/' },
      { text: 'Redis', link: '/Database/redis/' },
    ],
  },
  {
    text: '软件知识',
    items: [
      { text: '数据结构', link: '/Software/data-structure/' },
      { text: '算法', link: '/Software/algorithm/' },
      { text: '设计模式', link: '/Software/design-pattern/' },
      // { text: '架构模式', link: '/Software/architectural-pattern/' },
      // { text: '编程范式', link: '/Software/programming-paradigm/' },
    ],
  },
  // {
  //   text: '面试',
  //   items: [
  //     { text: 'HTML', link: '/Interview/html/' },
  //     { text: 'CSS', link: '/Interview/css/' },
  //     { text: 'JS', link: '/Interview/js' },
  //     { text: '浏览器', link: '/Interview/browser/' },
  //     { text: '网络', link: '/Interview/network/' },
  //     { text: 'vue全家桶', link: '/Interview/vue/' }, // vue vue-router vuex vue-ssr vue-cli vue-loader vite
  //     { text: 'webpack', link: '/Interview/webpack/' }, // webpack webpack-dev-server hmr
  //     { text: 'babel', link: '/Interview/babel/' },
  //     { text: '项目经验', link: '/Interview/project/' },
  //     { text: '手写代码', link: '/Interview/show-code/' },
  //     { text: '常用算法', link: '/Interview/algorithm/' },
  //     { text: '设计模式', link: '/Interview/design-pattern/' },
  //   ],
  // },
  {
    text: '工具',
    items: [
      { text: 'Git', link: '/Tools/git/' },
      { text: 'Vscode', link: '/Tools/vscode/' },
      { text: 'Vim', link: '/Tools/vim/' },
      { text: 'Window Terminal', link: '/Tools/window-terminal' },
      { text: 'Powershell', link: '/Tools/powershell' },
      { text: 'node-tree-cli', link: '/Tools/node-tree-cli' },
    ],
  },
  { text: '已阅书籍', link: '/Books/' },
]
