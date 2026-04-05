const cron = require('node-cron');
const User = require('../models/user.model');
const { Op } = require('sequelize');

function startPlanExpiryJob() {
  cron.schedule('0 * * * *', async () => {
    console.log('Running plan expiry check...');

    try {
      const now = new Date();

      const [updatedCount] = await User.update(
        {
          plan: 'free',
          planExpiresAt: null
        },
        {
          where: {
            plan: {
              [Op.in]: ['pro', 'enterprise']
            },
            planExpiresAt: {
              [Op.lt]: now
            }
          }
        }
      );

      console.log(`Downgraded ${updatedCount} users`);

    } catch (err) {
      console.error('Expiry job error:', err.message);
    }
  });
}

module.exports = startPlanExpiryJob;