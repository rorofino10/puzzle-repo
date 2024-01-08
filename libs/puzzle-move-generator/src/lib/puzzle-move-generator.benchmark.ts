import { Suite } from 'benchmark';
import { Board } from './Board/board';
import { BitBoard } from './BitBoard/bitboard';
import { FILE } from './Square/file';
import { RANK } from './Square/rank';
import { RankFileToIndex } from './Square/square';

const suite = new Suite();

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

suite.add('Board#Instantiate', () => {
  const testingBoard = new Board(
    piecesBitBoard,
    golden_piecesBitBoard,
    golden_squaresBitBoard
  );
});

suite.add('Board#UndoMove', () => {
  const testingBoard = new Board(
    piecesBitBoard,
    golden_piecesBitBoard,
    golden_squaresBitBoard
  );
  testingBoard.inputMove(
    // Move(Square(RANK.ONE, FILE.E), Square(RANK.ONE, FILE.B))
    testingBoard.currentLegalMoves[
      Math.floor(Math.random() * testingBoard.currentLegalMoves.length)
    ]
  );
  testingBoard.undoMove();
});
suite.add('Board#InputMove', () => {
  const testingBoard = new Board(
    piecesBitBoard,
    golden_piecesBitBoard,
    golden_squaresBitBoard
  );
  testingBoard.inputMove(
    // Move(Square(RANK.ONE, FILE.E), Square(RANK.ONE, FILE.B))
    testingBoard.currentLegalMoves[
      Math.floor(Math.random() * testingBoard.currentLegalMoves.length)
    ]
  );
});
const testingBoard = new Board(
  piecesBitBoard,
  golden_piecesBitBoard,
  golden_squaresBitBoard
);
suite.add('Board#GenerateLegalMoves', () => {
  testingBoard.generateCurrentLegalMoves();
});

// Run the benchmark
suite
  .on('cycle', (event: any) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('Benchmark completed');
  })
  .run({ async: false }); // Synchronous run for simplicity
