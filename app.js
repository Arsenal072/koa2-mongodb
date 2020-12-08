const Koa = require('koa')
const render = require('koa-art-template');
const path = require('path')
const static = require('koa-static');
const bodyParser = require('koa-bodyparser')
let index = require('./routes/index')

const app = new Koa()


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

app.use(index.routes())
app.use(index.allowedMethods())


app.listen('3000', () => {
    console.log('server is runing!')
})