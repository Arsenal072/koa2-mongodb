const Koa = require('koa')
const render = require('koa-art-template');
const path = require('path')
const static = require('koa-static');
const bodyParser = require('koa-bodyparser')
const session = require('koa-session');

let curd = require('./routes/curd')

const app = new Koa()

app.keys = ['some secret hurr'];

const CONFIG = {
   key: 'koa:sess',   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));


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

app.use(curd.routes())
app.use(curd.allowedMethods())


app.listen('3000', () => {
    console.log('server is runing!')
})