import { Component, inject } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  project = inject(ProjectService);

  open() {
    const p = prompt('Enter project path:');
    if (p) this.project.setProject(p);
  }
}
