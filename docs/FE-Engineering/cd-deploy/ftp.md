# FTP 上传

1. 工程代码在本地进行生产环境构建：比如 vue + webpack 的工程项目进行 `npm run build` 后，会将要部署到线上环境的文件放在 `dist` 目录
2. 使用 FTP 客户端工具，如 `FileZilla` 连接远程服务器，直接将 `dist` 目录文件上传即可。
3. 也可以将 FTP 手动上传代码操作集成到命令行操作，比如使用 `gulp + gulp-sftp-up4` 或者 `webpack + sftp-webpack-plugin`

## 使用 `gulp + gulp-sftp-up4`
```
# 安装 gulp 和 gulp-sftp-upu4
npm i -D gulp gulp-sftp-up4
```
```js
// 新建 gulpfile.js 文件
const { src } = require('gulp')
const sftp = require('gulp-sftp-up4')

const ASSET_PATH = '/dist/'
const FTP_CONFIG = {
  remotePath: '/home/hsiar/hsiar-green/html/cicd/', //部署到服务器的路径
  host: 'xx.xx.xx.xxx', // 服务器 ip 地址
  port: 22, //端口
  user: 'root', //帐号
  pass: '***********', //密码
}

function upload(callback) {
  console.log('## SFTP 正在上传构建代码到虚拟机测试服务器上......')
  return src(`.${ASSET_PATH}**`).pipe(sftp(Object.assign(FTP_CONFIG, { callback })))
}

exports.default = upload
```
```json
// 添加 run-script 命令
"script": {
  "sftp": "gulp",
  "build:sftp": "vue-cli-service build && gulp"
}
```

## 使用 `webpack + sftp-webpack-plugin`
```js
// webpack.prod.config.js
 const SftpWebpackPlugin = require('./src/utils/mysftpWebpackPlugin');
 module.exports = {
   // 其它配置
   plugins: [
     new SftpWebpackPlugin({
       port: 'your port',//服务器端口
       host: 'your host',//服务器地址
       username: 'your username',//用户名
       password: 'your password',//密码
       from: '/dist/',//你的本地路径
       to: 'you want to destination'//服务器上的路径
      })
    ]
 }
```
主要源理就是创建 webpack 插件的结构，并监听 webpack 编辑的 done 事件，然后创建ftp客户端上传代码。
```js
const client = require('scp2')
const sftpClient = require('ssh2-sftp-client')
const chalk = require('chalk')
const { validate } = require('schema-utils') // 这个包随 webpack 默认安装的，用于校验配置对象是否正确，不正确报错

const sftp = new sftpClient()
const pluginName = 'sftpWebpackPlugin'
const sftpOptionSchema = require('./sftpOptionSchema.json')

class WebpackDeploySftp {
  constructor(options) {
    this.options = options || {}
    validate(sftpOptionSchema, options, {
      name: 'sftp config options',
      baseDataPath: 'options',
    })
  }
  consoleErrorInfo(err) {
    console.error(chalk.red(`deploy failure: ${err}`))
  }

  apply(compiler) {
    compiler.hooks.done.tap(pluginName, compilation => {
      const { port, host, username, password, from, to } = this.options
      sftp.connect({ host, port, username, password})
      .then(() => sftp.rmdir(to, true))
      .then(() => {
        const remote = `${username}:${password}@${host}:${port}${to}`
        client.scp(path, remote, err => {
          if (err) {
            this.consoleErrorInfo(err)
          } else {
            console.log(chalk.green('deploy success'))
          }
          client.close()
          sftp.end()
        })
      })
      .catch(err => {
        this.consoleErrorInfo(err)
        sftp.end()
      })
    })
  }
}

module.exports = WebpackDeploySftp
```
```json
// sftpOptionSchema.json
{
  "type": "object",
  "properties": {
    "host": {
      "description": "远程服务器IP",
      "type": ["number", "string"]
    },
    "port": {
      "description": "远程服务器端口号",
      "type": ["number", "string"]
    },
    "username": {
      "description": "登录远程服务器的账号",
      "type": ["string"]
    },
    "password": {
      "description": "登录远程服务器的密码",
      "type": ["string"]
    },
    "from": {
      "description": "需要上传的本地文件目录",
      "type": ["string"]
    },
    "to": {
      "description": "上传到远程服务器的目录",
      "type": ["string"]
    }
  },
  "additionalProperties": false
}
```