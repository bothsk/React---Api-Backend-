const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // item:{type:String, required:true},
    //qty:{type:Number,required:true},
    items:{type:Array,required:true},
    orderedBy:{type:String,required:true},
    orderedDate:{type:Date, required:false,default:Date.now()
    },
    __v: { type: Number, select: false}
})

const Order = mongoose.model('orders',orderSchema)

module.exports = Order