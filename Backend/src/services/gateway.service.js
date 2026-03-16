const apikeyModel = require('../models/apiKey.model');
const axios = require('axios');

async function forwardRequst(req,res) {
    try{
    const apiKey  = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ message: "API key is required" });

    const prefix = apiKey.slice(0,8);
    const record = await apikeyModel.findOne({ where: {prefix : prefix,key :apiKey ,status : "active" } });
    if (!record) return res.status(403).json({ message: "Invalid or inactive API key" });

    const targetUrl = record.target_url;
    if (!targetUrl) return res.status(500).json({ message: "Target URL not found" });

    const url = `${targetUrl}${req.originalUrl}`;
    const headers = {...req.headers};
    headers['host']=  new URL(targetUrl).host;

    const axiosConfig= {
        method : req.method,
        url : url,
        headers : headers
        
       
    };
    if (['POST','PUT','PATCH'].includes(req.method.toUpperCase())) {
        axiosConfig.data = req.body; 
    }
    const response = await axios(axiosConfig);
    res.status(response.status).send(response.data);
   }
   catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(502).json({ message: "Failed to forward request", error: error.message });
        }
    }
    
}

module.exports = {forwardRequst};