let {Sequelize,Model,DataTypes,Op,QueryTypes}=require("sequelize")
let sequelizeCon=new Sequelize("mysql://root@localhost/ecom")
sequelizeCon.authenticate().then().catch()

module.exports={
    sequelizeCon,
    Model,
    DataTypes,
    Op,
    QueryTypes
}