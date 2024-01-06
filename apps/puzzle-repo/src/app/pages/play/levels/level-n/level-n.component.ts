import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, interval, map, takeUntil } from 'rxjs';
import {
  BoardCanvasComponent,
  BoardInfoComponent,
} from '@puzzle-repo/puzzle-ui-components';
import {
  Board,
  FILE,
  GameState,
  Move,
  RANK,
  RankFileToIndex,
  Square,
} from '@puzzle-repo/puzzle-move-generator';
import { BitBoard } from 'libs/puzzle-move-generator/src/lib/BitBoard/bitboard';

const piecesBitBoard = BitBoard.empty()
  .setBit(RankFileToIndex(RANK.FIVE, FILE.E))
  .setBit(RankFileToIndex(RANK.FIVE, FILE.C))
  .setBit(RankFileToIndex(RANK.FIVE, FILE.A))
  .setBit(RankFileToIndex(RANK.THREE, FILE.A))
  .setBit(RankFileToIndex(RANK.ONE, FILE.A));
const golden_piecesBitBoard = BitBoard.empty().setBit(
  RankFileToIndex(RANK.ONE, FILE.E)
);
const golden_squaresBitBoard = BitBoard.empty().setBit(
  RankFileToIndex(RANK.THREE, FILE.C)
);

const level12 = new Board(
  piecesBitBoard,
  golden_piecesBitBoard,
  golden_squaresBitBoard
);

@Component({
  selector: 'puzzle-repo-level-n',
  standalone: true,
  imports: [CommonModule, BoardCanvasComponent, BoardInfoComponent],
  templateUrl: './level-n.component.html',
  styleUrl: './level-n.component.scss',
})
export class LevelNComponent {
  currentTime: Date = new Date();
  inputRandomMove(): void {
    const moves = this.board.currentLegalMoves;
    const move = getRandomMove(moves);
    if (!move) {
      this.resetBoard();
      return;
    }
    const res = this.board.inputMove(move);
    res === GameState.WIN ? console.log('YOU WONN') : true;
  }
  undoMove(): void {
    this.board.undoMove();
  }
  resetBoard(): void {
    this.board = new Board(
      piecesBitBoard,
      golden_piecesBitBoard,
      golden_squaresBitBoard
    );
    console.log(true);
  }

  private activatedRoute = inject(ActivatedRoute);
  board = level12;

  levelId = this.activatedRoute.params.pipe(map((p) => p['id']));

  ngOnInit(): void {}
  ngOnDestroy(): void {}
}

function getRandomMove(array: Move[]): Move | undefined {
  if (array.length === 0) {
    return undefined; // Return undefined for an empty array
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
