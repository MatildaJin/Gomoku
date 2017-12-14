const router = require('koa-router')()
const Controller = require('./controller/index')

module.exports = (app) => {
  router.get('/gomoku', Controller.index)

  app.use(router.routes())
        .use(router.allowedMethods())
}
