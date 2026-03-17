import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TokenMetricsService } from '../../services/token-metrics.service';
import { TokenPricingService } from '../../services/token-pricing.service';

@Component({
  selector: 'app-token-bar',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './token-bar.html',
  styleUrl: './token-bar.scss'
})
export class TokenBar {
  metrics = inject(TokenMetricsService);
  private pricing = inject(TokenPricingService);

  estimateStreamingCost(): number {
    const tokens = this.metrics.streamingTokenEstimate();
    return this.pricing.calculateCost(this.metrics.activeModel(), 0, tokens);
  }

  getCostPercentage(): number {
    // 1€ = 100%
    return Math.min(this.metrics.sessionTotalCost() * 100, 100);
  }
}
