module.exports = {
    // -------------------------------------------
    async login(ctx, next) {
        await ctx.render('login')
    },

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
}