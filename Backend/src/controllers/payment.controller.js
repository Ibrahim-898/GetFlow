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

async function ipn(req, res) {
  try {
    await handleIPN(req.body); // ✅ wait for DB operations
    res.sendStatus(200);
  } catch (err) {
    console.error("IPN Controller Error:", err.message);
    res.sendStatus(500);
  }
}

module.exports = {
  initializePayment,
  success,
  fail,
  cancel,
  ipn
};