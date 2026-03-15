import { Component, inject } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  project = inject(ProjectService);

  openProject() {
    const path = prompt('Project path:');
    if (path) this.project.setProject(path);
  }
}
