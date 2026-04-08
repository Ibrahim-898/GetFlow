const  {initPayment,handleIPN} = require('../services/payment.service');
const handleSubscription = require('../services/subscription.service');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

async function initializePayment(req, res) {
  try {
    const userId = req.user.id;
    const payload = {
      ...req.body,
      userId,
    };
    
    const result = await handleSubscription(userId, payload.planId);

    // ✅ Same active plan → redirect / notify
    if (!result.allowed && result.type === "same_active") {
      return res.status(400).json({
        message: result.message
      });
    }

    // ✅ Blocked cases
    if (!result.allowed) {
      return res.status(400).json({
        message: result.message || "Not allowed"
      });
    }

    const url = await initPayment(payload);
    console.log("url : ",url);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// Payment success redirect
function success(req, res) {
  return res.redirect(`${FRONTEND_URL}/?payment=success`);
}

// Payment failed redirect
function fail(req, res) {
  return res.redirect(`${FRONTEND_URL}/?payment=failed`);
}

// Payment canceled redirect
function cancel(req, res) {
  return res.redirect(`${FRONTEND_URL}/?payment=cancel`);
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