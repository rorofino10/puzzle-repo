import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board, Move, MoveToString } from '@puzzle-repo/puzzle-move-generator';
@Component({
  selector: 'board-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-info.component.html',
  styleUrl: './board-info.component.css',
})
export class BoardInfoComponent {
  @Input({ required: true }) board!: Board;

  @Output() goToEvent = new EventEmitter<number>();
  @Output() undoEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();
  @Output() redoEvent = new EventEmitter();

  get allMovesHistory(): Move[] {
    return [
      ...this.board.moveHistory,
      ...[...this.board.undoHistory].reverse(),
    ];
  }
  sendGoTo(turn: number) {
    this.goToEvent.emit(turn);
  }
  sendUndo() {
    this.undoEvent.emit();
  }
  sendRedo() {
    this.redoEvent.emit();
  }
  sendReset() {
    this.resetEvent.emit();
  }
  MoveToString(move: Move): string {
    return MoveToString(move);
  }
}
