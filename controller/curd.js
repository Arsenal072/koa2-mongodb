
let Student = require('../model/curd')

module.exports = {
    async index (ctx) {
        await ctx.render('index')
    },
    async list(ctx, next) {
        let result = await Student.find()
        ctx.render('list', {
            students: result
        })
    },
    async add (ctx) {
        await ctx.render('add')
    },
    async doAdd (ctx) {
        console.log('ctx', ctx.request.body)
        let student = new Student(ctx.request.body)
        await student.save()
        ctx.redirect('/')
    },
    async edit (ctx, next) {
        let result = await Student.findById(ctx.query.id)
        console.log('result', result)
        await ctx.render('edit', {
            student: result
        })
    },
    async doEdit (ctx, next) {
        await Student.findByIdAndUpdate(ctx.request.body.id, ctx.request.body)
        ctx.redirect('/')
    },
    async delete (ctx, next) {
        await Student.findByIdAndRemove(ctx.query.id)
        ctx.redirect('/')
    }
}