import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Board,
  Index,
  IndexToSquare,
  Move,
  Result,
  Square,
} from '@puzzle-repo/puzzle-move-generator';

@Component({
  selector: 'board-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-canvas.component.html',
  styleUrl: './board-canvas.component.css',
})
export class BoardCanvasComponent {
  @Input({ required: true }) board!: Board;
  squares = Array(64)
    .fill(0)
    .map((x, i) => IndexToSquare(i as Index));

  selectedPiece: Square | null = null;
  selectedSquare: Square | null = null;

  setSelectedPiece(event: any) {
    this.selectedPiece = Square(
      Number(event.target.attributes.rank.value),
      Number(event.target.attributes.file.value)
    );
  }
  setSelectedSquare(event: any) {
    this.selectedSquare = Square(
      Number(event.target.attributes.rank.value),
      Number(event.target.attributes.file.value)
    );
    if (!this.selectedPiece || !this.selectedSquare) return;
    const res = this.inputMove(Move(this.selectedPiece, this.selectedSquare));
    console.log(res);
  }
  inputMove(move: Move): Result {
    this.selectedPiece = null;
    this.selectedSquare = null;
    return this.board.inputMove(move);
  }
}
