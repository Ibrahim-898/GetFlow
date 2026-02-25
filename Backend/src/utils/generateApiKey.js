const crypto = require('crypto');

async function generateApiKey(){
    const apiKey = crypto.randomBytes(32).toString('base64');

    return apiKey;

}

module.exports = generateApiKey;