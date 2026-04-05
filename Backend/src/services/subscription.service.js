const userModel = require('../models/user.model');
const VALID_PLANS = ['free', 'pro', 'enterprise'];

async function handleSubscription(userId, planId) {
  const user = await userModel.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  if (!VALID_PLANS.includes(planId)) {
    throw new Error("Invalid plan");
  }
  if (user.plan === "free") {
    return {
      allowed: true,
      type: "new"
    };
  }

  const now = new Date();
  const isActive = user.planExpiresAt && user.planExpiresAt > now;


  if (isActive && user.plan === planId) {
    return {
      allowed: false,
      type: "same_active",
      message: "You already have this plan. No need to pay again."
    };
  }


  if (isActive && user.plan !== planId) {
    if (user.plan === "pro" && planId === "enterprise") {
      return {
        allowed: true,
        type: "upgrade"
      };
    }

    return {
      allowed: false,
      type: "blocked",
      message: "Plan change not allowed while active"
    };
  }

  return {
    allowed: true,
    type: "expired"
  };
}

module.exports = handleSubscription;