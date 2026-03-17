import { Injectable, signal, computed } from '@angular/core';
import { TokenPricingService } from './token-pricing.service';

export interface RequestMetrics {
  inputTokens: number;
  outputTokens: number;
  cost: number;
  model: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class TokenMetricsService {
  private pricing = new TokenPricingService();

  // Current request
  lastRequestInput = signal(0);
  lastRequestOutput = signal(0);
  lastRequestCost = signal(0);
  activeModel = signal('claude-sonnet-4-6');

  // Session totals
  sessionTotalInput = signal(0);
  sessionTotalOutput = signal(0);
  sessionTotalCost = signal(0);
  sessionRequestCount = signal(0);

  // Streaming estimate
  streamingTokenEstimate = signal(0);
  isStreaming = signal(false);

  // History
  requestHistory = signal<RequestMetrics[]>([]);

  // Computed
  sessionTotalTokens = computed(() => this.sessionTotalInput() + this.sessionTotalOutput());
  costLevel = computed(() => {
    const cost = this.sessionTotalCost();
    if (cost < 0.10) return 'low';
    if (cost < 0.50) return 'medium';
    return 'high';
  });

  recordRequest(model: string, inputTokens: number, outputTokens: number) {
    const cost = this.pricing.calculateCost(model, inputTokens, outputTokens);

    this.lastRequestInput.set(inputTokens);
    this.lastRequestOutput.set(outputTokens);
    this.lastRequestCost.set(cost);
    this.activeModel.set(model);

    this.sessionTotalInput.update(v => v + inputTokens);
    this.sessionTotalOutput.update(v => v + outputTokens);
    this.sessionTotalCost.update(v => v + cost);
    this.sessionRequestCount.update(v => v + 1);

    this.requestHistory.update(h => [...h, {
      inputTokens, outputTokens, cost, model, timestamp: new Date()
    }]);

    this.isStreaming.set(false);
    this.streamingTokenEstimate.set(0);
  }

  updateStreamingEstimate(charCount: number) {
    // ~1 token per 4 chars
    this.streamingTokenEstimate.set(Math.ceil(charCount / 4));
    this.isStreaming.set(true);
  }

  resetSession() {
    this.sessionTotalInput.set(0);
    this.sessionTotalOutput.set(0);
    this.sessionTotalCost.set(0);
    this.sessionRequestCount.set(0);
    this.requestHistory.set([]);
  }
}
