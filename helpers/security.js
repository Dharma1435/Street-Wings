let jwt=require('jsonwebtoken')
let bcrypt=require('bcrypt')


function encrypt(text,key){
    return new Promise((res,rej)=>{
        jwt.sign(text,key,(error,data)=>{
            if(error){
                return rej(error)
            }
            return res(data)
        })
    })
}

function decrypt(text,key){
    return  new Promise((resolve, reject) => {
        jwt.verify(text,key,(error,decrypt)=>{
            if(error){
                return reject(error)
            }
            return resolve({id:decrypt.id})
        })

        
    });
}

async function hash(pt,salt=10){
    let encrypt=await bcrypt.hash(pt,salt).catch((error)=>{
       return {error}
    })
    if(!encrypt||(encrypt&&encrypt.error)){
        return {error:encrypt.error}
    }
    return {data:encrypt}
}

async function compare(pt,et){
    let check=await bcrypt.compare(pt,et).catch((error)=>{
        return {error}
    })
   
    if(!check||(check&&check.error)){
        return {error: check && check.error ? check.error:true} 
    }
    return{data:true}
}




module.exports={
    encrypt,
    decrypt,
    hash,
    compare
}