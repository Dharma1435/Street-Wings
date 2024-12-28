let categorymodel=require('../model/categorymodel');
const { Category } = require('../schema/categoryschema');

async function createcategory(req,res){
    let modeldata=await categorymodel.createcat(req.body).catch((error)=>{
        return {error}
    })

if(!modeldata||(modeldata&&modeldata.error)){
    let error=(modeldata&&modeldata.error)?modeldata.error:"internal server error";
    return res.send({error})
}
return res.redirect('/category')
}
async function categoryUI(req,res){
    return res.render("category/add")
}

async function viewAll(req,res){
    let category=await categorymodel.viewAlls(req.query).catch((err)=>{
        return {error:err}
    })
    // console.log("category11",category.error);
    if(!category||(category&&category.error)){
        let error=(category&&category.error)?category.error:"internal server issue";
        return res.render('category/view',{error:category.error})
    }
    return res.render("category/view",{category:category.data,total:category.total,page:category.page,limit:category.limit})
}

async function viewDetails(req,res){    
    let category=await categorymodel.viewDetails(req.params.id).catch((error)=>{
        return {error}
    })
    if(!category||(category&&category.error)){
        return res.render('category/view',{error:category.error})
    }
    return res.render('category/details',{category:category.data})
}

async function updateUI(req,res){
    let category=await categorymodel.viewDetails(req.params.id).catch(error=>{
        return {error}
    })
    
    if(!category||(category&&category.error)){
        let url=(category&&category.data&&category.data.id)?'/category/'+category.data.id:'/category'
        return res.redirect(url)
    }
    return res.render('category/update',{category:category.data})
}

async function update(req,res){
    let category=await categorymodel.catupdate(req.params.id,req.body).catch((error)=>{return {error}})
    if(!category||(category&&category.error)){
        let url=(category&&category.data&&category.data.id)?'/category'+category.data.id:'/category'
        return res.redirect(url)
    }
    let url=(category&&category.data&&category.data.id)?'/category/'+category.data.id:'/category'
    return res.redirect(url)
    
}
async function cdelete(req,res){
    let category=await categorymodel.cdelete(req.params.id).catch(error=>{
        return {error}
    })
    if(!category||(category&&category.error)){
        let url=(req.params&&req.params.id)?'/category/'+req.params.id:'/category';
        return res.redirect(url)
    }
    return res.redirect("/category")
}

async function crestore(req,res){
    let category=await categorymodel.restore(req.params.id).catch(error=>{
        return {error};
    });
    // console.log();
    if(!category||(category&&category.error)){
        let url=(req.params&&req.params.id)?'/category/'+req.params.id:'/category';
        return res.redirect(url)
    }
    return res.redirect('/category')
}
module.exports={createcategory,categoryUI,viewAll,viewDetails,updateUI,update,cdelete,crestore}