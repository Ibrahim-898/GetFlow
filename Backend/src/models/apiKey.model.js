const {sequelize} = require('../db/db');
const {DataTypes} = require('sequelize');


const apikey = sequelize.define('apikeys',{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    userid : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references :{
            model : "users",
            key : "id"
        },
        onDelete : "CASCADE",
    },
    prefix : {
        type : DataTypes.STRING,
        allowNull : false,
        index : true,

    },
    key :{
        type : DataTypes.STRING,
        allowNull : false
    },
    
    status :{
        type : DataTypes.ENUM("active","inactive","suspended"),
        defaultValue : "active",
    },
    expire_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},
    {
        freezeTableName : true,
    }

);


module.exports = apikey;




