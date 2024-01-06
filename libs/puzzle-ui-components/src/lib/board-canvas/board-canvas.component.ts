import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board } from '@puzzle-repo/puzzle-move-generator';

@Component({
  selector: 'board-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-canvas.component.html',
  styleUrl: './board-canvas.component.css',
})
export class BoardCanvasComponent {
  @Input() board: Board = Board.EMPTY();
}
