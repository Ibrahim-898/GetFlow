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
        type : DataTypes.STRING(8),
        allowNull : false,
        unique: true,

    },
    key :{
        type : DataTypes.STRING,
        allowNull : false
    },
    target_url :{
        type : DataTypes.STRING,
        allowNull : false,

    },
    status :{
        type : DataTypes.ENUM("active","inactive","suspended"),
        defaultValue : "active",
    },
    rate_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 1000
    },

    expire_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},
    {
        freezeTableName : true,
        timestamps : true,
        indexes :[
            {
                fields : ["prefix"],
            },
            {
                fields : ["userid"]
            }
        ]
    }
);


module.exports = apikey;




