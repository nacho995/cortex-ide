import { Component, inject, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AgentFlowService, AgentNode } from '../../services/agent-flow.service';

@Component({
  selector: 'app-agent-mind-map',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './agent-mind-map.html',
  styleUrl: './agent-mind-map.scss'
})
export class AgentMindMap {
  flow = inject(AgentFlowService);
  close = output<void>();
  selectedAgent = input<AgentNode | null>(null);
  private _selectedAgent: AgentNode | null = null;

  selectAgent(agent: AgentNode) {
    this._selectedAgent = agent;
  }

  getSelected(): AgentNode | null {
    return this._selectedAgent;
  }

  getNodeSize(agent: AgentNode): number {
    // Size proportional to tokens used (min 60, max 120)
    const base = 60;
    const tokens = agent.tokensUsed || 0;
    return Math.min(base + tokens / 30, 120);
  }

  getNodeColor(status: string): string {
    switch (status) {
      case 'done': return '#3fb950';
      case 'working': return '#58a6ff';
      case 'error': return '#f85149';
      default: return '#484f58';
    }
  }

  getEdgeLabel(agent: AgentNode): string {
    if (agent.invokedBy) return 'delegated';
    return '';
  }

  onClose() {
    this.close.emit();
  }
}
