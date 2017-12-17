const Koa = require('koa')
const path = require('path')
const nunjucks = require('koa-nunjucks-2')
const staticFile = require('koa-static')

const app = new Koa()
const router = require('./router')

app.use(staticFile(path.resolve(__dirname, './public')))

app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'views'),
  nunjucksConfig: {
    trimBlocks: true
  }
}))

router(app)

app.listen(80, () => {
  console.log('Hello World')
})
