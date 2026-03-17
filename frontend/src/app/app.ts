import { Component, inject } from '@angular/core';
import { FileTree } from './components/file-tree/file-tree';
import { Editor } from './components/editor/editor';
import { Terminal } from './components/terminal/terminal';
import { AiChat } from './components/ai-chat/ai-chat';
import { Toolbar } from './components/toolbar/toolbar';
import { StatusBar } from './components/status-bar/status-bar';
import { Tabs } from './components/tabs/tabs';
import { Welcome } from './components/welcome/welcome';
import { ProjectService } from './services/project.service';
import { UiPreferencesService } from './services/ui-preferences.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FileTree, Editor, Terminal,
    AiChat, Toolbar, StatusBar,
    Tabs, Welcome,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  project = inject(ProjectService);
  ui = inject(UiPreferencesService);
}
