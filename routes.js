let express=require('express')
let routes=express.Router();
let user=require('./controller/usercontroller')
let product=require('./controller/productcontroller')
let auth=require('./controller/authcontroller')
let authMid=require('./middleware/authmiddleware')
let dashboard=require('./controller/dashboard')

// user  auth  routes
routes.get('/',auth.index)
routes.get('/login',auth.index)
routes.post('/register',auth.register)
routes.post('/login',auth.login)

routes.get('/dashboard',authMid.auth('user'),dashboard.index)

//product routes
routes.get('/product/create',authMid.auth('product_create'),product.addUI)
routes.post('/product/create',authMid.auth('product_create'),product.createproduct)
routes.get('/product',authMid.auth('product_view'),product.viewAll)
routes.get('/product/:id',authMid.auth('product_view'),product.viewDetails)
routes.get('/product/update/:id',authMid.auth('product_update'),product.updateUI)
routes.post('/product/:id',authMid.auth('product_update'),product.update)
routes.post('/product/delete/:id',authMid.auth('product_delete'),product.pDeleted)
routes.post('/product/restore/:id',authMid.auth('product_restore'),product.prestore)
module.exports={routes}