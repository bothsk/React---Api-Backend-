const express = require('express');
const router = express.Router()
const { all_items,search_item,create_item,edit_item,delete_item,buy_item,itemRequired } = require('../controllers/itemController')
const {isLoggedIn} = require('../auth')



//all items
router.get('/',isLoggedIn,all_items)


//search by id
router.get('/:id',search_item)





//buy item
router.put('/buy',buy_item)




//create
router.post('/add',itemRequired,create_item)

 //edit
router.put('/edit/:id',edit_item)

//delete
router.delete('/del/:id',delete_item)



module.exports = router