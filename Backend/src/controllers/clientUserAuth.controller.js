const authService = require('../services/auth.service');
const  {varifyOtp}  = require('../services/otp.service');
const apikeyModel = require('../models/apiKey.model');
const bcrypt = require('bcrypt');

async function registerClientUser(req,res){

   try {
    const {username,email,password} = req.body;
    const apiKeyId = req.apiKeyId;
    const user = await authService.ClientUserRegisterService({username,email,password,apiKeyId});
    res.status(201).json({message : "User Created Successfully",
    }
    );
    }
    catch (error){
        console.log(error.message);
        res.status(400).json({message : error.message});
    }  
}

async function loginClientUser(req,res) {
        try{
            const {email,password} = req.body;
            const apiKeyId = req.apiKeyId;
            const {user,token} = await authService.ClientUserLoginService(email,password,apiKeyId);

            res.cookie("token",token,{
                httpOnly :true,
                secure : process.env.NODE_ENV === "production",
                maxAge : 10*24*60*60*1000 // 10 days
            });

            res.status(200).json({message : "Login Successful",token});
        }
        catch(error){
            console.log(error.message);
            res.status(400).json({message : error.message});
        }
    
    
    
}

async function clientUserTable(req, res) {
    console.log("apiKey : ",req.body);
  try {
    const  {apiKey}  = req.body;
    console.log(apiKey);

    if (!apiKey) {
      return res.status(404).json({ message: "API Key Required" });
    }

    // split api key
    const prefix = apiKey.slice(0, 8);
    const secret = apiKey.slice(8);

    // find key in DB
    const record = await apikeyModel.findOne({
      where: { prefix, status: "active" },
    });

    if (!record) {
      return res.status(401).json({ message: "Invalid API Key" });
    }

    // verify secret
    const isValid = await bcrypt.compare(secret, record.key);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid API Key" });
    }

    const apiKeyId = record.id;
    console.log("apiKeyId :",apiKeyId);
    const result = await authService.getClientUser(apiKeyId);

    if (!result) {
      return res.status(404).json({
        message: "No user in the Table",
      });
    }
    return res.status(200).json({
      apiKeyId,
      result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function clientUserForgetPassword(req,res) {
    try{
    const {email} = req.body;
    const result = await authService.ClientUserForgetPasswordService(email);
    if(!result){
        return res.status(400).json({message : "No User Found"});
    }
    return res.status(200).json({message : result.message});
    }
    catch(error){
        return res.status(400).json({message : error.message});
    }
}
async function clientUserUpdatePassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    await varifyOtp(email, otp);
    
    await authService.clientUserUpdatePasswordService(email, newPassword);

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
module.exports = { clientUserUpdatePassword,clientUserForgetPassword,registerClientUser,loginClientUser,clientUserTable};