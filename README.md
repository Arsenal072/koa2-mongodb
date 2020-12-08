# koa2-mongodb
使用koa2+mongodb+mongoose技术，实现CURD、session-cookie登录鉴权

### 使用技术

后台使用：koa2

数据库：mongoDB 

操作数据库：mongoose

模板引擎：art-template

### 一、项目初始化，安装koa
查看官方文档，使用koa简单启动项目。
https://github.com/demopark/koa-docs-Zh-CN

`npm init`

`cnpm i --save koa`

### 二、配置中间件

中间件类型：

- 应用级中间件
- 路由级中间件(koa-router)
- 错误处理中间件
- 第三方中间件 (静态资源中间件koa-static、koa-art-template)

中间件使用三部曲：安装=》引入、配置=》使用

#### 配置路由中间件koa-router

##### 安装koa-router

`npm i --save koa-router `

##### 引入、配置中间件

```js
const router = require('koa-router')()

app.use(router.routes())//启动路由
app.use(router.allowedMethods())// 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头
```

##### 使用router

```js
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
```

#### 配置模板引擎第三方中间件

##### 安装art-template 和 koa-art-template

```js
npm install --save art-template
npm install --save koa-art-template
```

##### 引入配置中间件

```js
const Koa = require('koa');
const render = require('koa-art-template');
const app = new Koa();
render(app, {
  root: path.join(__dirname, 'view'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});
app.use(async function (ctx) {
  await ctx.render('user');
});
```

##### 使用(art-template语法)
官方文档: http://aui.github.io/art-template/zh-cn/docs/index.html

#### 配置静态资源中间件koa-static

##### 安装 koa-static

`npm install --save koa-static`

##### 引入、配置中间件

```js
const static = require('koa-static'); 

app.use(static(
    path.join( __dirname,  'public')
))   
```

##### 在使用html模板中使用

`<link rel="stylesheet" href="/css/index.css">`

#### 配置mongoDB，连接数据库，使用mongoose操作数据库

##### 安装mongodb

`cnpm install mongodb --save`

##### mongoose使用
官方文档：http://www.mongoosejs.net/
* 启动数据库
  `mongo`

* 显示所有数据库

  `show dbs`

* 显示当前数据库

  `db`

* 创建或切换数据库

  `use 数据库名字`

* 显示所有集合

  `show collections`

* 创建集合

  ```js
  db.createCollection(name, options)
  /*
  参数说明：
  name: 要创建的集合名称
  options: 可选参数, 指定有关内存大小及索引的选项
  */
  ```

* 查询集合数据

  ```js
  db.collection.find(query, projection)
  /*
  query ：可选，使用查询操作符指定查询条件
  projection ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）
  */
  ```

* 修改数据

  ```js
  db.student.update()
  db.student.update({"name":"xiaohong"},{$set:{"age":18}},{multi:true})
  //如果想要批量修改，则要加上{multi:true}
  ```

* 添加数据

```
db.集合名称.insert(document)
db.student.insert({name:'zhangsan',gender:1})
db.student.insert({_id:"20170101",name:'gj',gender:1})
```
* 修改数据
```
db.集合名称.update(<query> ,<update>,{multi: <boolean>})
db.student.update({name:'hr'},{name:'mnc'}) 
```

###### 安装并引入

```javascript
var mongoose = require('mongoose')
var Schema = mongoose.Schema
```

###### 连接数据库

```js
mongoose.connect('mongodb://localhost/info');
```

###### 设计文档结构(表结构)

```js
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
```

###### 将文档结构发布为模型
```
let Student = mongoose.model('Student', studentSchema)
```

#### CURD
* 新增

  ```js
  let student = new Student(ctx.request.body)
  await student.save()
  ```

* 查询
  `model.findById(id)`

* 更改
  `model.findByIdAndUpdate(id, ctx.request.body)`

* 删除
`model.findByIdAndRemove(id)`

#### 路由模块化
```
//routes/index.js
const router = require('koa-router')()
const controller = require('../controller/index')

router.get('/', controller.curd.index)
router.get('/add', controller.curd.add)
router.post('/doAdd', controller.curd.doAdd)
router.post('/doEdit', controller.curd.doEdit)
router.get('/edit', controller.curd.edit)
router.get('/delete', controller.curd.delete)

module.exports = router
```
```
//controller/index.js
const curd = require('./curd')
module.exports = {
    curd
}
//controller/curd.js
let Student = require('../model/curd')
module.exports = {
    async index(ctx, next) {
        let result = await Student.find()
        ctx.render('index', {
            students: result
        })
    },
    async add (ctx) {
        await ctx.render('add')
    }
}
```
#### session-cookie鉴权
使用koa-session
* 安装
`npm install koa-session`
* 引入并配置
```
const Koa = require('koa')
const session = require('koa-session');
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
```
```
    async dologin(ctx, next) {
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
    },

    async logout(ctx, next) {
        delete ctx.session.user
        await ctx.render('home')
    }
```













