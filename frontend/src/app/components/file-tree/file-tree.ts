import { Component, inject, signal, effect } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FileService, FileNode } from '../../services/file.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-file-tree',
  imports: [NgTemplateOutlet],
  templateUrl: './file-tree.html',
  styleUrl: './file-tree.scss',
})
export class FileTree {
  fileService = inject(FileService);
  project = inject(ProjectService);
  tree = signal<FileNode | null>(null);
  expanded = signal<Set<string>>(new Set());

  constructor() {
    effect(() => {
      const path = this.project.projectPath();
      if (path) {
        this.fileService.getTree(path).subscribe(t => this.tree.set(t));
      }
    });
  }

  click(node: FileNode) {
    if (node.type === 'directory') {
      const e = new Set(this.expanded());
      e.has(node.path) ? e.delete(node.path) : e.add(node.path);
      this.expanded.set(e);
    } else {
      this.fileService.readFile(node.path).subscribe(f =>
        this.project.openFile(f.path, node.name, f.language, f.content)
      );
    }
  }

  isExpanded(path: string): boolean {
    return this.expanded().has(path);
  }

  getFileIcon(node: FileNode): string {
    if (node.type === 'directory') {
      return this.isExpanded(node.path) ? '📂' : '📁';
    }
    const ext = node.name.split('.').pop()?.toLowerCase();
    const icons: Record<string, string> = {
      ts: '🔷', js: '🟨', html: '🟧', css: '🎨', scss: '🎨',
      json: '📋', md: '📝', py: '🐍', java: '☕', rs: '🦀',
      go: '🐹', rb: '💎', php: '🐘', sh: '⚙️', yml: '⚙️', yaml: '⚙️',
    };
    return icons[ext || ''] || '📄';
  }
}
