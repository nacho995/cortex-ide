import { Injectable, signal, computed } from '@angular/core';

export interface OpenTab {
  path: string;
  name: string;
  language: string;
  content: string;
  modified: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  projectPath = signal<string>('');
  projectName = signal<string>('');
  openTabs = signal<OpenTab[]>([]);
  activeTabIndex = signal<number>(-1);
  sidebarVisible = signal<boolean>(true);
  terminalVisible = signal<boolean>(true);
  aiPanelVisible = signal<boolean>(true);

  activeTab = computed(() => {
    const tabs = this.openTabs();
    const idx = this.activeTabIndex();
    return idx >= 0 && idx < tabs.length ? tabs[idx] : null;
  });

  openFile(path: string, name: string, language: string, content: string) {
    const tabs = this.openTabs();
    const existing = tabs.findIndex(t => t.path === path);
    if (existing >= 0) {
      this.activeTabIndex.set(existing);
      return;
    }
    this.openTabs.set([...tabs, { path, name, language, content, modified: false }]);
    this.activeTabIndex.set(tabs.length);
  }

  closeTab(index: number) {
    const tabs = [...this.openTabs()];
    tabs.splice(index, 1);
    this.openTabs.set(tabs);
    if (this.activeTabIndex() >= tabs.length) {
      this.activeTabIndex.set(tabs.length - 1);
    }
  }

  updateTabContent(index: number, content: string) {
    const tabs = [...this.openTabs()];
    if (tabs[index]) {
      tabs[index] = { ...tabs[index], content, modified: true };
      this.openTabs.set(tabs);
    }
  }

  markTabSaved(index: number) {
    const tabs = [...this.openTabs()];
    if (tabs[index]) {
      tabs[index] = { ...tabs[index], modified: false };
      this.openTabs.set(tabs);
    }
  }

  setProject(path: string) {
    this.projectPath.set(path);
    const parts = path.split('/');
    this.projectName.set(parts[parts.length - 1]);
  }

  toggleSidebar() { this.sidebarVisible.update(v => !v); }
  toggleTerminal() { this.terminalVisible.update(v => !v); }
  toggleAiPanel() { this.aiPanelVisible.update(v => !v); }
}
