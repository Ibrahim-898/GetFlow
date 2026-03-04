const redis = require('../db/redisClient');

 async function slidingWindowCounter(key,limit,windowsec) {
    const now = Math.floor(Date.now()/1000);
    const result = await redis.slidingWindowCounter(
        key,
        limit,
        windowsec,
        now
    );

    return {
    allowed: result[0] === 1,
    current: result[1],
     };
    
}

module.exports = slidingWindowCounter;