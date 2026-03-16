const {forwardRequst} = require('../services/gateway.service');


async function proxyRequest(req,res) {
    try{
     await forwardRequst(req,res);
    }
    catch(error){
        if (!res.headersSent) {
        res.status(500).json({ message: 'Internal error' });
        }
    }

}

    


module.exports = {proxyRequest};