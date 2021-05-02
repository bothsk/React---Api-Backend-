const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    qty:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true
    }
})

const Item = mongoose.model('items',itemSchema)

module.exports = Item