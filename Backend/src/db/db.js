require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    username: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
})

async function connectDB(){
    try{
    await sequelize.authenticate();
    console.log("Database Connect Successfully");
    } catch(err){
        console.error("Database Connection Failed",err);

    }


}


module.exports = {sequelize,connectDB};