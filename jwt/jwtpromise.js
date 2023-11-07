const { text } = require('express')
let jwt=require('jsonwebtoken')

function encrypt(text,key){
    return new Promise((resolve,reject)=>{
        jwt.sign(text,key,(error,data)=>{
        if(error){
            return reject(error)
        }
        return resolve(data)
            
        })

        
    })
}



  function decrypt(text,key){
        return new Promise((res,rej)=>{
            jwt.verify(text,key,(error,token)=>{
                if(error){
                    return rej(error)
                }
                return res(token)
            })
        })
    }

    let ptext={id :1}
let key2="1i2j1k21!"

encrypt(ptext,key2).then((data)=>{
    return console.log("data",data)
}).catch((error)=>{
    console.log("err1",error)
})
decrypt(token,key2).then((token)=>{
    console.log("d2",token)
}).catch((error)=>{
    console.log("err2",error)
})
    


        


 