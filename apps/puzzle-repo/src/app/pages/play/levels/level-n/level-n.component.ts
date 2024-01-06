import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import {
  BoardCanvasComponent,
  BoardInfoComponent,
} from '@puzzle-repo/puzzle-ui-components';

@Component({
  selector: 'puzzle-repo-level-n',
  standalone: true,
  imports: [CommonModule, BoardCanvasComponent, BoardInfoComponent],
  templateUrl: './level-n.component.html',
  styleUrl: './level-n.component.scss',
})
export class LevelNComponent {
  private activatedRoute = inject(ActivatedRoute);
  levelId = this.activatedRoute.params.pipe(map((p) => p['id']));
}
