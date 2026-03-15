import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TerminalService } from '../../services/terminal.service';
import { ProjectService } from '../../services/project.service';

interface TerminalLine {
  text: string;
  type: 'output' | 'command' | 'error' | 'info';
}

@Component({
  selector: 'app-terminal',
  imports: [FormsModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss',
})
export class Terminal implements AfterViewChecked {
  @ViewChild('outputEl') outputEl!: ElementRef;

  ts = inject(TerminalService);
  project = inject(ProjectService);

  lines = signal<TerminalLine[]>([
    { text: 'Cortex IDE Terminal — ready', type: 'info' }
  ]);
  cmd = '';
  loading = signal(false);

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.outputEl) {
      const el = this.outputEl.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  run() {
    const c = this.cmd.trim();
    if (!c || this.loading()) return;
    this.cmd = '';
    this.lines.update(l => [...l, { text: `$ ${c}`, type: 'command' }]);
    this.loading.set(true);

    this.ts.execute(c, this.project.projectPath()).subscribe({
      next: r => {
        this.loading.set(false);
        const outputLines = r.output.split('\n')
          .filter(line => line !== undefined)
          .map(text => ({ text, type: 'output' as const }));
        this.lines.update(l => [...l, ...outputLines]);
      },
      error: e => {
        this.loading.set(false);
        this.lines.update(l => [...l, {
          text: `Error: ${e.message || 'Command failed'}`,
          type: 'error'
        }]);
      },
    });
  }

  clear() {
    this.lines.set([{ text: 'Terminal cleared', type: 'info' }]);
  }
}
