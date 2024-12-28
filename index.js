let express=require('express')
let config=require("config")
let port=config.get('port')
let app=express()
let session=require('express-session')
let {routes}=require('./routes')
let cors=require('cors')

function corfun(origin,cb){
    // console.log("origin:",origin)
    let whitelist={
        'abc.com':true,
        'localhost':true,
        'http://localhost:3002':true,
            
        }
        if(!origin||whitelist[origin]){
            cb(null,true)
        }else{
            cb(new Error('domain is not found'))
        }
    }
 app.use(cors({origin:corfun}))
 

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:"!2335%"
}))
app.set('view engine','ejs')

app.use(express.static(__dirname+'/public'))
app.set("view engine","ejs")
app.use(routes)

app.listen(port,()=>{
    console.log("connected",port)
})
