const apikeyModel = require('../models/apiKey.model');
const bcrypt = require('bcrypt');


async function verifyApiKey(req, res, next) {
    try {
        const apiKey = req.headers["x-api-key"];
        if (!apiKey) {
        return res.status(400).json({ message: "API Key Required" });
        }
        const prefix = apiKey.slice(0,8);
        const secret = apiKey.slice(8);
        const record = await apikeyModel.findOne({ where: {prefix : prefix, status: "active" } });
        if (!record) {
        return res.status(401).json({ message: "Invalid API Key" });
        }
        const isValid = await bcrypt.compare(secret,record.key);
        
        if (!isValid) {
        return res.status(401).json({ message: "Invalid API Key" });
        }
        req.apiKeyId = record.id; 
        next();
    }catch(error){
        res.status(500).json({message :error.message});
    }
}

module.exports = verifyApiKey;