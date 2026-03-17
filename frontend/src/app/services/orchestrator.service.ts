import { Injectable, signal, computed } from '@angular/core';

export interface Subtask {
  id: string;
  description: string;
  agent: string;
  agentIcon: string;
  status: 'pending' | 'working' | 'done' | 'error';
  tokensUsed: number;
}

@Injectable({ providedIn: 'root' })
export class OrchestratorService {
  taskDescription = signal('');
  subtasks = signal<Subtask[]>([]);
  isActive = signal(false);

  completedCount = computed(() => this.subtasks().filter(s => s.status === 'done').length);
  totalCount = computed(() => this.subtasks().length);
  progress = computed(() => {
    const total = this.totalCount();
    return total > 0 ? (this.completedCount() / total) * 100 : 0;
  });

  startPlan(description: string, subtasks: Subtask[]) {
    this.taskDescription.set(description);
    this.subtasks.set(subtasks);
    this.isActive.set(true);
  }

  updateSubtask(id: string, update: Partial<Subtask>) {
    this.subtasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, ...update } : t)
    );
  }

  endPlan() {
    setTimeout(() => this.isActive.set(false), 3000);
  }

  // Mock simulation
  simulatePlan(description: string) {
    const agentMap: Record<string, string> = {
      'orchestrator': '🧠', 'researcher': '🔍', 'backend': '⚙️',
      'frontend-agent': '🎨', 'tester': '🧪', 'reviewer': '👁️'
    };

    this.startPlan(description, [
      { id: '1', description: 'Analyze current architecture', agent: 'orchestrator', agentIcon: '🧠', status: 'pending', tokensUsed: 0 },
      { id: '2', description: 'Research best patterns', agent: 'researcher', agentIcon: '🔍', status: 'pending', tokensUsed: 0 },
      { id: '3', description: 'Implement core logic', agent: 'backend', agentIcon: '⚙️', status: 'pending', tokensUsed: 0 },
      { id: '4', description: 'Build UI components', agent: 'frontend-agent', agentIcon: '🎨', status: 'pending', tokensUsed: 0 },
      { id: '5', description: 'Generate tests', agent: 'tester', agentIcon: '🧪', status: 'pending', tokensUsed: 0 },
      { id: '6', description: 'Final code review', agent: 'reviewer', agentIcon: '👁️', status: 'pending', tokensUsed: 0 },
    ]);

    // Simulate progress
    setTimeout(() => this.updateSubtask('1', { status: 'working' }), 500);
    setTimeout(() => this.updateSubtask('1', { status: 'done', tokensUsed: 234 }), 2000);
    setTimeout(() => this.updateSubtask('2', { status: 'working' }), 2500);
    setTimeout(() => this.updateSubtask('2', { status: 'done', tokensUsed: 891 }), 4000);
    setTimeout(() => this.updateSubtask('3', { status: 'working' }), 4500);
    setTimeout(() => this.updateSubtask('3', { status: 'done', tokensUsed: 2341 }), 7000);
    setTimeout(() => this.updateSubtask('4', { status: 'working' }), 7500);
    setTimeout(() => this.updateSubtask('4', { status: 'done', tokensUsed: 1567 }), 9000);
    setTimeout(() => this.updateSubtask('5', { status: 'working' }), 9500);
    setTimeout(() => this.updateSubtask('5', { status: 'done', tokensUsed: 1203 }), 11000);
    setTimeout(() => this.updateSubtask('6', { status: 'working' }), 11500);
    setTimeout(() => {
      this.updateSubtask('6', { status: 'done', tokensUsed: 567 });
      this.endPlan();
    }, 13000);
  }
}
