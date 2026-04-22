const { where, Op } = require('sequelize');
const userModel = require('../models/user.model');
const clientUserModel = require('../models/clientUser.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');
const otpModel = require('../models/otp.model');
const {generateOtp,saveOtp,varifyOtp} = require('../services/otp.service');


async function RegisterService({companyname,email,password,role}){
    const isUserAlreadyExists =  await userModel.findOne({
        where : 
            {email},
       });

       if(isUserAlreadyExists){
        throw new Error("User is Already Exist");
       }
       const iscompanynameExist = await userModel.findOne({where : {companyname}});

       if(iscompanynameExist){
        throw new Error("Company Name is Already Taken");
       }
       const saltRounds = 10;
       const hashPassword = await  bcrypt.hash(password,saltRounds);

    const user = await userModel.create({
        companyname,email,password : hashPassword,role
    });   
     return {
        id: user.id,
        companyname: user.companyname,
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
            companyname: isRegisterUser.companyname,
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

async function  forgetPasswordService(email) {
    const user  = await userModel.findOne({where : {email : email}});
    if(!user){
        throw new Error("No Account is Registered in this Email");
    }
    const otp = generateOtp(); 
    console.log("Otp generated successfully");
    await saveOtp(email,otp);
    
    console.log("OTP Saved Successfully");
    const result = await sendEmail(otp,email);
    if (!result.success) {
        throw new Error("Email sending failed");
    }
    console.log("Otp is sent");
    return { message: "OTP sent successfully" };
}



async function updatePasswordService(email,newPassword) {
    const user =await userModel.findOne({where : {email}});
    if(!user) {
        throw new Error("No user Found");
    }
    console.log("user : ",user);
    console.log(newPassword);
    const hashPassword =await bcrypt.hash(newPassword,10);
    await userModel.update({password : hashPassword},{where : {email}});
    console.log("password updated");
    await otpModel.destroy({ where: { email } });
    return { message: "Password updated successfully" };  
}



async function ClientUserRegisterService({username,email,password,apiKeyId}){
    const isUserAlreadyExists =  await clientUserModel.findOne({
        where : 
            {email,apiKeyId},
       });
       
       if(isUserAlreadyExists){
        throw new Error("User is Already Exist");
       }
       const isUsernameExist = await clientUserModel.findOne({where : {username}});

       if(isUsernameExist){
        throw new Error("UserName is Already Taken");
       }
       const saltRounds = 10;
       const hashPassword = await  bcrypt.hash(password,saltRounds); 
    const user = await clientUserModel.create({
        username,email,password : hashPassword,apiKeyId
    });   
     return {
        id: user.id,
        username: user.username,
        email: user.email,
    };
}

async function ClientUserLoginService(email,password,apiKeyId) {
    const isRegisterUser = await clientUserModel.findOne({where : {email,apiKeyId}});
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
                apiKeyId : isRegisterUser.apiKeyId,
            },Jwt_secret,{expiresIn : '7d'});

            return {
                user: {
            id: isRegisterUser.id,
            username: isRegisterUser.username,
            email: isRegisterUser.email,
             },
            token
           };  
}

async function  ClientUserForgetPasswordService(email) {
    const user  = await clientUserModel.findOne({where : {email : email,apiKeyId}});
    if(!user){
        throw new Error("No Account is Registered in this Email");
    }
    const otp = generateOtp(); 
    console.log("Otp generated successfully");
    await saveOtp(email,otp);
    
    console.log("OTP Saved Successfully");
    const result = await sendEmail(otp,email);
    if (!result.success) {
        throw new Error("Email sending failed");
    }
    console.log("Otp is sent");
    return { message: "OTP sent successfully" };
}

async function clientUserUpdatePasswordService(email,newPassword) {
    const user =await clientUserModel.findOne({where : {email,apiKeyId}});
    if(!user) {
        throw new Error("No user Found");
    }
    console.log("user : ",user);
    console.log(newPassword);
    const hashPassword =await bcrypt.hash(newPassword,10);
    await clientUserModel.update({password : hashPassword},{where : {email}});
    console.log("password updated");
    await otpModel.destroy({ where: { email } });
    return { message: "Password updated successfully" };  
}






module.exports = {RegisterService,LoginService,getProfile,forgetPasswordService,updatePasswordService,
    ClientUserRegisterService,clientUserUpdatePasswordService,ClientUserForgetPasswordService,ClientUserLoginService
};