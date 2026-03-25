import Groq from 'groq-sdk';

export class GroqService {
  constructor(apiKey) {
    this.client = new Groq({ apiKey });
  }

  async getModels() {
    try {
      const models = await this.client.models.list();
      return models.data.filter(model => model.active);
    } catch (error) {
      console.error('Error fetching Groq models:', error);
      throw error;
    }
  }

  async chatCompletion(messages, model = 'llama-3.1-8b-instant') {
    try {
      const completion = await this.client.chat.completions.create({
        messages,
        model,
        temperature: 0.7,
        max_tokens: 1024,
      });

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
      console.error('Error in Groq chat completion:', error);
      throw error;
    }
  }

  // Calculate cost based on Groq pricing
  calculateCost(model, inputTokens, outputTokens) {
    const pricing = {
      'llama-3.1-8b-instant': { input: 0.05, output: 0.10 },
      'llama-3.1-70b-instant': { input: 0.59, output: 0.79 },
      'mixtral-8x7b-32768': { input: 0.27, output: 0.27 },
      'gemma-7b-it': { input: 0.07, output: 0.07 },
    };

    const modelPricing = pricing[model] || pricing['llama-3.1-8b-instant'];
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
}
