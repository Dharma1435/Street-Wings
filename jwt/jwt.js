const { date } = require('joi')
let jwt=require('jsonwebtoken')
let text={id:1}
let key="12j121l21p139!"

jwt.sign(text,key,(err,token)=>{
    if(err){
        return console.log(err)
    }
    jwt.verify(token,key,(error,decrypt)=>{
        if(error){
            return console.log("error",error)
        }
        return console.log("verify",decrypt)
    })
 
})