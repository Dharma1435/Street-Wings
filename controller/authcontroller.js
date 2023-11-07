
let regcontrol = require('../model/authmodel')
let logcontrol = require('../model/authmodel')


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


    module.exports = { register,login ,index,}