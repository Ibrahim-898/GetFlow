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
            const userId = req.user.id;

            const apikeys = await apikeyModel.findAll({
            where: { userid: userId },
            attributes: [
                "id",
                "prefix",
                "status",
                "rate_limit",
                "createdAt",
                "expire_at"
            ],
            order: [['createdAt', 'DESC']]
            });
            // console.log(apikeys);
            return res.status(200).json({
            success: true,
            data: apikeys
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
            });
        }
        }

    async function getApiKeyStats(req,res) {
    try{
    const userId = req.user.id;
    // console.log("userId :",userId);
    const result = await apiKeyService.apiKeyStatService(userId);
    // console.log(result);
    return res.status(200).json({data : result});
    }catch(error){
        console.log(error.message);
        res.status(500).json({
        message: error.message
        });
    }
    
}

// Update key status manually (Activate / Deactivate)
async function updateApiKeyStatus(req, res) {
  try {
    const userId = req.user.id;
    const { keyId } = req.params;
    const { status } = req.body;

    console.log("key", keyId, userId, status);

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const key = await apiKeyService.updateApiKeyStatusService(userId, keyId, status);

    res.status(200).json({ success: true, data: key, message: `Key ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



module.exports = {registerApiKey,getApiKey,getApiKeyStats,updateApiKeyStatus};