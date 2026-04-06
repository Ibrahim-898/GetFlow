const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");


const OTP = sequelize.define('otp',{
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        unique : true,
        primaryKey : true,
    },
    email :{
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
    },
    otp :{
        type : DataTypes.STRING,
        allowNull : false,

    },
     expiresAt: {
     type: DataTypes.DATE,
     allowNull : false
    
  }
}, {
  timestamps: true
}
);

module.exports = OTP;