const createLog = require('../services/analytics.service');

async function   loggerMiddleware(req,res,next) {
    const startHrTime = process.hrtime();
    res.on('finish', async () => {
      try {
        
        const elapsedHrTime = process.hrtime(startHrTime);
        const responseTimeMs = Math.round(elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6);

        const rateInfo = req.rateLimitInfo || {};

        await createLog({
          apikey_id: rateInfo.apikeyId,
          ip_address: rateInfo.clientIp,
          method: req.method,
          endpoint: req.originalUrl,
          status_code: res.statusCode,
          response_time_ms: responseTimeMs,
        });
      } catch (err) {
        console.error("Logging error:", err);
      }
    });
    next();
    
}

module.exports = loggerMiddleware;