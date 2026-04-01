// jobs/planExpiry.job.js
const cron = require('node-cron');
const User = require('../models/user.model');

function startPlanExpiryJob() {
  cron.schedule('0 * * * *', async () => {
    // runs every hour
    console.log('Running plan expiry check...');

    try {
      const now = new Date();

      const users = await User.findAll({
        where: {
          plan: 'pro',
          planExpiresAt: {
            [require('sequelize').Op.lt]: now
          }
        }
      });

      for (const user of users) {
        await User.update(
          {
            plan: 'free',
            planExpiresAt: null
          },
          { where: { id: user.id } }
        );

        console.log(`Downgraded user ${user.id}`);
      }

    } catch (err) {
      console.error('Expiry job error:', err.message);
    }
  });
}

module.exports = startPlanExpiryJob;