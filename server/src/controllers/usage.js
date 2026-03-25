import { validationResult } from 'express-validator';
import { AIUsage } from '../models/AIUsage.js';
import { getPricing } from '../utils/pricing.js';

export const ingestUsage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      provider,
      model,
      tokens_input,
      tokens_output,
      team,
      application,
      agent,
      request_id,
      ticket_id,
      session_id,
      workflow_id,
      timestamp
    } = req.body;

    // Calculate cost
    const pricing = getPricing(provider, model);
    const cost = (tokens_input * pricing.input) + (tokens_output * pricing.output);

    // Create usage record
    const usage = new AIUsage({
      organizationId: req.user.organizationId,
      provider,
      model,
      tokens_input,
      tokens_output,
      cost,
      team,
      application,
      agent,
      request_id,
      ticket_id,
      session_id,
      workflow_id,
      timestamp: new Date(timestamp)
    });

    await usage.save();

    res.status(201).json({
      message: 'Usage data ingested successfully',
      usage: {
        id: usage._id,
        cost,
        tokens_total: tokens_input + tokens_output
      }
    });
  } catch (error) {
    console.error('Usage ingestion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsage = async (req, res) => {
  try {
    const { startDate, endDate, provider, team, application } = req.query;

    let query = { organizationId: req.user.organizationId };

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (provider) query.provider = provider;
    if (team) query.team = team;
    if (application) query.application = application;

    const usage = await AIUsage.find(query)
      .sort({ timestamp: -1 })
      .limit(1000);

    res.json({ usage });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsageByTeam = async (req, res) => {
  try {
    const { team } = req.params;
    const { startDate, endDate } = req.query;

    let match = {
      organizationId: req.user.organizationId,
      team
    };

    if (startDate && endDate) {
      match.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const usage = await AIUsage.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            application: '$application'
          },
          totalCost: { $sum: '$cost' },
          totalTokens: { $sum: { $add: ['$tokens_input', '$tokens_output'] } },
          requestCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': -1 } }
    ]);

    res.json({ usage });
  } catch (error) {
    console.error('Get usage by team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsageByApplication = async (req, res) => {
  try {
    const { application } = req.params;
    const { startDate, endDate } = req.query;

    let match = {
      organizationId: req.user.organizationId,
      application
    };

    if (startDate && endDate) {
      match.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const usage = await AIUsage.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            team: '$team'
          },
          totalCost: { $sum: '$cost' },
          totalTokens: { $sum: { $add: ['$tokens_input', '$tokens_output'] } },
          requestCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': -1 } }
    ]);

    res.json({ usage });
  } catch (error) {
    console.error('Get usage by application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};