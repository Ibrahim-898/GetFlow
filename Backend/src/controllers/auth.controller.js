const { where, Op } = require('sequelize');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(req,res){

   try {
    const {username,email,password,role ="user"} = req.body;

       const isUserAlreadyExists =  await userModel.findOne({
        where : 
            {email},
        
       });

       if(isUserAlreadyExists){
        return res.status(400).json({message : "User is Already Exist"});
       }
       const isUsernameExist = await userModel.findOne({where : {username}});

       if(isUsernameExist){
        return res.status(400).json({message : "UserName is Already Taken"});
       }
       const saltRounds = 10;
       const hashPassword = await  bcrypt.hash(password,saltRounds);

    const user = await userModel.create({
        username,email,password : hashPassword,role
    });   
    res.status(201).json({message : "User Created Successfully",
        username,email,user
    }
    );
    }
    catch (error){
        console.log(error);
        res.status(501).json({message : "Server Error"});
    }  
}

async function loginUser(req,res) {
    const {email,password} = req.body;
    const isRegisterUser = await userModel.findOne({where : {email}});
    if(isRegisterUser){
        const hash = isRegisterUser.password;
        const isPasswordmatched = await bcrypt.compare(password,hash);
        if(!isPasswordmatched){
            return res.status(400).json({message : "Email or Password is Wrong."});
        }
        else{
            const Jwt_secret = process.env.JWT_SECRET;
            const token = await jwt.sign({
                id : isRegisterUser.id,
                email : isRegisterUser.email,
                role : isRegisterUser.role
            },Jwt_secret,{expiresIn : '7d'});

            res.cookie("token",token);

            res.status(200).json({message : "Login Successful"})
        }
    }
    else{
        res.status(400).json({message : "Email or Password is Wrong." });
    }
    
}

module.exports = { registerUser,loginUser};