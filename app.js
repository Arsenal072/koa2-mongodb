const Koa = require('koa')
const router = require('koa-router')()
const render = require('koa-art-template');
const path = require('path')
const static = require('koa-static');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bodyParser = require('koa-bodyparser')
const app = new Koa()
// let router = require('./router')

app.use(bodyParser())


/**
 * 配置静态资源中间件
 * 
 */
app.use(static(
    path.join( __dirname,  'public')
)) 
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

/*
配置mongoDB
*/ 
mongoose.connect('mongodb://localhost/info');
let studentSchema = new Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    motto: {
        type: String
    }
})
let Student = mongoose.model('Student', studentSchema)


router.get('/', async (ctx, next) => {
    let result = await Student.find()
    ctx.render('index', {
        students: result
    })
})

router.get('/add', async (ctx)=>{
    await ctx.render('add')
})

router.post('/doAdd', async (ctx)=>{
    console.log('ctx', ctx.request.body)
    let student = new Student(ctx.request.body)
    await student.save()
    ctx.redirect('/')
})

router.get('/edit', async (ctx, next)=>{
    let result = await Student.findById(ctx.query.id)
    console.log('result', result)
    await ctx.render('edit', {
        student: result
    })
})

router.post('/doEdit', async (ctx, next)=>{
    await Student.findByIdAndUpdate(ctx.request.body.id, ctx.request.body)
    ctx.redirect('/')
})

router.get('/delete', async (ctx, next)=>{
    await Student.findByIdAndRemove(ctx.query.id)
    ctx.redirect('/')
})

app.use(router.routes())
app.use(router.allowedMethods())


app.listen('3000', () => {
    console.log('server is runing!')
})