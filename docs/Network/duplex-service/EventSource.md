# EventSource

[阮一峰：Server-Sent Events 教程](http://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)

```js
// server.js
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.url.includes('stream')) {
    console.log('url', req.url);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": '*',
    })

    const timer = setInterval(() => {
      const packet = `id:${new Date().getTime()}\ndata:time is ${new Date()}\n\n`
      res.write(packet)
    }, 1000)

    req.connection.addListener('close', () => {
      clearInterval(timer)
      console.log('connect close!');
    }, false)
  }
})

server.listen(8844, () => {
  console.log('server is running in port 8844');
})
```

```html
<!-- 浏览器端代码 -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>server send events</title>
</head>

<body>
  <h1>Server Send Events</h1>
  <h3>浏览端 Web API: EventSource </h3>
  <p>接收的消息：</p>
  <ul id="msg"></ul>
</body>
<script>
  const serverURL = 'http://127.0.0.1:8844/stream'
  const el_ul = document.getElementById('msg')

  function insertMessage(msg) {
    if (Array.isArray(msg)) {
      const str = ''
      for (const i of msg) {
        str += `<li>${msg}</li>`
      }
      el_ul.innerHTML += str
    } else if (typeof msg === 'string') {
      el_ul.innerHTML += `<li>${msg}</li>`
    } else {
      throw new Error('string or Array string')
    }
  }

  if ('EventSource' in window) {
    const source = new EventSource(serverURL)

    // open 建立连接
    source.addEventListener('open', e => {
      console.log('open: ', e);
      insertMessage('Connection open ...')
    }, false)

    // message 监听消息发送
    source.addEventListener('message', e => {
      console.log('message: ', e);
      insertMessage(e.data)
    }, false)

    // error 连接出错
    source.addEventListener('error', e => {
      console.log('error: ', e);
      insertMessage('Connection error')
    }, false)


    // 10s 后连接关闭
    setTimeout(() => {
      source.close()
      insertMessage('Connection close')
    }, 10000)
  } else {
    insertMessage('浏览器不支持 EventSource API')
  }
</script>
</html>
```