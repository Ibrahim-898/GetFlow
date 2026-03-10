const {getLogByApiKey} = require('../services/analytics.service');

async function getLogs(req,res) {

    try{
    const apiKeyId = req.rateLimitInfo.apiKeyId;

    const logs = await  getLogByApiKey(apiKeyId);
    res.status(200).json({data : logs})
    } catch(error){
        res.status(500).json({message : "Error fetching logs"});
    }
    
}
module.exports = { getLogs };