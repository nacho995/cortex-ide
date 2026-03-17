import { Injectable } from '@angular/core';

export interface ModelPricing {
  inputK: number;   // € per 1000 input tokens
  outputK: number;  // € per 1000 output tokens
}

const MODEL_PRICING: Record<string, ModelPricing> = {
  'claude-haiku-4-5':    { inputK: 0.001, outputK: 0.002 },
  'claude-sonnet-4-6':   { inputK: 0.003, outputK: 0.015 },
  'claude-opus-4-6':     { inputK: 0.015, outputK: 0.075 },
  'gpt-4o':              { inputK: 0.005, outputK: 0.015 },
  'gpt-4o-mini':         { inputK: 0.0002, outputK: 0.0006 },
  'o3':                  { inputK: 0.010, outputK: 0.040 },
  'o4-mini':             { inputK: 0.003, outputK: 0.012 },
  'gemini-2.5-pro':      { inputK: 0.002, outputK: 0.010 },
  'gemini-2.5-flash':    { inputK: 0.0003, outputK: 0.0015 },
  'codex-mini-latest':   { inputK: 0.0015, outputK: 0.006 },
  'llama-3.3-70b':       { inputK: 0.0, outputK: 0.0 },
};

@Injectable({ providedIn: 'root' })
export class TokenPricingService {

  getPricing(model: string): ModelPricing {
    return MODEL_PRICING[model] || { inputK: 0.003, outputK: 0.015 };
  }

  calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = this.getPricing(model);
    return (inputTokens / 1000) * pricing.inputK + (outputTokens / 1000) * pricing.outputK;
  }

  getAllModels(): string[] {
    return Object.keys(MODEL_PRICING);
  }
}
