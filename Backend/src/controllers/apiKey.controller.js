const apiKeyService = require('../services/apiKey.service');
const apikeyModel = require('../models/apiKey.model');


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

    async function getApiKey(req, res) {
    try {
        
        const apikeys = await apikeyModel.findAll({
        // include: 'user', // optional: include user info if you set up association
        });

        // Send as JSON
        res.status(200).json({
        success: true,
        data: apikeys
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: 'Internal Server Error'
        });
    }
    }


module.exports = {registerApiKey,getApiKey};