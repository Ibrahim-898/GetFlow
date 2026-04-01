const { where, Op } = require('sequelize');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function RegisterService({username,email,password,role}){
    const isUserAlreadyExists =  await userModel.findOne({
        where : 
            {email},
        
       });

       if(isUserAlreadyExists){
        throw new Error("User is Already Exist");
       }
       const isUsernameExist = await userModel.findOne({where : {username}});

       if(isUsernameExist){
        throw new Error("UserName is Already Taken");
       }
       const saltRounds = 10;
       const hashPassword = await  bcrypt.hash(password,saltRounds);

    const user = await userModel.create({
        username,email,password : hashPassword,role
    });   
     return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    };
}

async function LoginService(email,password) {
    const isRegisterUser = await userModel.findOne({where : {email}});
     if (!isRegisterUser) {
        throw new Error("Email or Password is Wrong.");
    }

        const hash = isRegisterUser.password;
        const isPasswordmatched = await bcrypt.compare(password,hash);
        if(!isPasswordmatched){
            throw new Error("Email or Password is Wrong.");
        }

            const Jwt_secret = process.env.JWT_SECRET;
            const token = await jwt.sign({
                id : isRegisterUser.id,
                email : isRegisterUser.email,
                role : isRegisterUser.role
            },Jwt_secret,{expiresIn : '7d'});

            return {
                user: {
            id: isRegisterUser.id,
            username: isRegisterUser.username,
            email: isRegisterUser.email,
            role: isRegisterUser.role
             },
            token
           };
            
        
    
}
async function  getProfile(userid) {

    const record =await userModel.findOne({where : {id : userid}});
    if(!record){
         throw new Error("There is no such User.")
    }
    return record;

    
}


module.exports = {RegisterService,LoginService,getProfile};