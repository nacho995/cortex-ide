import {
  Component, inject, ElementRef, ViewChild,
  AfterViewInit, OnDestroy, effect
} from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { FileService } from '../../services/file.service';

declare const monaco: any;

@Component({
  selector: 'app-editor',
  imports: [],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor implements AfterViewInit, OnDestroy {
  @ViewChild('container') container!: ElementRef;

  project = inject(ProjectService);
  fileService = inject(FileService);

  private editor: any = null;
  private currentPath = '';
  private monacoLoaded = false;

  ngAfterViewInit() {
    this.loadMonaco();
  }

  private loadMonaco() {
    if ((window as any).monaco) {
      this.createEditor();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
    script.onload = () => {
      (window as any).require.config({
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }
      });
      (window as any).require(['vs/editor/editor.main'], () => {
        this.monacoLoaded = true;
        this.createEditor();
      });
    };
    document.head.appendChild(script);
  }

  private createEditor() {
    monaco.editor.defineTheme('cortex', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'type', foreground: 'ffa657' },
        { token: 'function', foreground: 'd2a8ff' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b22',
        'editorCursor.foreground': '#58a6ff',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#8b949e',
        'editor.selectionBackground': '#264f78',
        'editorIndentGuide.background': '#21262d',
        'editorBracketMatch.background': '#17e5e633',
        'editorBracketMatch.border': '#17e5e6',
      }
    });

    this.editor = monaco.editor.create(this.container.nativeElement, {
      value: '',
      language: 'javascript',
      theme: 'cortex',
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontLigatures: true,
      minimap: { enabled: true, scale: 1 },
      automaticLayout: true,
      tabSize: 2,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      bracketPairColorization: { enabled: true },
      padding: { top: 10, bottom: 10 },
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      wordWrap: 'off',
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      suggest: { showKeywords: true },
    });

    // Ctrl+S to save
    this.editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => this.save()
    );

    // Track content changes
    this.editor.onDidChangeModelContent(() => {
      const idx = this.project.activeTabIndex();
      if (idx >= 0) {
        this.project.updateTabContent(idx, this.editor.getValue());
      }
    });

    // React to tab changes
    effect(() => {
      const tab = this.project.activeTab();
      if (tab && tab.path !== this.currentPath && this.editor) {
        this.currentPath = tab.path;
        this.editor.setValue(tab.content);
        const model = this.editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, tab.language || 'plaintext');
        }
      }
    });
  }

  private save() {
    const tab = this.project.activeTab();
    if (!tab) return;
    this.fileService.writeFile(tab.path, this.editor.getValue()).subscribe(() => {
      this.project.markTabSaved(this.project.activeTabIndex());
    });
  }

  ngOnDestroy() {
    this.editor?.dispose();
  }
}
