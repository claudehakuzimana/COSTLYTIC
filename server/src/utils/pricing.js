export const providerPricing = {
  openai: {
    "gpt-4o": { input: 0.005 / 1000, output: 0.015 / 1000 },
    "gpt-4o-mini": { input: 0.00015 / 1000, output: 0.0006 / 1000 },
    "gpt-3.5-turbo": { input: 0.0005 / 1000, output: 0.0015 / 1000 }
  },
  anthropic: {
    "claude-3-5-sonnet": { input: 0.003 / 1000, output: 0.015 / 1000 },
    "claude-3-haiku": { input: 0.00025 / 1000, output: 0.00125 / 1000 }
  },
  google: {
    "gemini-1.5-pro": { input: 0.0035 / 1000, output: 0.0105 / 1000 },
    "gemini-1.0-pro": { input: 0.0005 / 1000, output: 0.0015 / 1000 }
  },
  aws_bedrock: {
    "claude-3-5-sonnet": { input: 0.003 / 1000, output: 0.015 / 1000 },
    "llama-3-1-70b": { input: 0.0025 / 1000, output: 0.003 / 1000 }
  },
  mistral: {
    "mistral-large": { input: 0.002 / 1000, output: 0.006 / 1000 },
    "mixtral-8x7b": { input: 0.0007 / 1000, output: 0.0007 / 1000 }
  },
  cohere: {
    "command-r-plus": { input: 0.003 / 1000, output: 0.015 / 1000 },
    "command-r": { input: 0.0005 / 1000, output: 0.0015 / 1000 }
  },
  openrouter: {
    "openai/gpt-4o-mini": { input: 0.00015 / 1000, output: 0.0006 / 1000 },
    "openai/gpt-4o": { input: 0.0025 / 1000, output: 0.01 / 1000 }
  },
  groq: {
    "llama-3.1-8b-instant": { input: 0.00005 / 1000, output: 0.0001 / 1000 },
    "llama-3.1-70b-instant": { input: 0.00059 / 1000, output: 0.00079 / 1000 }
  },
  meta: {
    "llama-2-70b": { input: 0.001 / 1000, output: 0.002 / 1000 }
  }
};

export const getPricing = (provider, model) => {
  const safeProvider = providerPricing[provider?.toLowerCase()] || {};
  return safeProvider[model] || { input: 0.002 / 1000, output: 0.006 / 1000 };
};

export const estimateTokenCost = ({ provider, model, tokensInput, tokensOutput }) => {
  const pricing = getPricing(provider, model);
  const inputCost = tokensInput * pricing.input;
  const outputCost = tokensOutput * pricing.output;
  const total = Number((inputCost + outputCost).toFixed(6));

  return {
    inputCost: Number(inputCost.toFixed(6)),
    outputCost: Number(outputCost.toFixed(6)),
    total
  };
};
