const logModel = require('../models/log.model');

async function createLog(data) {
  return await logModel.create(data);
}

async function getLogByApiKey(apiKeyId){
   const logs = await logModel.findOne({
        where : {apikey_id : apiKeyId},
        order : [["createdAt",'DESC']],
    })

    return logs;

}

module.exports = { createLog,getLogByApiKey };