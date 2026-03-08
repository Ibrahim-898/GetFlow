const redis = require('../db/redisClient');

 async function slidingWindowCounter(clientKey,companyKey,clientLimit,companyLimit,windowsec) {
    const now = Math.floor(Date.now()/1000);
    const result = await redis.slidingWindowCounter(
        clientKey,
        companyKey,
        clientLimit,
        companyLimit,
        windowsec,
        now
    );

    return {
    allowed: result[0] === 1,
    clientCount : result[1],
    companyCount : result[2],
     };
    
}

module.exports = slidingWindowCounter;