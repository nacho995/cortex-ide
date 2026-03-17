import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { BackgroundMode, UiPreferencesService } from '../../services/ui-preferences.service';

@Component({
  selector: 'app-toolbar',
  imports: [FormsModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  project = inject(ProjectService);
  ui = inject(UiPreferencesService);
  backgroundModes: BackgroundMode[] = ['default', 'midnight', 'aurora'];

  openProject() {
    const path = prompt('Project path:');
    if (path) this.project.setProject(path);
  }

  setBackground(mode: BackgroundMode) {
    this.ui.setBackground(mode);
  }

  toggleMatrixRain() {
    this.ui.setMatrixRainEnabled(!this.ui.matrixRainEnabled());
  }
}
