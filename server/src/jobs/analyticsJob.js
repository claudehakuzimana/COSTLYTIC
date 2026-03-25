import cron from 'node-cron';
import { AIUsage } from '../models/AIUsage.js';
import { Organization } from '../models/Organization.js';
import analyticsService from '../services/analyticsService.js';

export const startAnalyticsJob = () => {
  // Run every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('Running analytics aggregation job...');
    try {
      const organizations = await Organization.find();

      for (const org of organizations) {
        const pastDay = new Date();
        pastDay.setDate(pastDay.getDate() - 1);

        const dailyUsage = await AIUsage.aggregate([
          {
            $match: {
              organizationId: org._id,
              createdAt: { $gte: pastDay }
            }
          },
          {
            $group: {
              _id: '$provider',
              totalCost: { $sum: '$totalCost' },
              totalTokens: { $sum: '$totalTokens' },
              requestCount: { $sum: '$requestCount' }
            }
          }
        ]);

        console.log(`Analytics aggregated for ${org.name}:`, dailyUsage);
      }
    } catch (error) {
      console.error('Error in analytics job:', error);
    }
  });
};

export default startAnalyticsJob;
