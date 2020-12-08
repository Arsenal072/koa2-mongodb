const router = require('koa-router')()
const controller = require('../controller/index')

router.get('/', controller.curd.index)
router.get('/list', controller.curd.list)
router.get('/add', controller.curd.add)
router.post('/doAdd', controller.curd.doAdd)
router.post('/doEdit', controller.curd.doEdit)
router.get('/edit', controller.curd.edit)
router.get('/delete', controller.curd.delete)

// 登录注册
router.get('/login', controller.login.login)
router.post('/dologin', controller.login.dologin)

module.exports = router