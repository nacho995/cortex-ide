import { Component, inject, output } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding {
  private project = inject(ProjectService);
  done = output<void>();

  selectMode(mode: 'agent' | 'editor') {
    this.project.layoutMode.set(mode);
    localStorage.setItem('cortex.layoutMode', mode);
    localStorage.setItem('cortex.onboarded', 'true');
    this.done.emit();
  }
}
