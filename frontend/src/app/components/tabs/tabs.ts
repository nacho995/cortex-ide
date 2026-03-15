import { Component, inject } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs {
  project = inject(ProjectService);

  close(e: Event, i: number) {
    e.stopPropagation();
    this.project.closeTab(i);
  }

  setActive(i: number) {
    this.project.activeTabIndex.set(i);
  }
}
