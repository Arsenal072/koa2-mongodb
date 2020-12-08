const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')
module.exports = {
    async login (ctx) {
        await ctx.render('login')
    },
    async dologin(ctx){
        let { body } = ctx.request
    }
}