import cron from 'node-cron';
import { Alert } from '../models/Alert.js';
import { Organization } from '../models/Organization.js';
import { AIUsage } from '../models/AIUsage.js';
import emailService from '../services/emailService.js';
import { User } from '../models/User.js';

export const startCostAlertJob = () => {
  // Run every day at 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running cost alert job...');
    try {
      const organizations = await Organization.find();

      for (const org of organizations) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailyUsage = await AIUsage.findOne({
          organizationId: org._id,
          createdAt: { $gte: today }
        });

        if (dailyUsage && dailyUsage.totalCost > org.budgets.monthlyAiBudget * 0.1) {
          // Alert if daily cost exceeds 10% of monthly budget
          const alert = new Alert({
            organizationId: org._id,
            type: 'high_cost',
            message: `High AI cost detected: $${dailyUsage.totalCost.toFixed(2)} today`,
            threshold: org.budgets.monthlyAiBudget * 0.1,
            currentValue: dailyUsage.totalCost
          });

          await alert.save();

          // Send email to admins
          const admins = await User.find({
            organizationId: org._id,
            role: 'admin'
          });

          for (const admin of admins) {
            await emailService.sendAlertEmail(admin.email, {
              type: 'high_cost',
              organization: org.name,
              dailyCost: dailyUsage.totalCost
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in cost alert job:', error);
    }
  });
};

export default startCostAlertJob;
