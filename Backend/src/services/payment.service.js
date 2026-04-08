const SSLCommerzPayment = require('sslcommerz-lts');
const User = require('../models/user.model');
const Payment = require('../models/payment.model');
const userModel =require('../models/user.model');
const { Op } = require('sequelize');

const store_id = process.env.SSLCZ_STORE_ID;
const store_passwd = process.env.SSLCZ_STORE_PASS;
const is_live = process.env.SSLCZ_LIVE === 'true'; 
const BACKEND_URL = process.env.BACKEND_URL;


const PLAN_CONFIG = {

  pro: {
    monthly: { price: 1000, duration: 1 },
    yearly: { price: 900, duration: 12 }
  },
  enterprise: {
    monthly: { price: 2500, duration: 1 },
    yearly: { price: 2000, duration: 12 }
  }
};


async function initPayment(payload) {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const tranId = `TXN_${Date.now()}`;


  const planData = PLAN_CONFIG[payload.planId];
  if (!planData) throw new Error("Invalid plan");

  const billing = planData[payload.billingCycle];
  if (!billing) throw new Error("Invalid billing cycle");

  const amount = billing.price;


  const user = await User.findByPk(payload.userId);
  if (!user) throw new Error("User not found");

  
  await Payment.create({
    user_id: user.id,
    transaction_id: tranId,
    amount,
    plan: payload.planId,
    billingCycle: payload.billingCycle,
    status: 'pending'
  });

  const data = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: tranId,

    success_url: `${BACKEND_URL}/api/payment/success`,
    fail_url: `${BACKEND_URL}/api/payment/fail`,
    cancel_url: `${BACKEND_URL}/api/payment/cancel`,
    ipn_url: `${BACKEND_URL}/api/payment/ipn`,

    product_name: `${payload.planId} subscription (${payload.billingCycle})`,
    product_category: 'Service',
    product_profile: 'general',

    shipping_method: 'NO',

    cus_name: user.username,
    cus_email: user.email,
    cus_phone: user.phone,

    cus_add1: 'N/A',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',

    num_of_item: 1,
  };

  const response = await sslcz.init(data);

  console.log("SSL Response:", response.GatewayPageURL);

  return response.GatewayPageURL;
}


async function handleIPN(data) {
  console.log("IPN Data:", data);

  try {
    const { status, tran_id, val_id } = data;

    const payment = await Payment.findOne({
      where: { transaction_id: tran_id }
    });

    if (!payment) return console.log("Payment record not found");
    if (payment.status === 'success') return console.log("Already processed");

    const user = await User.findByPk(payment.user_id);
    if (!user) return console.log("User not found");

    if (status === 'VALID' || status === 'VALIDATED') {

      const plan = payment.plan;
      const billingCycle = payment.billingCycle;

      const planData = PLAN_CONFIG[plan][billingCycle];
      const duration = planData.duration;

      const now = new Date();
      let newExpiry = new Date();


      if (user.planExpiresAt && user.planExpiresAt > now) {
        newExpiry = new Date(user.planExpiresAt);
      }

      newExpiry.setMonth(newExpiry.getMonth() + duration);

      await User.update(
        {
          plan,
          planExpiresAt: newExpiry
        },
        { where: { id: user.id } }
      );

      await Payment.update(
        {
          status: 'success',
          val_id
        },
        { where: { transaction_id: tran_id } }
      );

      console.log("Payment success + subscription activated");
    }

    else if (status === 'FAILED') {
      await Payment.update(
        { status: 'failed' },
        { where: { transaction_id: tran_id } }
      );

      console.log("Payment failed");
    }

  } catch (err) {
    console.error("IPN Error:", err.message);
  }
}



module.exports = {
  initPayment,
  handleIPN
};