let {sequelizeCon,Model,DataTypes}=require("../init/dbconfig")
class Userpermission extends Model{}
Userpermission.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        
    },
    permission_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull:false
    },
    is_deleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false,
    
    },


},{
    tableName:"userpermission",
    modelName:"userpermission",
    sequelize:sequelizeCon,
}
)
module.exports={Userpermission,}
