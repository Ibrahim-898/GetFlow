const authService = require('../services/auth.service');
const  {varifyOtp}  = require('../services/otp.service');

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
module.exports = { clientUserUpdatePassword,clientUserForgetPassword,registerClientUser,loginClientUser};