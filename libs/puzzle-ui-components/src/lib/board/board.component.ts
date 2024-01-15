import {
  Component,
  EventEmitter,
  Input,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Board,
  BoardState,
  Move,
  MoveToString,
  BoardError,
} from '@puzzle-repo/puzzle-move-generator';
import { BoardCanvasComponent } from '../board-canvas/board-canvas.component';
import { BoardInfoComponent } from '../board-info/board-info.component';
import { BoardSuccess, isBoardError } from '@puzzle-repo/puzzle-move-generator';
import { BoardStateDialogComponent } from './board-state-dialog/board-state-dialog.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { solve } from '@puzzle-repo/puzzle-engine';

@Component({
  selector: 'board',
  standalone: true,
  imports: [
    CommonModule,
    BoardCanvasComponent,
    BoardInfoComponent,
    BoardStateDialogComponent,
    HlmButtonDirective,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @Input({ required: true }) board!: Board;
  @Input({ required: true }) showInfo!: boolean;
  protected readonly boardState = signal<BoardState>(BoardState.UNDEFINED);
  protected readonly moves = signal<Move[]>([]);

  inputRandomMove(): void {
    const moves = this.board.currentLegalMoves;
    const move = getRandomMove(moves);
    if (!move) {
      this.resetBoard();
      return;
    }
    const res = this.board.inputMove(move);
    res === BoardState.WIN ? console.log('YOU WONN') : true;
  }

  inputMove(move: Move): void {
    const res = this.board.inputMove(move);
    this.moves.set(this.board.allMovesHistory);
    this.boardState.set(this.board.gameState);

    if (Object.values(BoardError).includes(res as BoardError)) {
      // Implement alert dialog
      console.error(res);
      return;
    }
  }
  undoMove(): void {
    this.board.undoMove();
  }
  goToMove(turn: number): void {
    const res = this.board.goToMove(turn);
    if (isBoardError(res)) {
      console.error(res);
      return;
    }
    const lastMove = this.board.moveHistory[this.board.moveHistory.length - 1];
    if (!lastMove) return;
    const lastMoveString = MoveToString(lastMove);
    console.log(this.board.moveHistory.length, lastMoveString);
  }
  redoMove(): void {
    this.board.redoMove();
  }
  resetBoard(): void {
    this.board.resetBoard();
  }

  logMoves(): void {
    const moveHistoryString = this.board.moveHistory.map((move) =>
      MoveToString(move)
    );
    const undoHistoryString = this.board.undoHistory.map((move) =>
      MoveToString(move)
    );
    console.log(moveHistoryString);
    console.log(undoHistoryString);
  }
  trySolve(): void {
    console.log('Solve Start');
    console.time('solve');
    solve(this.board).forEach((position) => {
      console.log(position.moves.map((move) => MoveToString(move)));
    });
    console.timeEnd('solve');
  }
}

function getRandomMove(array: Move[]): Move | undefined {
  if (array.length === 0) {
    return undefined; // Return undefined for an empty array
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
