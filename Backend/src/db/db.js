require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    username: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

async function connectDB(){
    try{
    await sequelize.authenticate();
    console.log("Database Connect Successfully");
    await sequelize.sync({ alter: true }); 
    console.log("All tables synced");
    } catch(err){
        console.error("Database Connection Failed",err);

    }


}


module.exports = {sequelize,connectDB};