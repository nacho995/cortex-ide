import { Injectable, signal, computed } from '@angular/core';

export interface AgentNode {
  id: string;
  name: string;
  icon: string;
  status: 'waiting' | 'working' | 'done' | 'error';
  task: string;
  tokensUsed: number;
  startTime?: number;
  endTime?: number;
  invokedBy?: string;
  invokedAgents: string[];
}

@Injectable({ providedIn: 'root' })
export class AgentFlowService {
  agents = signal<AgentNode[]>([]);
  isActive = signal(false);
  taskStartTime = signal(0);
  totalTokens = computed(() => this.agents().reduce((sum, a) => sum + a.tokensUsed, 0));
  elapsedSeconds = signal(0);
  private timerInterval: any = null;

  startTask(description: string) {
    this.isActive.set(true);
    this.taskStartTime.set(Date.now());
    this.elapsedSeconds.set(0);
    this.agents.set([
      { id: 'orchestrator', name: 'Orchestrator', icon: '🧠', status: 'working', task: 'Analyzing: ' + description, tokensUsed: 0, invokedAgents: [] },
      { id: 'backend', name: 'Backend', icon: '⚙️', status: 'waiting', task: '', tokensUsed: 0, invokedAgents: [] },
      { id: 'frontend-agent', name: 'Frontend', icon: '🎨', status: 'waiting', task: '', tokensUsed: 0, invokedAgents: [] },
      { id: 'researcher', name: 'Researcher', icon: '🔍', status: 'waiting', task: '', tokensUsed: 0, invokedAgents: [] },
      { id: 'tester', name: 'Tester', icon: '🧪', status: 'waiting', task: '', tokensUsed: 0, invokedAgents: [] },
      { id: 'reviewer', name: 'Reviewer', icon: '👁️', status: 'waiting', task: '', tokensUsed: 0, invokedAgents: [] },
    ]);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds.update(s => s + 1);
    }, 1000);
  }

  updateAgent(agentId: string, update: Partial<AgentNode>) {
    this.agents.update(agents =>
      agents.map(a => a.id === agentId ? { ...a, ...update } : a)
    );
  }

  endTask() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    // Mark all remaining as done
    this.agents.update(agents =>
      agents.map(a => a.status === 'working' ? { ...a, status: 'done' as const } : a)
    );
    // Deactivate after delay
    setTimeout(() => this.isActive.set(false), 2000);
  }

  // Mock simulation for demo
  simulateTask(description: string) {
    this.startTask(description);

    setTimeout(() => {
      this.updateAgent('orchestrator', { status: 'done', tokensUsed: 342, task: 'Plan created: 4 subtasks' });
      this.updateAgent('researcher', { status: 'working', task: 'Searching documentation...', invokedBy: 'orchestrator' });
      this.updateAgent('backend', { status: 'working', task: 'Implementing endpoint...', invokedBy: 'orchestrator' });
    }, 1500);

    setTimeout(() => {
      this.updateAgent('researcher', { status: 'done', tokensUsed: 891, task: 'Found 3 relevant patterns' });
    }, 3500);

    setTimeout(() => {
      this.updateAgent('backend', { status: 'done', tokensUsed: 2341, task: 'Endpoint implemented' });
      this.updateAgent('tester', { status: 'working', task: 'Generating tests...', invokedBy: 'backend' });
    }, 5000);

    setTimeout(() => {
      this.updateAgent('tester', { status: 'done', tokensUsed: 1203, task: '4 tests generated' });
      this.updateAgent('reviewer', { status: 'working', task: 'Reviewing changes...', invokedBy: 'orchestrator' });
    }, 7000);

    setTimeout(() => {
      this.updateAgent('reviewer', { status: 'done', tokensUsed: 567, task: 'Approved with 1 suggestion' });
      this.endTask();
    }, 9000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
