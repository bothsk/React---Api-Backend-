const express = require('express')
const router = express.Router()

const { user_login,user_regis,user_order,user_logout,user_forget,user_reset,refresh} = require('../controllers/indexController')
const {isLoggedIn,isLoggedOut} = require('../auth')



router.get('/',(req,res)=>{
    res.send("index")
})

router.get('/refresh',refresh)

router.get('/order',isLoggedIn,user_order)

router.post('/regis',isLoggedOut,user_regis)


router.post('/login',isLoggedOut,user_login)

router.post('/forget',isLoggedOut,user_forget)

router.post('/reset/:user/:token',user_reset)

router.get('/logout',isLoggedIn,user_logout)

module.exports = router
