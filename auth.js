const jwt = require('jsonwebtoken')

const isLoggedIn = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token==null) return res.status(401).json({status:{error:true,message:'Not found input token'}})

    let verified
    try {
        verified = jwt.verify(token,process.env.TOKEN)
        req.user = verified.user
        next()
    } catch  {
        return  res.status(403).json({status:{error:true,message:'Invalid Token'}})
    }
}


const isLoggedOut= (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token!==undefined) return res.status(401).json({status:{error:true,message:`Can't access the page while logged in`}})
    next()
}

module.exports = {
    isLoggedIn,
    isLoggedOut
}