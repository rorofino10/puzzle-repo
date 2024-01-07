import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Board,
  FILE,
  Index,
  IndexToSquare,
  Move,
  MoveToString,
  RANK,
  Result,
  Square,
  Success,
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

  selectedPieceSquare: Square | null = null;
  selectedSquare: Square | null = null;

  setSelectedPiece(file: FILE, rank: RANK) {
    this.selectedPieceSquare = Square(rank, file);
  }
  setSelectedSquare(file: FILE, rank: RANK) {
    if (!this.selectedPieceSquare) return;
    this.selectedSquare = Square(rank, file);
    const move = Move(this.selectedPieceSquare, this.selectedSquare);
    const res = this.inputMove(move);
    if (res !== Success.MOVE_SUCCESS) return;
    console.log(this.board.moveHistory.length, MoveToString(move));
  }

  inputMove(move: Move): Result {
    this.selectedPieceSquare = null;
    this.selectedSquare = null;

    return this.board.inputMove(move);
  }
}
