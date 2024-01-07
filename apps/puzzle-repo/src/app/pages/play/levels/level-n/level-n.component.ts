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
  Error,
  FILE,
  GameState,
  Move,
  MoveToString,
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
  private activatedRoute = inject(ActivatedRoute);
  // board = level12;
  normie_pieces_bitboard = new BitBoard(
    BigInt(this.activatedRoute.snapshot.params['normie_pieces'])
  );
  golden_piece_bitboard = BitBoard.empty().setBit(
    Number(this.activatedRoute.snapshot.params['golden_piece'])
  );
  golden_square_bitboard = BitBoard.empty().setBit(
    Number(this.activatedRoute.snapshot.params['golden_square'])
  );
  // normie_pieces_bitboard = this.activatedRoute.params.pipe(
  //   map((p) => new BitBoard(BigInt(p['normie_pieces'])))
  // );
  // golden_piece_bitboard = this.activatedRoute.params.pipe(
  //   map((p) => BitBoard.empty().setBit(Number(p['golden_piece'])))
  // );
  // golden_square_bitboard = this.activatedRoute.params.pipe(
  //   map((p) => BitBoard.empty().setBit(Number(p['golden_square'])))
  // );
  board = new Board(
    this.normie_pieces_bitboard,
    this.golden_piece_bitboard,
    this.golden_square_bitboard
  );

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

  inputMove(move: Move): void {
    const res = this.board.inputMove(move);

    if (Object.values(Error).includes(res as Error)) {
      console.error(res);
      return;
    }
    console.log(this.board.moveHistory.length, MoveToString(move));
    if (res === GameState.WIN) console.log(res);
  }
  undoMove(): void {
    this.board.undoMove();
  }
  goToMove(turn: number): void {
    this.board.goToMove(turn);
    const lastMoveString = MoveToString(
      this.board.moveHistory[this.board.moveHistory.length - 1]
    );
    console.log(this.board.moveHistory.length, lastMoveString);
  }
  redoMove(): void {
    this.board.redoMove();
  }
  resetBoard(): void {
    this.board = new Board(
      this.normie_pieces_bitboard,
      this.golden_piece_bitboard,
      this.golden_square_bitboard
    );
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

  ngOnInit(): void {
    // console.log(piecesBitBoard.getBoard());
  }
}

function getRandomMove(array: Move[]): Move | undefined {
  if (array.length === 0) {
    return undefined; // Return undefined for an empty array
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
