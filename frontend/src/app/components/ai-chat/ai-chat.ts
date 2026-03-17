import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { AiProvider, AiSettingsService } from '../../services/ai-settings.service';
import { ProjectService } from '../../services/project.service';
import { TokenMetricsService } from '../../services/token-metrics.service';
import { TokenBar } from '../token-bar/token-bar';
import { AgentFlowService } from '../../services/agent-flow.service';
import { OrchestratorService } from '../../services/orchestrator.service';
import { OrchestratorPlan } from '../orchestrator-plan/orchestrator-plan';
import { AgentMindMap } from '../agent-mind-map/agent-mind-map';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat',
  imports: [FormsModule, DecimalPipe, TokenBar, OrchestratorPlan, AgentMindMap],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.scss',
})
export class AiChat implements AfterViewChecked {
  @ViewChild('messagesEl') messagesEl!: ElementRef;

  ai = inject(AiService);
  aiSettings = inject(AiSettingsService);
  project = inject(ProjectService);
  tokenMetrics = inject(TokenMetricsService);
  flow = inject(AgentFlowService);
  private orchestrator = inject(OrchestratorService);
  providers: AiProvider[] = ['gemini', 'codex', 'anthropic'];
  showMindMap = signal(false);

  msgs = signal<ChatMessage[]>([
    {
      role: 'ai',
      text: 'Hello! I\'m Cortex AI. I can help you write, edit, and review code. What would you like to work on?',
      timestamp: new Date()
    }
  ]);
  input = '';
  loading = signal(false);

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.messagesEl) {
      const el = this.messagesEl.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  onEnter(e: Event) {
    const ke = e as KeyboardEvent;
    if (!ke.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  send() {
    const m = this.input.trim();
    if (!m || this.loading()) return;
    this.input = '';

    this.msgs.update(ms => [...ms, { role: 'user', text: m, timestamp: new Date() }]);
    this.loading.set(true);
    this.tokenMetrics.updateStreamingEstimate(m.length);
    this.flow.simulateTask(m);
    this.orchestrator.simulatePlan(m);

    this.ai.chat(m, this.project.projectPath()).subscribe({
      next: r => {
        this.loading.set(false);
        const text = r.response || r.message || r.result || JSON.stringify(r, null, 2);
        this.msgs.update(ms => [...ms, { role: 'ai', text, timestamp: new Date() }]);
        this.tokenMetrics.recordRequest(
          this.aiSettings.model() || 'claude-sonnet-4-6',
          1247,
          389
        );
      },
      error: e => {
        this.loading.set(false);
        this.tokenMetrics.isStreaming.set(false);
        this.msgs.update(ms => [...ms, {
          role: 'ai',
          text: `Error: ${e.message || 'Failed to connect to AI service'}`,
          timestamp: new Date()
        }]);
      },
    });
  }

  clearChat() {
    this.msgs.set([{
      role: 'ai',
      text: 'Chat cleared. How can I help you?',
      timestamp: new Date()
    }]);
  }

  setProvider(provider: AiProvider) {
    this.aiSettings.setProvider(provider);
  }

  setModel(model: string) {
    this.aiSettings.setModel(model);
  }

  estimateCurrentCost(): number {
    const tokens = this.tokenMetrics.streamingTokenEstimate();
    return (tokens / 1000) * 0.015; // approximate output cost
  }

  configureApiKey() {
    const provider = this.aiSettings.provider();
    const current = this.aiSettings.getApiKey(provider);
    const promptValue = prompt(
      `Set API key for ${provider} (${this.aiSettings.model()})`,
      current
    );
    if (promptValue === null) return;
    this.aiSettings.setApiKey(provider, promptValue);
  }
}
