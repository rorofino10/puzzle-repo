import { Component, Input, OnInit } from '@angular/core';
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
  @Input({ required: true }) board!: Board;

  ngOnChanges(): void {
    console.log(this.board);
  }
}
