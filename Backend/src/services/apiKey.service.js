const apikeyModel = require('../models/apiKey.model');
const generateApiKey = require('../utils/generateApiKey');
const bcrypt = require('bcrypt');

async function RegisterApiKeyService(userid) {
    const apikey = await generateApiKey();
    const prefix = apikey.slice(0,8);
    const secret = apikey.slice(8);
    const genSalt = 10;
   
    const  bcrypthashedkey =await  bcrypt.hash(secret,genSalt);
    
    const key = await apikeyModel.create({
        userid : userid, prefix : prefix ,key : bcrypthashedkey
    });

    return apikey;
    
}

module.exports = {RegisterApiKeyService};