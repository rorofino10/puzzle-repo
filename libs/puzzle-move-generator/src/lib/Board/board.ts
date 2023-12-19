import {
  BitBoard,
  and,
  extractSquaresFromBitboard,
  getFile,
  getRank,
  minus,
  moveOriginToBitboard,
  moveToBitboard,
  or,
  reverse,
  subtract,
  xor,
} from '../BitBoard/bitboard';
import { FILE } from '../Square/file';
import { RANK } from '../Square/rank';
import {
  Index,
  RankFileToIndex,
  Square,
  SquareToIndex,
} from '../Square/square';
import { CompareMove, Move } from '../move/move';

export class Board {
  private turn = 1;
  private listOfMoves: Move[] = [];
  private currentLegalMoves: Move[] = [];
  private gameState: GameState = GameState.UNDEFINED;

  width = 8;
  height = 8;
  size = this.width * this.height;
  pieces;
  golden_pieces;
  golden_squares;
  constructor(
    normie_pieces: BitBoard,
    golden_pieces: BitBoard,
    golden_squares: BitBoard
  ) {
    this.pieces = normie_pieces;
    this.golden_pieces = golden_pieces;
    this.golden_squares = golden_squares;
    this.generateCurrentLegalMoves();
  }

  checkWin(): GameState {
    return and(this.golden_pieces, this.golden_squares).getBoard() > 0
      ? GameState.WIN
      : GameState.UNDEFINED;
  }

  // Getters fot Bitboards
  getPiecesBitboard(): BitBoard {
    return this.pieces;
  }
  getGoldenPiecesBitboard(): BitBoard {
    return this.golden_pieces;
  }
  getGoldenSquaresBitboard(): BitBoard {
    return this.golden_squares;
  }

  get occupancy(): BitBoard {
    return or(this.pieces, this.golden_pieces);
  }

  getTurn(): number {
    return this.turn;
  }

  inputMove(move: Move): Result {
    if (
      !this.isValidSquare(move.origin) ||
      !this.isValidSquare(move.destination)
    )
      return Error.NOT_VALID_SQUARE;

    if (!this.isPieceOnSquare(move.origin)) return Error.COULD_NOT_FIND_PIECE;
    if (this.isPieceOnSquare(move.destination)) return Error.POSITION_OCCUPIED;

    const isLegalMove = this.currentLegalMoves.find((legalMove) =>
      CompareMove(legalMove, move)
    );

    if (!isLegalMove) return Error.NOT_LEGAL_MOVE;

    this.makeMove(move);
    this.listOfMoves.push(move);
    this.generateCurrentLegalMoves();

    const gameState = this.checkWin();
    if (gameState === GameState.WIN) return GameState.WIN;
    this.gameState = gameState;

    return Success.MOVE_SUCCESS;
  }

  private makeMove(move: Move): void {
    const moveBitboard = moveToBitboard(move);

    if (and(moveOriginToBitboard(move), this.golden_pieces).getBoard() > 0) {
      this.golden_pieces = xor(this.golden_pieces, moveBitboard);
    } else {
      this.pieces = xor(this.pieces, moveBitboard);
    }
  }

  private isValidSquare(square: Square): boolean {
    const index = SquareToIndex(square);
    return index >= 0 && index < this.size;
  }

  private isPieceOnSquare(square: Square): boolean {
    const index = SquareToIndex(square);
    const occupiedBitboard = or(this.pieces, this.golden_pieces);

    return Boolean(occupiedBitboard.getBit(index));
  }

  getCurrentLegalMoves(): Move[] {
    return this.currentLegalMoves;
  }

  generateCurrentLegalMoves() {
    this.currentLegalMoves = [];
    const pieces_squares = extractSquaresFromBitboard(this.occupancy);
    pieces_squares.forEach((piece_square) => {
      const legal_moves_from_square =
        this.generateLegalMovesFromSquare(piece_square);
      this.currentLegalMoves = [
        ...this.currentLegalMoves,
        ...legal_moves_from_square,
      ];
    });
  }

  generateLegalMovesFromSquare(square: Square): Move[] {
    const horizontal_attacks = this.horizontalAttacksBitBoardFromIndex(
      SquareToIndex(square)
    );
    const vertical_attacks = this.verticalAttacksBitBoardFromIndex(
      SquareToIndex(square)
    );
    const attacks = or(horizontal_attacks, vertical_attacks);

    return extractSquaresFromBitboard(attacks).map((extractedSquare): Move => {
      return { origin: square, destination: extractedSquare };
    });
  }

  private horizontalAttacksBitBoardFromIndex(index: Index): BitBoard {
    const piece_bitboard = BitBoard.empty().setBit(index);
    const piece_bitboard_reversed = reverse(piece_bitboard);

    const occupancy = this.occupancy;
    const occupancy_reversed = reverse(occupancy);

    const rank_mask = BitBoard.rankMask(getRank(index));

    const potential_blockers = and(occupancy, rank_mask);
    const potential_blockers_reversed = reverse(potential_blockers);

    const difference = minus(potential_blockers, piece_bitboard.leftShift(1));
    const difference_reversed = reverse(
      minus(potential_blockers_reversed, piece_bitboard_reversed.leftShift(1))
    );

    const changed = xor(difference, occupancy);
    const changed_reversed = xor(difference_reversed, potential_blockers);

    const east_attacks = and(changed, rank_mask);
    const west_attacks = and(changed_reversed, rank_mask);

    const attacks = and(
      xor(east_attacks, west_attacks),
      and(xor(occupancy, piece_bitboard), rank_mask).surroundingBits()
    );

    return attacks;
  }
  private verticalAttacksBitBoardFromIndex(index: Index): BitBoard {
    const piece_bitboard = BitBoard.empty().setBit(index);
    const piece_bitboard_reversed = reverse(piece_bitboard);

    const occupancy = this.occupancy;
    const occupancy_reversed = reverse(occupancy);

    const file_mask = BitBoard.fileMask(getFile(index));

    const potential_blockers = and(occupancy, file_mask);
    const potential_blockers_reversed = reverse(potential_blockers);

    const difference = minus(potential_blockers, piece_bitboard.leftShift(1));
    const difference_reversed = reverse(
      minus(potential_blockers_reversed, piece_bitboard_reversed.leftShift(1))
    );

    const changed = xor(difference, occupancy);
    const changed_reversed = xor(difference_reversed, potential_blockers);

    const north_attacks = and(changed, file_mask);
    const south_attacks = and(changed_reversed, file_mask);

    const attacks = and(
      xor(north_attacks, south_attacks),
      and(xor(occupancy, piece_bitboard), file_mask).surroundingBits()
    );

    return attacks;
  }
}

type PuzzleBitBoards = [BitBoard, BitBoard, BitBoard];

export enum Error {
  POSITION_OCCUPIED = 'There is already another piece in that location!',
  COULD_NOT_FIND_PIECE = 'No piece could be found in that location.',
  NOT_VALID_SQUARE = 'Not a valid square.',
  NOT_LEGAL_MOVE = 'Not a legal move.',
}

export enum Success {
  MOVE_SUCCESS = 'Successfully moved piece.',
  VALID_SQUARE = 'Moved from a valid square.',
  COULD_FIND_PIECE = 'A piece could be found in that location.',
}

export type Result = Success | Error | GameState;
export enum GameState {
  WIN = 'You won the game',
  UNDEFINED = 'Undefined',
  LOST = 'You lost',
}
