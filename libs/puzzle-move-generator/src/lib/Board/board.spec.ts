import { BitBoard } from '../BitBoard/bitboard';
import { FILE } from '../Square/file';
import { RANK } from '../Square/rank';
import { RankFileToIndex, Square } from '../Square/square';
import { Move } from '../move/move';
import { Board, BoardError, BoardSuccess } from './board';

const pieces = BitBoard.empty()
  // .setBit(RankFileToIndex(0, 0))
  // .setBit(RankFileToIndex(4, 0))
  // .setBit(RankFileToIndex(4, 7))
  .setBit(RankFileToIndex(7, 3))
  .setBit(RankFileToIndex(4, 4))
  .setBit(RankFileToIndex(2, 3));
const golden_pieces = BitBoard.empty();
const golden_squares = BitBoard.empty();
describe('board', () => {
  const boardToTest = new Board(pieces, golden_pieces, golden_squares);
  it('Should have 64 squares', () => {
    expect(boardToTest.SIZE).toBe(64);
  });
  it('Should display the actual configuration', () => {
    const board = Board.FromString('A1', 'B1', 'C1');
    console.log(board.configuration.toString(2));
    // expect(board.position.configuration.toString()).toEqual('0');
  });
  it('Should give the correct current legal moves ', () => {
    const testingBoard = Board.FromString('A4C8C4C1', 'H2', 'H3');
    let legalMoves = testingBoard.currentLegalMoves;
    // console.log(legalMoves);
    // testingBoard.getPiecesBitboard().logAsTable();
    expect(legalMoves.length).toBe(6);

    testingBoard.inputMove(
      Move(Square(RANK.FOUR, FILE.C), Square(RANK.SEVEN, FILE.C))
    );

    legalMoves = testingBoard.currentLegalMoves;

    // console.log(legalMoves);
    // testingBoard.getPiecesBitboard().logAsTable();
    expect(legalMoves.length).toBe(2);
  });
  it('Should undo previous move ', () => {
    const testingBoard = Board.FromString('C1C4C8A4', 'H2', 'H3');
    testingBoard.inputMove(
      Move(Square(RANK.FOUR, FILE.C), Square(RANK.SEVEN, FILE.C))
    );

    expect(testingBoard.moveHistory.length).toBe(1);

    const result = testingBoard.undoMove();

    expect(testingBoard.currentLegalMoves.length).toBe(6);
    expect(testingBoard.moveHistory.length).toBe(0);
    expect(result).toEqual(BoardSuccess.UNDO_SUCCESS);
  });
  it('Should not undo previous move ', () => {
    const testingBitBoard = BitBoard.empty()
      .setBit(RankFileToIndex(RANK.FOUR, FILE.A))
      .setBit(RankFileToIndex(RANK.EIGHT, FILE.C))
      .setBit(RankFileToIndex(RANK.FOUR, FILE.C))
      .setBit(RankFileToIndex(RANK.ONE, FILE.C));

    const testingBoard = new Board(
      testingBitBoard,
      BitBoard.empty(),
      BitBoard.empty()
    );

    const result = testingBoard.undoMove();
    expect(testingBoard.currentLegalMoves.length).toBe(6);
    expect(testingBoard.moveHistory.length).toBe(0);
    expect(result).toEqual(BoardError.NO_MOVE_TO_UNDO);
  });
  test('Level 12 ', () => {
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

    const testingBoard = new Board(
      piecesBitBoard,
      golden_piecesBitBoard,
      golden_squaresBitBoard
    );

    // testingBoard.occupancy.logAsTable('Occupancy');
    // testingBoard.getPiecesBitboard().logAsTable('Pieces', '1');
    // testingBoard.getGoldenPiecesBitboard().logAsTable('Golden Pieces', '2');
    // testingBoard.getGoldenSquaresBitboard().logAsTable('Golden Squares', 'X');

    let legalMoves = testingBoard.currentLegalMoves;
    expect(legalMoves.length).toBe(12);

    testingBoard.inputMove(
      Move(Square(RANK.ONE, FILE.E), Square(RANK.ONE, FILE.B))
    );

    legalMoves = testingBoard.currentLegalMoves;
    expect(legalMoves.length).toBe(8);

    testingBoard.undoMove();
    expect(testingBoard.currentLegalMoves.length).toBe(12);

    testingBoard.redoMove();
    expect(testingBoard.currentLegalMoves.length).toBe(8);
  });
});
