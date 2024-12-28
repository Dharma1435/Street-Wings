let productmodel=require('../model/productmodel');

async function addUI(req,res){
    return res.render('product/add')
}

async function createproduct(req,res){
    let modeldata=await productmodel.create(req.body).catch((error)=>{
        return {error}
    })
    console.log(modeldata.error);
    if(!modeldata||(modeldata&&modeldata.error)){
        let error=(modeldata&&modeldata.error)?modeldata.error:"internal server error";
        return res.send({error})

    }
    // return res.send ({data:modeldata.data})
    return res.redirect("/product")

    }
async function viewAll(req,res){
    let products=await productmodel.viewAll(req.query,req.userData.permissions).catch(err=>{
        return {error:err}
    })
    console.log("produ",products)
    if(!products||(products&&products.error)){
        let error=(products&&products.error)?products.error:"internal server issue";
        return res.render("product/view",{error:products.error})
    }
    // console.log(products.total)
    return res.render('product/view',{products:products.data,total:products.total,page:products.page,limit:products.limit,permissions:req.userData.permissions})
}
 
async function viewDetails(req,res){
    let products=await productmodel.viewDetails(req.params.id).catch(err=>{
      return {error:err}
    })
    if(!products||(products&&products.error)){
        return res.render('product/view',{error:products.error})
    }
    return res.render('product/details',{product:products.data})
}


async function updateUI(req,res){
    let products=await productmodel.viewDetails(req.params.id).catch(err=>{ 
        return {error:err}
    })
    if(!products||(products&&products.error)){
     let url= (products&&products.data&&products.data.id)?'/product/'+products.data.id:'/product'
         return res.redirect(url)     
        }
        return res.render('product/update',{product:products.data})
    

}


async function update(req,res){
    let products=await productmodel.update(req.params.id,req.body).catch(err=>{
        return {error:err}
    })
    if(!products||(products&&products.error)){
        let url=(products&& products.data&& products.data.id)?'/product/'+products.data.id:'/product'
        return res.redirect(url)
    }
    let url=(products&&products.data&&products.data.id)?'/product/'+products.data.id:'/product'
    return res.redirect(url)
}
async function pDeleted(req,res){
    let products=await productmodel.pDeleted(req.params.id).catch(err=>{
        return {error:err}
    })
    if(!products||(products&&products.error)){
        let url=(req.params&&req.params.id)?'/product/'+req.params.id:'/product';
        return res.redirect(url)
    }
    return res.redirect('/product')

}

async function prestore(req,res){
    let products=await productmodel.restore(req.params.id).catch(err=>{
        return {error:err}
    })
    if(!products||(products&&products.error)){
        let url=(req.params&&req.params.id)?'/product/'+req.params.id:'/product';
        return res.redirect(url)
    }
    return res.redirect('/product')

}



    module.exports={createproduct,addUI,viewAll,viewDetails,update,updateUI,pDeleted,prestore}