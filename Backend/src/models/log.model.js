const {sequelize} = require('../db/db');
const {DataTypes} = require('sequelize');
const apikey = require('./apiKey.model');


const log = sequelize.define('log',{
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
    },
    apikey_id :{
        type : DataTypes.INTEGER,
        allowNull : false,
        references :{
            model : "apikeys",
            key : "id"
        },
        onDelete : "CASCADE",

    },
    ip_address :{
        type : DataTypes.STRING,
        allowNull : true,
    },
    status_code :{
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    method : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    endpoint :{
        type : DataTypes.STRING,
        allowNull : false,
    },
    rate_limit_hit : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    },
    response_time_ms :{
        type : DataTypes.INTEGER,
        allowNull: true,

    }
},
{
    freezeTableName : true,
    timestamps : true,
    indexes : [
        {
            fields : ["apikey_id"]
        },
        {
            fields : ["ip_address"]
        },
        {
            fields : ["createdAt"]
        }
    ]
}
);

module.exports = log;