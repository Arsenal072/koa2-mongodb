const Koa = require('koa')
const router = require('koa-router')()
const render = require('koa-art-template');
const path = require('path')
const static = require('koa-static');
const mongoose = require('mongoose');
const Schema = mongoose.Schema


const app = new Koa()
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
    
})

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        students: [{
            name: '张三',
            age: 14,
            gender: '男',
            motto: '哈看看书的感受到了客观来说的复合管'
        }]
    })
})

app.use(router.routes())
app.use(router.allowedMethods())


app.listen('3000', () => {
    console.log('server is runing!')
})