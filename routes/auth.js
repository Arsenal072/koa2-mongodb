const router = require('koa-router')()

router.get('/login', (ctx, next)=>{
    ctx.body = 'hello login'
})
 
module.exports = router