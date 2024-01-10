import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  booleanAttribute,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Board,
  FILE,
  FILE_STRING_MAP,
  Index,
  IndexToSquare,
  Move,
  RANK,
  Square,
} from '@puzzle-repo/puzzle-move-generator';
import { BoardFilePipe } from './board_file.pipe';

@Component({
  selector: 'board-canvas',
  standalone: true,
  templateUrl: './board-canvas.component.html',
  styleUrl: './board-canvas.component.css',
  imports: [CommonModule, BoardFilePipe],
})
export class BoardCanvasComponent {
  protected readonly _showCoordinates = signal(true);

  @Input({ transform: booleanAttribute })
  set showCoordinates(value: boolean) {
    this._showCoordinates.set(value);
  }
  protected readonly _previewOnly = signal(false);

  @Input({ transform: booleanAttribute })
  set previewOnly(value: boolean) {
    this._previewOnly.set(value);
  }

  @Output() goToEvent = new EventEmitter<number>();
  @Output() undoEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();
  @Output() redoEvent = new EventEmitter();
  @Output() moveEvent = new EventEmitter<Move>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this._previewOnly()) return;
    const key = event.key;
    if (key === 'ArrowLeft') {
      this.undoEvent.emit();
    }
    if (key === 'ArrowRight') {
      this.redoEvent.emit();
    }
    if (key === 'Delete') {
      console.log('Reset!');
      this.resetEvent.emit();
    }
    if (!isNaN(+key)) {
      this.goToEvent.emit(+key);
    }
  }

  @Input({ required: true }) board!: Board;

  files = Array(8)
    .fill(0)
    .map((x, i) => FILE_STRING_MAP[i]);
  ranks = Array(8)
    .fill(0)
    .map((x, i) => i + 1);
  squares = Array(64)
    .fill(0)
    .map((x, i) => IndexToSquare(i as Index));

  selectedPieceSquare: Square | null = null;
  selectedSquare: Square | null = null;

  setSelectedPiece(file: FILE, rank: RANK) {
    if (this._previewOnly()) return;

    this.selectedPieceSquare = Square(rank, file);
  }
  setSelectedSquare(file: FILE, rank: RANK) {
    if (this._previewOnly()) return;

    if (!this.selectedPieceSquare) return;
    this.selectedSquare = Square(rank, file);
    const move = Move(this.selectedPieceSquare, this.selectedSquare);
    this.sendMove(move);
    this.selectedPieceSquare = null;
    this.selectedSquare = null;
  }

  sendMove(move: Move) {
    if (this._previewOnly()) return;
    this.moveEvent.emit(move);
  }
}
