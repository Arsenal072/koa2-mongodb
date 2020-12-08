const router = require('koa-router')()
let Student = require('../model/curd')

router.get('/', async (ctx, next) => {
    ctx.render('home')
})

router.get('/list', async (ctx, next) => {
    let result = await Student.find()
    ctx.render('index', {
        students: result
    })
})

router.get('/add', async (ctx) => {
    await ctx.render('add')
})

router.post('/doAdd', async (ctx) => {
    console.log('ctx', ctx.request.body)
    let student = new Student(ctx.request.body)
    await student.save()
    ctx.redirect('/')
})

router.get('/edit', async (ctx, next) => {
    let result = await Student.findById(ctx.query.id)
    console.log('result', result)
    await ctx.render('edit', {
        student: result
    })
})

router.post('/doEdit', async (ctx, next) => {
    await Student.findByIdAndUpdate(ctx.request.body.id, ctx.request.body)
    ctx.redirect('/')
})

router.get('/delete', async (ctx, next) => {
    await Student.findByIdAndRemove(ctx.query.id)
    ctx.redirect('/')
})


// -------------------------------------------
router.get('/login', async (ctx, next) => {
    await ctx.render('login')
})

router.post('/dologin', async (ctx, next) => {
    if (ctx.session.user) {
        //已登录
        await ctx.render('home', {
            user: ctx.request.body
        })
    } else {
        ctx.session.user = ctx.request.body
        await ctx.render('home', {
            user: ctx.request.body
        })
    }
})

router.get('/logout', async (ctx, next) => {
    delete ctx.session.user
    await ctx.render('home')
})

module.exports = router