// Pricing data for different AI providers

export const getPricing = (provider, model) => {
  const pricing = {
    openai: {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 }
    },
    anthropic: {
      'claude-3-opus': { input: 0.015, output: 0.075 },
      'claude-3-sonnet': { input: 0.003, output: 0.015 },
      'claude-3-haiku': { input: 0.00025, output: 0.00125 }
    },
    google: {
      'gemini-pro': { input: 0.0005, output: 0.0015 },
      'palm-2': { input: 0.0003, output: 0.0004 }
    },
    meta: {
      'llama-2-70b': { input: 0.001, output: 0.001 }
    }
  };

  return pricing[provider]?.[model] || { input: 0, output: 0 };
};

export default { getPricing };
