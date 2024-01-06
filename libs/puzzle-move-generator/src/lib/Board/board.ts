import {
  BitBoard,
  and,
  extractSquaresFromBitboard,
  getFile,
  getRank,
  moveOriginToBitboard,
  moveToBitboard,
  or,
  reverse_uint64,
  surrounding_bits_uint64,
  xor,
} from '../BitBoard/bitboard';
import { Index, Square, SquareToIndex } from '../Square/square';
import { CompareMove, Move } from '../move/move';

export class Board {
  private _turn = 1;
  private _listOfMoves: Move[] = [];
  private _currentLegalMoves: Move[] = [];
  private _gameState: GameState = GameState.UNDEFINED;

  readonly WIDTH = 8;
  readonly HEIGHT = 8;
  readonly SIZE = this.WIDTH * this.HEIGHT;

  normie_pieces_bitboard: BitBoard;
  golden_pieces_bitboard: BitBoard;
  golden_squares_bitboard: BitBoard;

  constructor(
    normie_pieces: BitBoard,
    golden_pieces: BitBoard,
    golden_squares: BitBoard
  ) {
    this.normie_pieces_bitboard = normie_pieces;
    this.golden_pieces_bitboard = golden_pieces;
    this.golden_squares_bitboard = golden_squares;
    this.generateCurrentLegalMoves();
  }

  private checkWin(): GameState {
    return and(
      this.golden_pieces_bitboard,
      this.golden_squares_bitboard
    ).getBoard() > 0
      ? GameState.WIN
      : GameState.UNDEFINED;
  }

  // Getters fot Bitboards
  get NormiePiecesBitboard(): BitBoard {
    return this.normie_pieces_bitboard;
  }
  get GoldenPiecesBitboard(): BitBoard {
    return this.golden_pieces_bitboard;
  }
  get GoldenSquaresBitboard(): BitBoard {
    return this.golden_squares_bitboard;
  }
  get OccupancyBitboard(): BitBoard {
    return or(this.normie_pieces_bitboard, this.golden_pieces_bitboard);
  }

  get gameState(): GameState {
    return this._gameState;
  }
  get turn(): number {
    return this._turn;
  }
  get moveHistory(): Move[] {
    return this._listOfMoves;
  }
  get currentLegalMoves(): Move[] {
    return this._currentLegalMoves;
  }

  undoMove(): Result {
    const lastMove = this._listOfMoves.pop();
    if (!lastMove) return Error.NO_MOVE_TO_UNDO;
    this.makeMove(Move(lastMove.destination, lastMove.origin));
    this.generateCurrentLegalMoves();
    return Success.UNDO_SUCCESS;
  }
  inputMove(move: Move): Result {
    if (
      !this.isValidSquare(move.origin) ||
      !this.isValidSquare(move.destination)
    )
      return Error.NOT_VALID_SQUARE;

    if (!this.isPieceOnSquare(move.origin)) return Error.COULD_NOT_FIND_PIECE;
    if (this.isPieceOnSquare(move.destination)) return Error.POSITION_OCCUPIED;

    const isLegalMove = this._currentLegalMoves.find((legalMove) =>
      CompareMove(legalMove, move)
    );

    if (!isLegalMove) return Error.NOT_LEGAL_MOVE;

    this.makeMove(move);
    this._listOfMoves.push(move);
    this.generateCurrentLegalMoves();

    const gameState = this.checkWin();
    if (gameState === GameState.WIN) return GameState.WIN;
    this._gameState = gameState;

    return Success.MOVE_SUCCESS;
  }

  private makeMove(move: Move): void {
    const moveBitboard = moveToBitboard(move);

    if (
      and(moveOriginToBitboard(move), this.golden_pieces_bitboard).getBoard() >
      0
    ) {
      this.golden_pieces_bitboard = xor(
        this.golden_pieces_bitboard,
        moveBitboard
      );
    } else {
      this.normie_pieces_bitboard = xor(
        this.normie_pieces_bitboard,
        moveBitboard
      );
    }
  }

  private isValidSquare(square: Square): boolean {
    const index = SquareToIndex(square);
    return index >= 0 && index < this.SIZE;
  }

  private isPieceOnSquare(square: Square): boolean {
    const index = SquareToIndex(square);
    const occupiedBitboard = or(
      this.normie_pieces_bitboard,
      this.golden_pieces_bitboard
    );

    return Boolean(occupiedBitboard.getBit(index));
  }

  private generateCurrentLegalMoves() {
    this._currentLegalMoves = [];
    const pieces_squares = extractSquaresFromBitboard(this.OccupancyBitboard);
    pieces_squares.forEach((piece_square) => {
      const legal_moves_from_square =
        this.generateLegalMovesFromSquare(piece_square);
      this._currentLegalMoves = [
        ...this._currentLegalMoves,
        ...legal_moves_from_square,
      ];
    });
  }

  private generateLegalMovesFromSquare(square: Square): Move[] {
    const attacks = this.attacksBitboard(SquareToIndex(square));

    return extractSquaresFromBitboard(attacks).map((extractedSquare): Move => {
      return { origin: square, destination: extractedSquare };
    });
  }
  private attacksBitboard(index: Index): BitBoard {
    const piece_bitboard = BitBoard.empty().setBit(index).getBoard();
    const piece_bitboard_reversed = reverse_uint64(piece_bitboard);

    const occupancy = this.OccupancyBitboard.getBoard();
    const rank_mask = BitBoard.rankMask(getRank(index)).getBoard();
    const file_mask = BitBoard.fileMask(getFile(index)).getBoard();

    const potential_blockers_rank = occupancy & rank_mask;
    const potential_blockers_rank_reversed = reverse_uint64(
      potential_blockers_rank
    );

    const potential_blockers_file = occupancy & file_mask;
    const potential_blockers_file_reversed = reverse_uint64(
      potential_blockers_file
    );

    const horizontal_attacks =
      ((potential_blockers_rank - BigInt(2) * piece_bitboard) ^
        reverse_uint64(
          potential_blockers_rank_reversed - BigInt(2) * piece_bitboard_reversed
        )) &
      rank_mask &
      surrounding_bits_uint64((occupancy ^ piece_bitboard) & rank_mask);
    const vertical_attacks_attacks =
      ((potential_blockers_file - BigInt(2) * piece_bitboard) ^
        reverse_uint64(
          potential_blockers_file_reversed - BigInt(2) * piece_bitboard_reversed
        )) &
      file_mask &
      surrounding_bits_uint64((occupancy ^ piece_bitboard) & file_mask);
    return new BitBoard(horizontal_attacks | vertical_attacks_attacks);
  }
}

export enum Error {
  POSITION_OCCUPIED = 'There is already another piece in that location!',
  COULD_NOT_FIND_PIECE = 'No piece could be found in that location.',
  NOT_VALID_SQUARE = 'Not a valid square.',
  NOT_LEGAL_MOVE = 'Not a legal move.',
  NO_MOVE_TO_UNDO = 'No move left to Undo.',
}

export enum Success {
  MOVE_SUCCESS = 'Successfully moved piece.',
  UNDO_SUCCESS = 'Successfully undid previous move.',
}

export enum GameState {
  WIN = 'You won the game',
  UNDEFINED = 'Undefined',
  LOST = 'You lost',
}

export type Result = Success | Error | GameState;
