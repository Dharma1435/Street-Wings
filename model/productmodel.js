
let {Product}=require('../schema/productschema')
let joi =require('joi')

async function create(params){
    let valid =await check(params).catch((err)=>{
        return {error:err}
    })
    if(!valid||(valid&&valid.error)){
        return {error:valid.error}
    }
    let userData={
        name:params.productname,
        description:params.description,
        price:params.price
    }
    let data=await Product.create(userData).catch((err)=>{
        return {error:err}
    })
    if(!data||(data&&data.error)){
       return {error:"internal server error"}
    }
    return {data:data}
}

async function check(data){
    let schema=joi.object({
        productname:joi.string().min(2).max(20).required(),
        description:joi.string().min(1).max(50).required(),
        price:joi.number().required()

    })
    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error:err}
    })
    if(!valid||(valid&&valid.error)){
        let msg=[]
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return { error:msg}
    }
    return { data:valid} 
}

// async function viewAll(params){
//     let limit=(params.limit)?params.limit:10;
//     let page=(params.page)?params.page:1;
//     let offset=(page-1)*limit
//     let data=await Product.findAll({limit,offset}).catch(err=>{
//         return {error:err}
//     })
//     if(!data||(data&&data.error)){
//         return {error:"internal server error",status:500}
//     }
//     return {data:data}
// }

async function viewAll(params,permission){
    let limit=(params.limit)?parseInt(params.limit):10;
    let page=(params.page)?parseInt(params.page):1;
    let offset=(page-1)*limit

    let where = {}
    if(!permission.product_restore){
        where = {is_deleted:false}

    }

    let counter=await Product.count({where}).catch(err=>{
        return {error:err}
    })
    if(!counter||(counter&&counter.error)){
        return {error:"internal server error",status:500}
    }
    if(counter<=0){
        return {error:'record not found'}
    }
    let product=await Product.findAll({where,limit,offset,raw:true}).catch(err=>{
             return {error:err}
             })
             if(!product||(product&&product.error)){
                return {error:"internal server error",status:500}
            }
    return {data:product,total:counter,page,limit}
}

async function viewDetails(id){
    let data=await Product.findOne({where:{id}}).catch(err=>{
        return {error:err}
    })
    if(!data||(data&&data.error)){
        return {error:"internal server error",status:500}
    }
    return {data}

}
async function checkupdate(data){
    let schema=joi.object({
        id:joi.number().required(),
        productname:joi.string().min(3).max(20),
        description:joi.string().min(5).max(100),
        price:joi.number()
    })
    let valid=await schema.validateAsync(data).catch(err=>{
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

async function update(id,params){
    params.id=id;
    let valid=await checkupdate(params).catch(err=>{    //user data validation
        return {error:err}
    }) 
    if(!valid||(valid&&valid.error)){
        console.log(valid.error)
        return {error:valid.error}
    }
    let data =await Product.findOne({where:{id},raw:true}).catch(err=>{   //check product in db
        return {error:err}
    })
    if(!data||(data&&data.error)){
        return {error:"internal server error",status:500}
    }
    data.name=params.name;
    data.description=params.description;
    data.price=params.price;
    

    let updateproduct=await Product.update (data,{where:{id}}).catch(err=>{
        return {error:err}
    })

       
    if(!updateproduct||(updateproduct&&updateproduct.error)){
        return {error:"internal server error",status:500}
    }
    
        return {data:data}

}

async function checkDelete(data){
    let schema=joi.object({
        id:joi.number().required()
    })
    let valid=await schema.validateAsync(data).catch(err=>{
        return {error:err}
    })
    if(!valid||(valid&&valid.error)){
        let msg=[];
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
}
return{data:valid}
}

async function pDeleted(id){
    //user data validation
    let valid = await checkDelete({id}).catch(err=>{
        return {error:err}
    })
    if(!valid||(valid&&valid.error)){
        return {error:valid.error}
    }

    //check if product exist

    let data=await Product.findOne({where:{id}}).catch(error=>{
        return {error}
    })
    if(!data||(data&&data.error)){
        return {error:"internal server error" , status:500}
    }

    //check if product is already exist
    if(data.is_deleted==true){
        return {error:"Product is already deleted"}
    }

    //update product table
    let updateproduct=await Product.update({is_deleted:true},{where:{id}}).catch(error=>{
        return {error}

})
if(!updateproduct||(updateproduct&&updateproduct.error)){
    return {error:"internal server error",status:500}
}
if(updateproduct<=0){
    return {error:"recod not deleted"}
}
return {data:"record succesfuly deleted"}
}

async function restore(id){
    //user data validation
    
    let valid = await Product.findOne({where:{id:id}}).catch(err=>{
        return {error:err}
    })
   
    if(!valid||(valid&&valid.error)){
        console.log(valid.error)
        return {error:valid.error}
    }

    //check if product exist


    let data=await Product.findOne({where:{id:id}}).catch(error=>{
        return {error}
    })
    if(!data||(data&&data.error)){
        return {error:"internal server error" , status:500}
    }
    
    
    //check if product is already exist
    if(data.is_deleted==false){
        return {error:"Product is already deleted"}
    }
    
    //update product table
    let updateproduct=await Product.update({is_deleted:false},{where:{id}}).catch(error=>{
        return {error}
    })
    
    
  
    if(!updateproduct||(updateproduct&&updateproduct.error)){
        return {error:"internal server error",status:500}
    }
  
    if(updateproduct<=0){
        return {error:"record not deleted"}
    }
    return {data:"record succesfuly restore"}
}




module.exports={create,viewAll,update,viewDetails,pDeleted,restore}