const logModel = require('../models/log.model');
const apikeyModel = require('../models/apiKey.model');

async function getLogs(req, res) {
  try {
    const userId = req.user.id;

    const apiKeys = await apikeyModel.findAll({
      where: { userid: userId }
    });

    if (apiKeys.length === 0) {
      return res.status(404).json({
        message: "No API keys found for this user"
      });
    }

    const apiKeyIds = apiKeys.map(k => k.id);

    const logs = await logModel.findAll({
      where: {
        apikey_id: apiKeyIds
      }
    });

    res.status(200).json({
      data: logs
    });

  } catch (error) {
    console.error("GET LOGS ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
}

module.exports = { getLogs };