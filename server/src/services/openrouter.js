import axios from 'axios';

export class OpenRouterService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:6000',
        'X-Title': 'Costlytic SaaS'
      }
    });
  }

  async getModels() {
    try {
      const response = await this.client.get('/models');
      return response.data.data.filter(model => model.id.includes('free') || model.id.includes('open'));
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      throw error;
    }
  }

  async chatCompletion(messages, model = 'meta-llama/llama-3.1-8b-instruct:free') {
    try {
      const response = await this.client.post('/chat/completions', {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const completion = response.data;
      
      return {
        content: completion.choices[0].message.content,
        usage: {
          prompt_tokens: completion.usage.prompt_tokens,
          completion_tokens: completion.usage.completion_tokens,
          total_tokens: completion.usage.total_tokens,
        },
        model: completion.model,
        finish_reason: completion.choices[0].finish_reason,
      };
    } catch (error) {
      console.error('Error in OpenRouter chat completion:', error);
      throw error;
    }
  }

  // Calculate cost based on OpenRouter pricing
  calculateCost(model, inputTokens, outputTokens) {
    // OpenRouter pricing (approximate, varies by model)
    const pricing = {
      'meta-llama/llama-3.1-8b-instruct:free': { input: 0.00, output: 0.00 },
      'meta-llama/llama-3.1-70b-instruct:free': { input: 0.00, output: 0.00 },
      'meta-llama/llama-3.1-8b-instruct': { input: 0.10, output: 0.10 },
      'meta-llama/llama-3.1-70b-instruct': { input: 0.90, output: 0.90 },
      'anthropic/claude-3-haiku': { input: 0.25, output: 1.25 },
      'anthropic/claude-3-sonnet': { input: 3.00, output: 15.00 },
      'openai/gpt-4o-mini': { input: 0.15, output: 0.60 },
      'openai/gpt-4o': { input: 2.50, output: 10.00 },
    };

    const modelPricing = pricing[model] || pricing['meta-llama/llama-3.1-8b-instruct'];
    const inputCost = (inputTokens / 1000000) * modelPricing.input;
    const outputCost = (outputTokens / 1000000) * modelPricing.output;
    
    return {
      input_cost: inputCost,
      output_cost: outputCost,
      total_cost: inputCost + outputCost,
      currency: 'USD'
    };
  }

  // Test connection
  async testConnection() {
    try {
      const response = await this.chatCompletion([
        { role: 'user', content: 'Hello! Just testing the connection.' }
      ]);
      return { success: true, response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get account info
  async getAccountInfo() {
    try {
      const response = await this.client.get('/auth/key');
      return response.data;
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }
}
