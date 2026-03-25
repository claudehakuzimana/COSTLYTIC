import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { AIProviderService } from '../services/ai-provider.js';
import { authenticate } from '../middleware/auth.js';
import { ingestUsage } from '../controllers/usage.js';
import { generateImplementationKit } from '../services/implementationKit.js';

const router = express.Router();
const aiService = new AIProviderService();

// Implementation helper (API code / architecture / DB schema)
router.post('/implementation-kit', authenticate, [
  body('requestType').isIn(['api_code', 'backend_architecture', 'database_schema']).withMessage('Invalid request type'),
  body('language').optional().isIn(['nodejs', 'python']).withMessage('Invalid language'),
  body('database').optional().isIn(['postgres', 'mysql']).withMessage('Invalid database')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { requestType, language = 'nodejs', database = 'postgres' } = req.body;
    const kit = generateImplementationKit({ requestType, language, database });

    if (kit.error) {
      return res.status(400).json({
        success: false,
        error: kit.error
      });
    }

    return res.json({
      success: true,
      kit
    });
  } catch (error) {
    console.error('Implementation kit error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate implementation kit'
    });
  }
});

// Chat completion with cost tracking
router.post('/chat', authenticate, [
  body('messages').isArray().withMessage('Messages must be an array'),
  body('messages.*.role').isIn(['user', 'assistant', 'system']).withMessage('Invalid message role'),
  body('messages.*.content').isString().withMessage('Message content must be a string'),
  body('provider').optional().isIn(['groq', 'openrouter']).withMessage('Invalid provider'),
  body('model').optional().isString().withMessage('Model must be a string'),
  body('team').optional().isString().withMessage('Team must be a string'),
  body('application').optional().isString().withMessage('Application must be a string'),
  body('agent').optional().isString().withMessage('Agent must be a string'),
], async (req, res) => {
  try {
    const { messages, provider = 'groq', model, team, application, agent } = req.body;
    const user = req.user;

    let response;
    if (provider === 'groq') {
      response = await aiService.chatWithGroq(messages, {
        model,
        team,
        application,
        agent,
        userId: user.userId,
        organizationId: user.organizationId
      });
    } else if (provider === 'openrouter') {
      response = await aiService.chatWithOpenRouter(messages, {
        model,
        team,
        application,
        agent,
        userId: user.userId,
        organizationId: user.organizationId
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported provider'
      });
    }

    // Track usage asynchronously
    if (response.usageData) {
      // Don't wait for this to complete
      ingestUsage(response.usageData).catch(err => {
        console.error('Error tracking usage:', err);
      });
    }

    res.json({
      success: true,
      content: response.content,
      usage: response.usage,
      cost: response.cost,
      model: response.model,
      provider
    });

  } catch (error) {
    console.error('Chat completion error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat completion'
    });
  }
});

// Get available models with pricing
router.get('/models', authenticate, async (req, res) => {
  try {
    const models = await aiService.getAvailableModels();
    res.json({
      success: true,
      models
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch models'
    });
  }
});

// Get cost estimate
router.post('/cost-estimate', authenticate, [
  body('provider').isIn(['groq', 'openrouter']).withMessage('Invalid provider'),
  body('model').isString().withMessage('Model must be a string'),
  body('input_tokens').isInt({ min: 0 }).withMessage('Input tokens must be a non-negative integer'),
  body('output_tokens').isInt({ min: 0 }).withMessage('Output tokens must be a non-negative integer'),
], async (req, res) => {
  try {
    const { provider, model, input_tokens, output_tokens } = req.body;
    
    const estimate = aiService.getCostEstimate(provider, model, input_tokens, output_tokens);
    
    if (estimate.error) {
      return res.status(400).json({
        success: false,
        error: estimate.error
      });
    }

    res.json({
      success: true,
      estimate
    });
  } catch (error) {
    console.error('Cost estimate error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate cost estimate'
    });
  }
});

// Test API connection
router.get('/test-connection', authenticate, [
  query('provider').optional().isIn(['groq', 'openrouter']).withMessage('Invalid provider')
], async (req, res) => {
  try {
    const { provider = 'groq' } = req.query;
    const test = await aiService.testConnection(provider);
    
    res.json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to test connection'
    });
  }
});

export default router;
