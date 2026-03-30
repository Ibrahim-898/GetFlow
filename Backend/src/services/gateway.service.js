const apikeyModel = require('../models/apiKey.model');
const axios = require('axios');
const bcrypt =require('bcrypt')

async function forwardRequst(req,res) {
    try{
    const apiKey  = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ message: "API key is required" });

    const prefix = apiKey.slice(0,8);
    const secret = apiKey.slice(8);
    
    const record = await apikeyModel.findOne({ where: {prefix : prefix,status : "active" } });
    if (!record) return res.status(403).json({ message: "Invalid or inactive API key" });

    const isValid = await bcrypt.compare(secret,record.key);
        
    if (!isValid) {
        return res.status(401).json({ message: "Invalid API Key" });
    }
    
    if(record.expire_at && record.expire_at.getTime()< Date.now()){
        return res.status(401).json({message : "API Key has been Expired."})
    }
       
    const targetUrl = record.target_url;
    if (!targetUrl) return res.status(500).json({ message: "Target URL not found" });

    console.log("Original Url " ,req.originalUrl);
    const path = req.originalUrl.replace('/gateway', '') || '/';
    const headers = { ...req.headers };

    delete headers['host'];
    delete headers['connection'];
    delete headers['content-length'];
    delete headers['transfer-encoding'];
    delete headers['x-api-key'];

    const url = `${targetUrl}${path}`;

    console.log("Forwarding to:", url);

    const axiosConfig = {
        method: req.method,
        url: url,
        headers: headers,
        timeout: 10000
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