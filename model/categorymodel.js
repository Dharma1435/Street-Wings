let {Category}=require("../schema/categoryschema")
let joi=require('joi')

async function check(data){
    let schema=joi.object({
        categoryname:joi.string().min(2).max(50).required(),
        Image:joi.string().required(),
        created_by:joi.number().required(),
        updated_by:joi.number().required()
    })
    let valid =await schema.validateAsync(data).catch(err=>{
        return {error:err}
    })
    if(!valid||(valid&&valid.error)){
        let msg=[]
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}

    }
    return {data:valid}
}

async function createcat(params){
    let valid=await check(params).catch(error=>{
        return {error}
    })
    if(!valid||(valid&&valid.error)){
        return {error:valid.error}
    }
    let userData={
        name:params.categoryname,
        img:params.Image,
        created_by:params.created_by,
        updated_by:params.updated_by
    }
    let findUser=await Category.findOne({where:{name:params.categoryname}}).catch((error)=>{
        return {error}
    })
    if(findUser||(findUser&&findUser.error)){
        console.log(findUser.error);
        return {error:"Category Name is already Exist in DB"}
    }
    
    let data= await Category.create(userData).catch(error=>{
        return {error}
    })
    if(!valid||(valid&&valid.error)){
        return {error:"Internal Issue"}
    }
    return {data:data}
}
async function viewAlls(params){
    let limit=(params.limit)?parseInt(params.limit):10;
    let page=(params.page)?parseInt(params.page):1;
    let offset=(page-1)*limit
     let counter= await Category.count().catch((error)=>{
        return {error}
     })
     if(!counter||(counter&&counter.error)){
        return {error:"internal server category error",status:500}
     }
     if(counter<=0){
        return {error:"record not found "}
     }
     let category= await Category.findAll({limit,offset,raw:true}).catch((error)=>{return{error}})
     if(!category||(category&&category.error)){
        return {error:"internal server error",status:500}
     }
     return {data:category,total:counter,page,limit}

}
async function viewDetails(id){
    let data=await Category.findOne({where:{id:id}}).catch((error)=>{return {error}})
    if(!data||(data&&data.error)){
        return {error:"internal server error",status:500}
    }
    return {data}
}

async function checkupdate(data){
    let schema=joi.object({
        id:joi.number().required(),
        name:joi.string(),
        Image:joi.string(),
        created_by:joi.number(),
        updated_by:joi.number()
        
    })
    let valid= await schema.validateAsync(data).catch(error=>{
        return{error}
    })
    if(!valid||(valid&&valid.error)){
        let msg=[]
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data:valid}
}
async function catupdate(id,params){
    params.id=id;
    let valid=await checkupdate(params).catch((error)=>{
        return {error}
    })
    if(!valid||(valid&&valid.error)){
        return {error:valid.error}
    }
    let data=await Category.findOne({where:{id},raw:true}).catch((error)=>{
        return {error}
    })
    if(!data||(data&&data.error)){
        return {error:"internal server error",status:500}
    }
    data.name=params.name;
    data.img=params.img;
    data.created_by=params.created_by,
    data.updated_by=params.updated_by
    let updatecategory=await Category.update(data,{where:{id}}).catch((error)=>{
        return {error}
    })
    if(!updatecategory||(updatecategory&&updatecategory.error)){
        return {error:"internal server error",status:500}
    }
    return {data:data}
}

async function checkDelete(data){
    let schema=joi.object({
        id:joi.number().required()
    })
    let valid=await schema.validateAsync(data).catch((error)=>{
        return {error}
    })
    if(!valid||(valid&&valid.error)){
        let msg=[]
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data:valid}
}

async function cdelete(id){
    let valid=await checkDelete({id}).catch(error=>{
        return {error}
    })
    if(!valid||(valid&&valid.error)){
        return {error:valid.error}
    }
    let data=await Category.findOne({where:{id}}).catch((error)=>{
        return {error}
    })
    if(!data||(data&&data.error)){
        return {error:"interal server error",status:500}
    }
    if(data.is_deleted==true){
        return {error:"category is already deleted"}
    }
    let updatecategory=await Category.update({is_deleted:true},{where:{id}}).catch(error=>{
        return {error}
    })
    if(!updatecategory||(updatecategory&&updatecategory.error)){
        return {error:"internal server error",status:500}
    }
    if(updatecategory<=0){
        return {error:"record is not delted"}
    }
    return {data:"record successfully deleted"}
}

async function restore(id){
    let data=await Category.findOne({where:{id}}).catch(error=>{
        return {error}
    })
    if(!data||(data&&data.error)){
        return {error:"internals server errr",status:500}
    }
    console.log(data.error);
    if(data.is_deleted==false){
        return {error:"category is alredady  deleted"}
    }
    let updatecategory= await Category.update({is_deleted:false},{where:{id}}).catch(error=>{ 
        return {error}
    })
    if(!updatecategory||(updatecategory&&updatecategory.error)){
        return {error:"internal server error",status:500}
    }
    if(updatecategory<=0){
        return {error:"record not deleted"}
    }
    return {data:"record succesfully restore"}

}

module.exports={createcat,viewAlls,viewDetails,catupdate,cdelete,restore}