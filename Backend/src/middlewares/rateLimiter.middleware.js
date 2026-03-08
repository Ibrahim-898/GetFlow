const slidingWindowCounter = require("../services/rateLimit.service");
const apikeyModel = require('../models/apiKey.model');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

async function rateLimitMiddleware(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      return res.status(400).json({ message: "API Key Required" });
    }
    const prefix = apiKey.slice(0,8);
    const secret = apiKey.slice(8);
    const record = await apikeyModel.findOne({ where: {prefix : prefix, status: "active" } });
     if (!record) {
      return res.status(400).json({ message: "Invalid API Key" });
    }
    const isValid = await bcrypt.compare(secret,record.key);
    
    if (!isValid) {
      return res.status(401).json({ message: "Invalid API Key" });
    }

    if(record.expire_at && record.expire_at.getTime()< Date.now()){
      return res.status(401).json({message : "API Key has benn Expired."})
    }
   
    const userRecord = await userModel.findOne({
      where: { id: record.userid },
    });

    if (!userRecord) {
      return res.status(400).json({ message: "User not found for this API key" });
    }

    const plan = userRecord.plan || "free"; // default to free if undefined
    const companyLimitsPerPlan = {
      free: 5,
      pro: 5000,
      enterprise: 10000
    };

    
    const companyLimit = companyLimitsPerPlan[plan] || 100;
    const clientLimit = 3; 
    const windowSec = 60;

    const companyRedisKey = `rate:${record.id}`;
    const clientRedisKey = `rate:${record.id}:${req.ip}`;

    const result = await slidingWindowCounter(companyRedisKey, clientRedisKey,companyLimit,clientLimit, windowSec);

    console.log(`API ${record.id}: allowed=${result.allowed}, client=${result.clientCount}, company = ${result.companyCount}`);

    if (!result.allowed) {
      const msg = result.limitType === "company"
                ? "Company rate limit exceeded"
                : "Client rate limit exceeded";
            return res.status(429).json({ message: msg });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    res.status(500).json({ message: "Internal error" });
  }
}

module.exports = rateLimitMiddleware;