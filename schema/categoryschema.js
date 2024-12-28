let {sequelizeCon,DataTypes,Model}=require('../init/dbconfig')
class Category extends Model{}
Category.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,

        },
        img:{
            type:DataTypes.STRING,
            allowNull:true
        },
        is_active:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
            allowNull:false,

        },
        is_deleted:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull:false

        },
        created_by:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        updated_by:{
            type:DataTypes.INTEGER,
            allowNull:false
        },


    },
    {
        tableName:"category",
        modelName:"Category",
        sequelize:sequelizeCon,
    }
)
module.exports={Category,}