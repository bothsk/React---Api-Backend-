const Item = require('../models/item')
const Order = require('../models/order')
const { isValidObjectId } = require('mongoose')

const all_items = async (req,res) => {

    try {
        let price = req.query.price
        let allItem
        if (price=='desc'||price=='asc'){
            allItem = req.user&&req.user.isAdmin ? await Item.find().sort({price:price}) : await Item.find({qty:{$gt:0}}).sort({price:price})
        } else {
            allItem = req.user&&req.user.isAdmin ? await Item.find() : await Item.find({qty:{$gt:0}})

        }
        res.json(allItem)
    } catch (err) {
        return res.json({status:{error:true,message:`DB processing error`},detail:err.message})
    }
    
}

const search_item = async(req,res)=>{
    
        
        if (!isValidObjectId(req.params.id)) return res.json({status:{error:true,message:`Incorrect input ID type`}})

        try {
           const item = await Item.findOne({_id:req.params.id})
           if (!item) return res.json({status:{error:true,message:`Not found input item`}})
           return res.json({status:{error:null},item})
        } catch (err) {
            return res.json({status:{error:true,message:`DB processing error`},detail:err.message})
        }
        
       
    
}

const buy_item = async(req,res)=>{
  
    try {
        if (req.body.items&&Array.isArray(req.body.items)&&req.body.items.length>0){
            ///รับ array item
            let items = req.body.items 
            ///สร้าง array เก็บข้อมูลอัพเดท
           let updateDetails = []
           ///เช็คว่าทุกตัวที่กรอกมาว่ามีอยู่ใน DB
           for (item of items){
             if (!item.name||!item.qty||item.qty%1!==0) return res.json({status:{error:true,message:`Name and Quantity are required`}})  
             let checkItem = await Item.findOne({name:item.name})
             ///ถ้าในรายการสั่งซื้อมีของที่ไม่มีใน DB
             if (!checkItem) return res.json({status:{error:true,message:`Not found item:${item.name} in DB`}})  
             updateQTY = checkItem.qty - item.qty
             ///ถ้าสั่งของจำนวนมากกว่าที่มีใน DB
             if (updateQTY<0) return res.json({status:{error:true,message:`Can't proceed order, ${item.name} have only ${checkItem.qty} units left`}}) 
             ///คำนวนราคาจาก qty * price แล้วเพิ่มเข้าไปใน array items
             item.price = item.qty * checkItem.price
             ///ใส่ค่าที่ใช้อัพเดทเข้าไปใน array
             updateDetails.push({
                 name:checkItem.name,
                 qty:item.qty,
                 updateQTY:updateQTY
            })
           }
           ///Update item DB ลดจำนวนสินค้าตามที่ขายไป
           for (update of updateDetails){
                updateItem = await Item.findOneAndUpdate({name:update.name},{qty:update.updateQTY})
           }
           ///Create Order DB
          const createdOrder = await Order.create({
               items:items,
               orderedBy:req.user.username
            })

           return res.json({status:{error:null,message:`Successfully purchase!`,createdOrder}})

        } 
        return  res.json({status:{error:true,message:`Please send request with array of items!`}})

    } catch (err) {
        return res.json({status:{error:true,message:`DB processing error`},detail:err.message})
    }
    
}
 


const create_item = async(req,res)=>{
    try {
            const existedItem = await Item.findOne({name:req.body.name})
        if (existedItem) return  res.json({status:{error:true,message:`Item name has already taken`},existedItem})

        const addItem = await Item.create({
            name:req.body.name,
            qty:req.body.qty,
            price:req.body.price
        })
        return res.json({status:{error:null,message:`${addItem.name} has been added to the shop`},addItem})
    } catch (err) {
        return res.json({status:{error:true,message:`DB processing error`},detail:err.message})
    }
    
}

const edit_item = async (req,res)=>{

    if (!isValidObjectId(req.params.id)) return res.json({status:{error:true,message:`Incorrect input ID type`}})
    
    try {
        const item = await Item.findOne({_id:req.params.id})
        if (!item) res.json({status:{error:true,message:`Not found item ID:${req.params.id}`}})

        if (req.body.name||req.body.qty||req.body.price){
        if (req.body.qty%1!==0) return res.json({status:{error:true,message:`Quantity should be integer type`}})
        const update = {
            name:req.body.name ? req.body.name : item.name,
            qty:req.body.qty ? req.body.qty : item.qty,
            price:req.body.price ? req.body.price : item.price
        }
        await Item.findOneAndUpdate({_id:req.params.id},update)
        const updatedItem = await Item.findOne({_id:req.params.id})
        return res.json({status:{error:null,message:`${updatedItem.name} has been updated`},item,updatedItem})
        }
        return res.json({status:{error:true,message:`Not found any information to update`}})
    } catch (err) {
        return res.json({status:{error:true,message:`DB processing error`},detail:err.message})
    }
        

    
}

const delete_item = async(req,res)=>{
    
    if (!isValidObjectId(req.params.id)) return res.json({status:{error:true,message:`Incorrect input ID type`}})

    try {
        const deleteItem = await Item.findOneAndDelete({_id:req.params.id})
        if (!deleteItem) return res.json({status:{error:true,message:`Can't deleted not found input item`}})
        return res.json({status:{error:true,message:`Item has been deleted`},deleteItem})
    } catch (err) {
        return res.json({status:{error:true,message:`DB processing error`},detail:err.message})
    } 
}



const itemRequired = (req,res,next)=>{
    if (req.body.name&&req.body.qty&&req.body.price){
        if(req.body.qty%1!==0) return res.json({status:{error:true,message:'Quantity should be integer type'}})
        return next()
    }
    return res.json({status:{error:true,message:'missing item requirement'}})
}



module.exports = {
    all_items,
    search_item,
    buy_item,
    create_item,
    edit_item,
    delete_item,
    itemRequired
}