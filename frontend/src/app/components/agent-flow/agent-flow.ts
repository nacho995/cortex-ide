import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AgentFlowService, AgentNode } from '../../services/agent-flow.service';

@Component({
  selector: 'app-agent-flow',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './agent-flow.html',
  styleUrl: './agent-flow.scss'
})
export class AgentFlow {
  flow = inject(AgentFlowService);

  activeAgents(): AgentNode[] {
    return this.flow.agents().filter(a => a.status !== 'waiting');
  }

  waitingAgents(): AgentNode[] {
    return this.flow.agents().filter(a => a.status === 'waiting');
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'waiting': return '○';
      case 'working': return '⟳';
      case 'done': return '✓';
      case 'error': return '✗';
      default: return '○';
    }
  }
}
