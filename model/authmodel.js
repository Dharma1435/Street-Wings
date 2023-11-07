
let joi = require('joi')
let { User } = require('../schema/userschema')
let { Userpermission } = require('../schema/userpermission')
let bcrypt = require('../helpers/security');
let otpGenerator=require('otp-generator')


async function register(params) {
    let valid = await check(params).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }


    let finduser = await User.findOne({ where: { email_id: params.email } }).catch((error) => {
        return { error }

    })
    if (finduser || (finduser && finduser.error)) {
        return { error: "user already exist" }
    }

    let pass = await bcrypt.hash(params.password).catch((error) => {
        return { error }
    })
    if (!pass || (pass && pass.error)) {
        return { error: "internal server error" }
    }

    let userData = {
        name: params.userName,
        email_id: params.email,
        contact: params.phone,
        password: pass.data
    }
    let data = await User.create(userData).catch((err) => {
        return { error: err }
    })
    if (!data || (data && data.error)) {
        return { error: "internal server error" }
    }
    //  return {data:data}
    let userpermission = {
        user_id: data.id,
        permission_id: 1
    }
    let updata = await Userpermission.create(userpermission).catch(err => {
        return { error: err }
    })
    if (!updata || (updata && updata.error)) {
        return { error: updata.error }
    }
    return { data: data }
}
async function check(data) {
    let schema = joi.object({
        userName: joi.string().min(2).max(50).required(),
        email: joi.string().min(2).max(50).required(),
        phone: joi.string().min(5).max(15).required(),
        password: joi.string().min(2).max(50).required()
    })
    let valid = await schema.validateAsync(data).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}




async function login(data) {
    let loginschema = joi.object({
        email: joi.string().min(6).max(500).required(),
        password: joi.string().min(2).max(50).required()
    })
    let valid = await loginschema.validateAsync(data).catch(err => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}



async function userlogin(params) {
    let valid = await login(params).catch(err => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }

    let findlogin = await User.findOne({ where: { email_id: params.email } }).catch(error => {
        return { error: error }
    })
    if (!findlogin) {
        return { error: "user is not found" }

    }
    let compare = await bcrypt.compare(params.password, findlogin.password).catch(err => {
        return { error: err }
    })
   
    if (!compare || (compare && compare.error)) {
        return { error: "user password is not found" }
    }

    let token = await bcrypt.encrypt({ id: findlogin.id }, "1k2jk1km").catch(err => {
        return { error: err }
    })
    if (!token || (token && token.error)) {
        return { error: token.error }
    }
    let updatetoken = await User.update({ token: token }, { where: { id: findlogin.id } }).catch(err => {
        return { error: err }
    })
    if (!updatetoken || (updatetoken && updatetoken.error)) {
        return { error: updatetoken.error }
    }
    return { data: "login succesful", token: token }
}



async function forgotpassword(datapass){
    let findpasschema=joi.object({
        email:joi.string().min(2).max(500).required()
    })
    let valid=await findpasschema.validateAsync(datapass).catch(err=>{
        return{error:err}
    })
    if(!valid||(valid&&valid.error)){
        let msg=[]
        for(let i of valid.error.message){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data:valid}
    
}
async function forgotpass(params){
    let valid=await forgotpassword(params).catch(err=>{
        return{error:err}
    })
    if(!valid||(valid&&valid.error)){
        return {error:valid.error}
    }
    let find =await User.findOne({where :{email_id:params.id}}).catch(err=>{
        return {error:err}
    })
    if(!find||(find&&find.error)){
        return {error:"user is not found"}
    }   
    let otp =otpGenerator.generate

}



module.exports = { register, userlogin }