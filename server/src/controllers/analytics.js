import mongoose from "mongoose";
import { AIUsage } from '../models/AIUsage.js';
import { InfrastructureUsage } from '../models/InfrastructureUsage.js';
import { VectorUsage } from '../models/VectorUsage.js';
import { Alert } from '../models/Alert.js';

function toObjectId(maybeId) {
  if (!maybeId) return maybeId;
  if (typeof maybeId === 'string' && mongoose.Types.ObjectId.isValid(maybeId)) {
    return new mongoose.Types.ObjectId(maybeId);
  }
  return maybeId;
}

export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const organizationId = toObjectId(req.user.organizationId);

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // AI Usage Stats
    const aiStats = await AIUsage.aggregate([
      { $match: { organizationId, ...dateFilter } },
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$cost' },
          totalTokens: { $sum: { $add: ['$tokens_input', '$tokens_output'] } },
          totalRequests: { $sum: 1 },
          avgCostPerRequest: { $avg: '$cost' }
        }
      }
    ]);

    // Infrastructure Stats
    const infraStats = await InfrastructureUsage.aggregate([
      { $match: { organizationId, ...dateFilter } },
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$cost_per_hour' },
          avgUtilization: { $avg: '$gpu_utilization' }
        }
      }
    ]);

    // Vector Storage Stats
    const vectorStats = await VectorUsage.aggregate([
      { $match: { organizationId, ...dateFilter } },
      {
        $group: {
          _id: null,
          totalStorage: { $sum: '$storage_gb' },
          totalCost: { $sum: '$cost' }
        }
      }
    ]);

    const stats = {
      ai: aiStats[0] || { totalCost: 0, totalTokens: 0, totalRequests: 0, avgCostPerRequest: 0 },
      infrastructure: infraStats[0] || { totalCost: 0, avgUtilization: 0 },
      vector: vectorStats[0] || { totalStorage: 0, totalCost: 0 }
    };

    const alerts = await Alert.find({ organizationId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('type severity title message status createdAt');

    res.json({ stats, alerts });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSpendByProvider = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const organizationId = toObjectId(req.user.organizationId);

    let match = { organizationId };
    if (startDate && endDate) {
      match.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const spend = await AIUsage.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$provider',
          totalCost: { $sum: '$cost' },
          totalTokens: { $sum: { $add: ['$tokens_input', '$tokens_output'] } },
          requestCount: { $sum: 1 }
        }
      },
      { $sort: { totalCost: -1 } }
    ]);

    res.json({ spend });
  } catch (error) {
    console.error('Get spend by provider error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCostByTeam = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const organizationId = toObjectId(req.user.organizationId);

    let match = { organizationId };
    if (startDate && endDate) {
      match.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const costs = await AIUsage.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$team',
          totalCost: { $sum: '$cost' },
          totalTokens: { $sum: { $add: ['$tokens_input', '$tokens_output'] } },
          requestCount: { $sum: 1 }
        }
      },
      { $sort: { totalCost: -1 } }
    ]);

    res.json({ costs });
  } catch (error) {
    console.error('Get cost by team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTokenUsageTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const organizationId = toObjectId(req.user.organizationId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await AIUsage.aggregate([
      {
        $match: {
          organizationId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            provider: '$provider'
          },
          totalCost: { $sum: '$cost' },
          totalTokens: { $sum: { $add: ['$tokens_input', '$tokens_output'] } },
          requestCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json({ trends });
  } catch (error) {
    console.error('Get token usage trends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCostForecast = async (req, res) => {
  try {
    const organizationId = toObjectId(req.user.organizationId);

    // Simple forecasting based on last 30 days average
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsage = await AIUsage.aggregate([
      {
        $match: {
          organizationId,
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$cost' },
          days: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } } }
        }
      }
    ]);

    let forecast = { monthly: 0, confidence: 0 };
    if (recentUsage.length > 0) {
      const data = recentUsage[0];
      const uniqueDays = data.days.length;
      const dailyAverage = data.totalCost / Math.max(uniqueDays, 1);
      forecast.monthly = dailyAverage * 30;
      forecast.confidence = Math.min(uniqueDays / 30, 1) * 100;
    }

    res.json({ forecast });
  } catch (error) {
    console.error('Get cost forecast error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};