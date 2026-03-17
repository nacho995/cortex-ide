import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OrchestratorService } from '../../services/orchestrator.service';

@Component({
  selector: 'app-orchestrator-plan',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './orchestrator-plan.html',
  styleUrl: './orchestrator-plan.scss'
})
export class OrchestratorPlan {
  orch = inject(OrchestratorService);

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return '○';
      case 'working': return '⟳';
      case 'done': return '✅';
      case 'error': return '❌';
      default: return '○';
    }
  }
}
