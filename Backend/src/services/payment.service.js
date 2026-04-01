// services/payment.service.js
const SSLCommerzPayment = require('sslcommerz-lts');
const User = require('../models/user.model');
const Payment = require('../models/payment.model');

const store_id = process.env.SSLCZ_STORE_ID;
const store_passwd = process.env.SSLCZ_STORE_PASS;
const is_live = false;

async function initPayment(payload) {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const tranId = `TXN_${Date.now()}`;

  // ✅ Save payment record
  await Payment.create({
    user_id: payload.userId,
    transaction_id: tranId,
    amount: payload.amount,
    status: 'pending'
  });

  const data = {
    total_amount: payload.amount,
    currency: 'BDT',
    tran_id: tranId,

    success_url: 'http://localhost:8000/api/payment/success',
    fail_url: 'http://localhost:8000/api/payment/fail',
    cancel_url: 'http://localhost:8000/api/payment/cancel',
    ipn_url: 'http://localhost:8000/api/payment/ipn',

    product_name: 'GetFlow Subscription',
    product_category: 'Service',
    product_profile: 'general',

    shipping_method: 'NO',

    cus_name: payload.name,
    cus_email: payload.email,
    cus_phone: payload.phone,

    cus_add1: 'N/A',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',

    num_of_item: 1,
  };

  const response = await sslcz.init(data);

  console.log("SSL Response:", response);

  return response.GatewayPageURL;
}

async function handleIPN(data) {
  console.log("IPN Data:", data);

  try {
    const { status, tran_id, val_id } = data;

    const payment = await Payment.findOne({
      where: { transaction_id: tran_id }
    });

    if (!payment) return;

    const userId = payment.user_id;

    // ✅ SUCCESS
    if (status === 'VALID') {

      const now = new Date();
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1);

      // Example: assign plan
      const plan = 'pro';

      await User.update(
        {
          plan,
          planExpiresAt: expiry
        },
        { where: { id: userId } }
      );
      console.log("val_id : ",val_id);

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