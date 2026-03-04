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
    const limits = {
      free: 3,
      pro: 1000,
      enterprise: 5000
    };
    const limit = limits[plan] || 100;
    const windowSec = 60;

    const redisKey = `rate:${record.id}`;
    const result = await slidingWindowCounter(redisKey, limit, windowSec);

    console.log(`API ${record.id}: allowed=${result.allowed}, count=${result.current}`);

    if (!result.allowed) {
      return res.status(429).json({ message: "Too Many Requests" });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    res.status(500).json({ message: "Internal error" });
  }
}

module.exports = rateLimitMiddleware;