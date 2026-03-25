import { AIUsage } from '../models/AIUsage.js';
import { InfrastructureUsage } from '../models/InfrastructureUsage.js';
import { VectorUsage } from '../models/VectorUsage.js';

export class AnalyticsService {
  async getAICostTrends(organizationId, startDate, endDate) {
    try {
      const data = await AIUsage.find({
        organizationId,
        createdAt: { $gte: startDate, $lte: endDate }
      }).sort({ createdAt: 1 });

      return data.map(item => ({
        date: item.createdAt,
        cost: item.totalCost,
        tokens: item.totalTokens,
        requests: item.requestCount
      }));
    } catch (error) {
      console.error('Error fetching AI cost trends:', error);
      throw error;
    }
  }

  async getInfraCostTrends(organizationId, startDate, endDate) {
    try {
      const data = await InfrastructureUsage.find({
        organizationId,
        createdAt: { $gte: startDate, $lte: endDate }
      }).sort({ createdAt: 1 });

      return data;
    } catch (error) {
      console.error('Error fetching infra cost trends:', error);
      throw error;
    }
  }

  async getCostByProvider(organizationId) {
    try {
      const data = await AIUsage.aggregate([
        { $match: { organizationId } },
        { $group: { _id: '$provider', totalCost: { $sum: '$totalCost' } } }
      ]);

      return data.map(item => ({
        provider: item._id,
        cost: item.totalCost
      }));
    } catch (error) {
      console.error('Error fetching cost by provider:', error);
      throw error;
    }
  }

  async getTokenDistribution(organizationId) {
    try {
      const data = await AIUsage.aggregate([
        { $match: { organizationId } },
        { $group: { _id: '$model', totalTokens: { $sum: '$totalTokens' } } }
      ]);

      return data.map(item => ({
        model: item._id,
        tokens: item.totalTokens
      }));
    } catch (error) {
      console.error('Error fetching token distribution:', error);
      throw error;
    }
  }

  async predictMonthlySpend(organizationId, daysAhead = 30) {
    try {
      const pastDays = 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - pastDays);

      const historicalData = await AIUsage.find({
        organizationId,
        createdAt: { $gte: startDate }
      });

      const totalCost = historicalData.reduce((sum, item) => sum + item.totalCost, 0);
      const avgDailyCost = totalCost / pastDays;
      const predictedCost = avgDailyCost * daysAhead;

      return {
        predictedSpend: predictedCost,
        avgDailySpend: avgDailyCost,
        confidenceLevel: 0.85
      };
    } catch (error) {
      console.error('Error predicting monthly spend:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();
