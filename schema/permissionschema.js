
let {sequelizeCon,Model,DataTypes}=require('../init/dbconfig')

class Permission extends Model{}
sequelizeCon.sync({alter:true})
Permission.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autpIncrement:true,
            allowNull:false,
            primaryKey:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
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
},
    {
        tableName:"permission",
        modelName:"permission",
        sequelize:sequelizeCon
    }
)

module.exports={Permission,}