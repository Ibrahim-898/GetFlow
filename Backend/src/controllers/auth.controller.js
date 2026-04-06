const authService = require('../services/auth.service');
const  {varifyOtp}  = require('../services/otp.service');

async function registerUser(req,res){

   try {
    const {companyname,email,password,role ="user"} = req.body;
    const user = await authService.RegisterService({companyname,email,password,role});
    res.status(201).json({message : "User Created Successfully",
        user
    }
    );
    }
    catch (error){
        res.status(400).json({message : error.message});
    }  
}

async function loginUser(req,res) {
        try{
            const {email,password} = req.body;
            const {user,token} = await authService.LoginService(email,password);

            res.cookie("token",token,{
                httpOnly :true,
                secure : process.env.NODE_ENV === "production",
                maxAge : 10*24*60*60*1000 // 10 days
            });

            res.status(200).json({message : "Login Successful",token});
        }
        catch(error){
            res.status(400).json({message : error.message});
        }
    
    
    
}

async function UserProfile(req,res) {
    try{
    const userid = req.user.id;
    const user = await authService.getProfile(userid);
    res.status(200).json({
      companyname: user.companyname,
      email: user.email,
    });
    }
    catch(error){
         res.status(400).json({message : error.message});
    }
    
}
async function forgetPassword(req,res) {
    try{
    const {email} = req.body;
    const result = await authService.forgetPasswordService(email);
    if(!result){
        return res.status(400).json({message : "No User Found"});
    }
    return res.status(200).json({message : result.message});
    }
    catch(error){
        return res.status(400).json({message : error.message});
    }
}
async function updatePassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    await varifyOtp(email, otp);
    
    await authService.updatePasswordService(email, newPassword);

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
module.exports = { registerUser,loginUser,UserProfile,forgetPassword,updatePassword};