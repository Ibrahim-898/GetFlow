const apikeyModel = require('../models/apiKey.model');
const generateApiKey = require('../utils/generateApiKey');
const bcrypt = require('bcrypt');

async function RegisterApiKeyService(userid) {
    const apikey = await generateApiKey();
    const genSalt = 10;
    const hashedkey =await  bcrypt.hash(apikey,genSalt);
    const key = await apikeyModel.create({
        userid : userid,key : hashedkey
    });

    return apikey;
    
}

module.exports = {RegisterApiKeyService};