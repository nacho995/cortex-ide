import { Component, inject } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-status-bar',
  imports: [],
  templateUrl: './status-bar.html',
  styleUrl: './status-bar.scss',
})
export class StatusBar {
  project = inject(ProjectService);
}
