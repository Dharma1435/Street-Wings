let mailer=require('nodemailer')
let otp=require('otp-generator')
function mail(mailoption){
    return new Promise((res,rej)=>{
        let transporter=mailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            auth:{
                user:"guptadharamraj399@gmail.com",
                pass:"mpks jtxy iyeo vosi"
            }
        })
            transporter.sendMail(mailoption,(err,info)=>{
                if(err){
                    return rej(err)
                }   
                return res(`mail is send to${mailoption.to}`)

           

        })
    })
}
// let otp=otpgenerator.generate(6,{upperCaseAlphabets:false,specialChar:false,lowerCaseAlphabets:false})
module.exports={mail}