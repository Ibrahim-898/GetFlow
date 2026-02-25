
const authService = require('../services/auth.service')

async function registerUser(req,res){

   try {
    const {username,email,password,role ="user"} = req.body;
    const user = await authService.RegisterService({username,email,password,role});
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

module.exports = { registerUser,loginUser};