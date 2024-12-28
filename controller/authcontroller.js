
const { request } = require('express')
let regcontrol = require('../model/authmodel')
let logcontrol = require('../model/authmodel')
let forgotcontrol=require('../model/authmodel')


async function register(req, res) {
    let regdata = await regcontrol.register(req.body).catch((err) => {
        return { error: err }
    })
    console.log('regdata', regdata);
    if (!regdata || (regdata && regdata.error)) {
        let error = (regdata && regdata.error) ? regdata : "interval server error"
       
        return res.send({error})
    }
    return res.redirect("/?msg=success")


}
async function login(req, res) {
    let logdata = await logcontrol.userlogin(req.body).catch(err => {
        return { error: err }
    })
//   console.log("i",logdata)
    if (!logdata.data || (logdata && logdata.error)) {
        let error = (logdata && logdata.error) ? logdata.error : "internal server error login";
        return res.redirect('/login?msg=unauthorised1')
        
     }
    req.session.token=logdata.token
    return res.redirect('/dashboard')
    // return res.send({ data: logdata.token })

}


   function index(req,res){
    return res.render('reglog',{})
 }

 async function forgetpasswordUI(req,res){
    return res.render('forgetpassword',{})
 }

 async function forgetpassword(req,res){
    let forgetdata=await forgotcontrol.forgotpass(req.body).catch(error=>{
        return {error}
    })
    console.log(forgetdata);
    if(!forgetdata||(forgetdata&&forgetdata.error)){
        let error=(forgetdata&&forgetdata.error)?forgetdata :"internal server error"
        return res.send({error})
    }
    return res.render("resetpassword",{email:req.body.email})
 }

async function resetpassword(req,res){
    let resetp=await forgotcontrol.resetpass(req.params.email,req.body).catch(error=>{
        return {error}
    })
    console.log("62",resetp)
    if(!resetp||(resetp&&resetp.error)){
        let error=(resetp&&resetp.error)?resetp:"internal server error"
        return res.send ({error})
    }
    return res.redirect("/login")
}

function resetPUI(req,res){
    return res.render('resetpassword',{})
}


    module.exports = { register,login ,index,forgetpasswordUI,forgetpassword,resetpassword,resetPUI}