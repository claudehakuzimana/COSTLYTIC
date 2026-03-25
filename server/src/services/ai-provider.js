import { GroqService } from './groq.js';
import { OpenRouterService } from './openrouter.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.ai-providers' });

export class AIProviderService {
  constructor() {
    this.groq = process.env.GROQ_API_KEY ? new GroqService(process.env.GROQ_API_KEY) : null;
    this.openrouter = process.env.OPENROUTER_API_KEY ? new OpenRouterService(process.env.OPENROUTER_API_KEY) : null;
    
    this.pricing = {
      groq: {
        'llama-3.1-8b-instant': { input: 0.05, output: 0.10 },
        'llama-3.1-70b-instant': { input: 0.59, output: 0.79 },
        'mixtral-8x7b-32768': { input: 0.27, output: 0.27 },
        'gemma-7b-it': { input: 0.07, output: 0.07 },
      },
      openrouter: {
        'meta-llama/llama-3.1-8b-instruct:free': { input: 0.00, output: 0.00 },
        'meta-llama/llama-3.1-70b-instruct:free': { input: 0.00, output: 0.00 },
        'meta-llama/llama-3.1-8b-instruct': { input: 0.10, output: 0.10 },
        'meta-llama/llama-3.1-70b-instruct': { input: 0.90, output: 0.90 },
        'anthropic/claude-3-haiku': { input: 0.25, output: 1.25 },
        'anthropic/claude-3-sonnet': { input: 3.00, output: 15.00 },
        'openai/gpt-4o-mini': { input: 0.15, output: 0.60 },
        'openai/gpt-4o': { input: 2.50, output: 10.00 },
      }
    };
  }

  async chatWithGroq(messages, options = {}) {
    if (!this.groq) {
      throw new Error('Groq API key not configured');
    }

    const { model = 'llama-3.1-8b-instant', team, application, agent, userId, organizationId } = options;
    
    try {
      const startTime = Date.now();
      const response = await this.groq.chatCompletion(messages, model);
      const endTime = Date.now();

      // Calculate cost
      const cost = this.groq.calculateCost(
        model,
        response.usage.prompt_tokens,
        response.usage.completion_tokens
      );

      // Prepare usage data for tracking
      const usageData = {
        provider: 'groq',
        model,
        tokens_input: response.usage.prompt_tokens,
        tokens_output: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
        cost: cost.total_cost,
        team,
        application,
        agent,
        user_id: userId,
        organization_id: organizationId,
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        latency_ms: endTime - startTime,
        finish_reason: response.finish_reason,
        status: 'success'
      };

      return {
        content: response.content,
        usage: response.usage,
        cost,
        usageData,
        model: response.model
      };

    } catch (error) {
      console.error('Groq API error:', error);
      
      // Track failed request
      const failedUsageData = {
        provider: 'groq',
        model,
        team,
        application,
        agent,
        user_id: userId,
        organization_id: organizationId,
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message
      };

      throw error;
    }
  }

  async chatWithOpenRouter(messages, options = {}) {
    if (!this.openrouter) {
      throw new Error('OpenRouter API key not configured');
    }

    const { model = 'meta-llama/llama-3.1-8b-instruct:free', team, application, agent, userId, organizationId } = options;
    
    try {
      const startTime = Date.now();
      const response = await this.openrouter.chatCompletion(messages, model);
      const endTime = Date.now();

      // Calculate cost
      const cost = this.openrouter.calculateCost(
        model,
        response.usage.prompt_tokens,
        response.usage.completion_tokens
      );

      // Prepare usage data for tracking
      const usageData = {
        provider: 'openrouter',
        model,
        tokens_input: response.usage.prompt_tokens,
        tokens_output: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
        cost: cost.total_cost,
        team,
        application,
        agent,
        user_id: userId,
        organization_id: organizationId,
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        latency_ms: endTime - startTime,
        finish_reason: response.finish_reason,
        status: 'success'
      };

      return {
        content: response.content,
        usage: response.usage,
        cost,
        usageData,
        model: response.model
      };

    } catch (error) {
      console.error('OpenRouter API error:', error);
      
      // Track failed request
      const failedUsageData = {
        provider: 'openrouter',
        model,
        team,
        application,
        agent,
        user_id: userId,
        organization_id: organizationId,
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message
      };

      throw error;
    }
  }

  async getAvailableModels() {
    const models = {
      groq: [],
      openrouter: []
    };

    if (this.groq) {
      try {
        const groqModels = await this.groq.getModels();
        models.groq = groqModels.map(model => ({
          id: model.id,
          name: model.id,
          provider: 'groq',
          pricing: this.pricing.groq[model.id] || this.pricing.groq['llama-3.1-8b-instant']
        }));
      } catch (error) {
        console.error('Error fetching Groq models:', error);
      }
    }

    if (this.openrouter) {
      try {
        const openrouterModels = await this.openrouter.getModels();
        models.openrouter = openrouterModels.map(model => ({
          id: model.id,
          name: model.name || model.id,
          provider: 'openrouter',
          pricing: this.pricing.openrouter[model.id] || this.pricing.openrouter['meta-llama/llama-3.1-8b-instruct:free']
        }));
      } catch (error) {
        console.error('Error fetching OpenRouter models:', error);
      }
    }

    return models;
  }

  async testConnection(provider = 'groq') {
    switch (provider) {
      case 'groq':
        if (!this.groq) {
          return { success: false, error: 'Groq API key not configured' };
        }
        return await this.groq.testConnection();
      case 'openrouter':
        if (!this.openrouter) {
          return { success: false, error: 'OpenRouter API key not configured' };
        }
        return await this.openrouter.testConnection();
      default:
        return { success: false, error: `Provider ${provider} not supported` };
    }
  }

  // Get cost estimate for a request
  getCostEstimate(provider, model, inputTokens, outputTokens) {
    const pricing = this.pricing[provider];
    if (!pricing || !pricing[model]) {
      return { error: 'Pricing not available for this model' };
    }

    const modelPricing = pricing[model];
    const inputCost = (inputTokens / 1000000) * modelPricing.input;
    const outputCost = (outputTokens / 1000000) * modelPricing.output;
    
    return {
      input_cost: inputCost,
      output_cost: outputCost,
      total_cost: inputCost + outputCost,
      currency: 'USD'
    };
  }
}
