const  {initPayment,handleIPN} = require('../services/payment.service');

async function initializePayment(req, res) {
  try {
    console.log("req body : ",req.body);
    const payload = {
      ...req.body,
      userId: req.user.id
    };
    const url = await initPayment(payload);
    console.log("url : ",url);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function success(req, res) {
  res.send("Payment Success");
}

function fail(req, res) {
  res.send("Payment Failed");
}

function cancel(req, res) {
  res.send("Payment Cancelled");
}

function ipn(req, res) {
  handleIPN(req.body);
  res.sendStatus(200);
}

module.exports = {
  initializePayment,
  success,
  fail,
  cancel,
  ipn
};