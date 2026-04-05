const apiKeyService = require('../services/apiKey.service');
const apikeyModel = require('../models/apiKey.model');
const userModel = require('../models/user.model');


async function registerApiKey(req,res){
    try{
    const userid = req.user.id;
    if(!userid){
        return res.status(400).json({message : "Please Login and try again"});
    }
    const {target_url} = req.body;
    if(!target_url){
        return res.status(400).json({message: "targetUrl is required"});
    }
    const apikey = await apiKeyService.RegisterApiKeyService(userid,target_url);
    res.status(201).json({message : "Here is Your ApiKey : ",apikey });
    }
    catch(error){
        res.status(500).json({message : error.message});
    }


}

    async function getApiKey(req, res) {
    try {
        const apikeys = await apikeyModel.findAll({
        });
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