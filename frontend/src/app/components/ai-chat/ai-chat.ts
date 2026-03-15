import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { ProjectService } from '../../services/project.service';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat',
  imports: [FormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.scss',
})
export class AiChat implements AfterViewChecked {
  @ViewChild('messagesEl') messagesEl!: ElementRef;

  ai = inject(AiService);
  project = inject(ProjectService);

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

    this.ai.edit(m, this.project.projectPath()).subscribe({
      next: r => {
        this.loading.set(false);
        const text = r.response || r.message || r.result || JSON.stringify(r, null, 2);
        this.msgs.update(ms => [...ms, { role: 'ai', text, timestamp: new Date() }]);
      },
      error: e => {
        this.loading.set(false);
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
}
