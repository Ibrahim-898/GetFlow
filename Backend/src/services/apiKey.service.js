const apikeyModel = require('../models/apiKey.model');
const userModel = require('../models/user.model');
const generateApiKey = require('../utils/generateApiKey');
const bcrypt = require('bcrypt');

const planLimits = {
  free: 1,
  pro: 10,
  enterprise: 100,
};

async function RegisterApiKeyService(userid,target_url) {
    const user = await userModel.findOne({where : {id : userid}});
    
    if (!user) {
        throw new Error("User not found");
    }
    const maxApiKey = planLimits[user.plan];
    if (!maxApiKey) {
        throw new Error("Invalid user plan");
    }

    const apikeyCount = await apikeyModel.count({where : {userid : userid}});
    if(apikeyCount>=maxApiKey){
        throw new Error("Please Upgrade your Plan to Create More Api Keys");  
    }


    
    const apikey = await generateApiKey();
    const prefix = apikey.slice(0,8);
    const secret = apikey.slice(8);
    const genSalt = 10;
   
    const  bcrypthashedkey =await  bcrypt.hash(secret,genSalt);
    
    const key = await apikeyModel.create({
        userid : userid, prefix : prefix ,key : bcrypthashedkey,target_url : target_url
    });

    return apikey;
    
}
async function apiKeyStatService(userId) {
    const user = await userModel.findOne({where : {id : userId}});
    if(!user){
        throw new Error("User Not Found");
    }
    const activeKeys = await apikeyModel.count({where : {userid : userId,status : 'active'}});

    const maxKeys = planLimits[user.plan] || 0;
    const remainingKeys = maxKeys - activeKeys;
      return{
      plan: user.plan,
      maxKeys,
      activeKeys,
      remainingKeys
    };
    
}

module.exports = {RegisterApiKeyService,apiKeyStatService};