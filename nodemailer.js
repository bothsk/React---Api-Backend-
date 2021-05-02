const nodemailer = require('nodemailer')

const send_email = async (address,user,token)=>{
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
           user: process.env.email,
           pass: process.env.emailpwd,
        }
    })
    
    let mailOptions = {
        from: process.env.email, 
        to: address, 
        subject: `Hello ${user}`, 
        text: `Did you request a password reset for your account?\r\n\r\nIf yes, click here : ${token}`, // plain text body
        
    }

    try{
        const sendEmail = await transport.sendMail(mailOptions)
        return true
    } catch (err){
        return false
    }
    
   
}
  
module.exports = {
    send_email
}