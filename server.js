const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  // Send js from root to sw's scope
  server.get('/sw.js', (req, res) => {
    // read each for debug
    const swFile = fs.readFileSync('static/sw.js').toString()
    res.contentType('text/javascript')
    return res.send(swFile)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
