/*
配置mongoDB
*/ 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
module.exports = mongoose.model('Student', studentSchema)