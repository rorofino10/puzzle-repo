import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Board,
  Error,
  FILE,
  GameState,
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
  @Output() moveEvent = new EventEmitter<Move>();

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
    this.sendMove(move);
    this.selectedPieceSquare = null;
    this.selectedSquare = null;
  }

  sendMove(move: Move) {
    this.moveEvent.emit(move);
  }
}
