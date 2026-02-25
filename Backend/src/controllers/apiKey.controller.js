const apiKeyService = require('../services/apiKey.service');



async function registerApiKey(req,res){
    try{
    const userid = req.user.id;
    const apikey = await apiKeyService.RegisterApiKeyService(userid);
    res.status(200).json({message : "Here is Your ApiKey : ",apikey });
    }
    catch(error){
        res.status(500).json({message : error.message});
    }


}

module.exports = {registerApiKey};