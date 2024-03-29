import {
  BitBoard,
  BoardStringToBitboard,
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
  private _listOfMoves: Move[] = [];
  private _undoList: Move[] = [];
  private _currentLegalMoves: Move[] = [];
  private _gameState: BoardState = BoardState.UNDEFINED;

  readonly WIDTH = 8;
  readonly HEIGHT = 8;
  readonly SIZE = this.WIDTH * this.HEIGHT;

  private normie_pieces_bitboard: BitBoard;
  private golden_pieces_bitboard: BitBoard;
  private golden_squares_bitboard: BitBoard;
  // prettier-ignore
  private get occupancy(): BitBoard { return new BitBoard(this.normie_pieces_bitboard.getBoard() | this.golden_pieces_bitboard.getBoard());}
  public get configuration(): bigint {
    return getConfiguration(
      this.normie_pieces_bitboard.getBoard(),
      this.golden_pieces_bitboard.getBoard()
    );
  }

  private _normie_pieces: Square[] = [];
  private _golden_pieces: Square[] = [];
  private _golden_squares: Square[] = [];

  // prettier-ignore
  get normie_pieces(): Square[] { return this._normie_pieces;}
  // prettier-ignore
  get golden_pieces(): Square[] { return this._golden_pieces; }
  // prettier-ignore
  get golden_squares(): Square[] { return this._golden_squares; }

  constructor(
    normie_pieces: BitBoard,
    golden_pieces: BitBoard,
    golden_squares: BitBoard
  ) {
    this.normie_pieces_bitboard = new BitBoard(
      normie_pieces.getBoard() & ~golden_pieces.getBoard()
    );
    this.golden_pieces_bitboard = golden_pieces;
    this.golden_squares_bitboard = golden_squares;
    this.updateBitboardToSquares();
    this.generateCurrentLegalMoves();
  }
  private updateBitboardToSquares() {
    this._normie_pieces = extractSquaresFromBitboard(
      this.normie_pieces_bitboard
    );
    this._golden_pieces = extractSquaresFromBitboard(
      this.golden_pieces_bitboard
    );
    this._golden_squares = extractSquaresFromBitboard(
      this.golden_squares_bitboard
    );
  }
  private updateBoardState(): BoardSuccess {
    const isWin =
      this.golden_pieces_bitboard.getBoard() ===
      this.golden_squares_bitboard.getBoard();
    if (isWin) {
      this._gameState = BoardState.WIN;
      this._currentLegalMoves = [];
      return BoardSuccess.WIN;
    }
    if (this.currentLegalMoves.length === 0) {
      this._gameState = BoardState.LOST;
      this._currentLegalMoves = [];
      return BoardSuccess.LOST;
    }
    this._gameState = BoardState.UNDEFINED;
    return BoardSuccess.UNDEFINED;
  }

  get gameState(): BoardState {
    return this._gameState;
  }
  get position(): Position {
    return {
      state: this._gameState,
      moves: this.moveHistory,
    };
  }
  get turn(): number {
    return this.moveHistory.length;
  }
  get moveHistory(): Move[] {
    return this._listOfMoves;
  }
  get undoHistory(): Move[] {
    return this._undoList;
  }
  get currentLegalMoves(): Move[] {
    return this._currentLegalMoves;
  }
  get allMovesHistory(): Move[] {
    return [...this.moveHistory, ...[...this.undoHistory].reverse()];
  }
  get reverseAllMovesHistory(): Move[] {
    return this.allMovesHistory.reverse();
  }

  undoMove(): BoardResult {
    const lastMove = this._listOfMoves.pop();
    if (!lastMove) return BoardError.NO_MOVE_TO_UNDO;

    this.makeMove(Move(lastMove.destination, lastMove.origin));
    this._undoList.push(lastMove);

    this.generateCurrentLegalMoves();
    this.updateBoardState();

    return BoardSuccess.UNDO_SUCCESS;
  }

  redoMove(): BoardResult {
    if (!this._undoList) return BoardError.NO_MOVE_TO_REDO;
    const firstMove = this._undoList.pop();
    if (!firstMove) return BoardError.NO_MOVE_TO_REDO;

    this.makeMove(firstMove);
    this._listOfMoves.push(firstMove);

    this.generateCurrentLegalMoves();
    this.updateBoardState();

    return BoardSuccess.REDO_SUCCESS;
  }
  goToMove(turnToGo: number): BoardResult {
    if (this.moveHistory.length + this.undoHistory.length === 0)
      return BoardError.NO_MOVE_TO_GO;
    const distance = Math.abs(this.moveHistory.length - turnToGo);
    if (turnToGo === this.moveHistory.length) return BoardSuccess.GO_TO_SUCCESS;
    else if (this.moveHistory.length > turnToGo) {
      for (let index = 0; index < distance; index++) {
        this.undoMove();
      }
    } else if (this.moveHistory.length < turnToGo) {
      if (this.undoHistory.length < distance) return BoardError.NO_MOVE_TO_GO;
      for (let index = 0; index < distance; index++) {
        this.redoMove();
      }
    }

    return BoardSuccess.GO_TO_SUCCESS;
  }
  resetBoard(): void {
    this.goToMove(0);
    this._listOfMoves = [];
    this._undoList = [];
  }
  inputMove(move: Move): BoardResult {
    // Check if Game is still ongoing
    if (this.gameState !== BoardState.UNDEFINED)
      return BoardError.GAME_FINISHED;
    // Redundant but information rich checks.

    // if (
    //   !this.isValidSquare(move.origin) ||
    //   !this.isValidSquare(move.destination)
    // )
    //   return BoardError.NOT_VALID_SQUARE;

    // if (!this.isPieceOnSquare(move.origin))
    //   return BoardError.COULD_NOT_FIND_PIECE;
    // if (this.isPieceOnSquare(move.destination))
    //   return BoardError.POSITION_OCCUPIED;

    //Check if move is valid
    const isLegalMove = this._currentLegalMoves.find((legalMove) =>
      CompareMove(legalMove, move)
    );
    if (!isLegalMove) return BoardError.NOT_LEGAL_MOVE;

    this.makeMove(move);
    this._listOfMoves.push(move);
    const lastUndoMove = this.undoHistory.pop();
    if (lastUndoMove) {
      if (!CompareMove(move, lastUndoMove)) {
        this._undoList = [];
      }
    }
    this.generateCurrentLegalMoves();

    const gameState = this.updateBoardState();

    if (gameState !== BoardSuccess.UNDEFINED) return gameState;

    return BoardSuccess.MOVE_SUCCESS;
  }

  private makeMove(move: Move): void {
    const moveBitboard = moveToBitboard(move);

    if (
      (moveOriginToBitboard(move).getBoard() &
        this.golden_pieces_bitboard.getBoard()) >
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
    this.updateBitboardToSquares();
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

  public generateCurrentLegalMoves() {
    this._currentLegalMoves = [];
    const pieces_squares = [...this.normie_pieces, ...this.golden_pieces];
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

    const occupancy = this.occupancy.getBoard();
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

  public static EMPTY(): Board {
    return new Board(BitBoard.empty(), BitBoard.empty(), BitBoard.empty());
  }

  public static FromString(
    normieString: string,
    goldenPieceString: string,
    goldenSquareString: string
  ): Board {
    return new Board(
      BoardStringToBitboard(normieString),
      BoardStringToBitboard(goldenPieceString),
      BoardStringToBitboard(goldenSquareString)
    );
  }
}

export enum BoardError {
  POSITION_OCCUPIED = 'There is already another piece in that location!',
  COULD_NOT_FIND_PIECE = 'No piece could be found in that location.',
  NOT_VALID_SQUARE = 'Not a valid square.',
  NOT_LEGAL_MOVE = 'Not a legal move.',
  NO_MOVE_TO_UNDO = 'No move left to Undo.',
  NO_MOVE_TO_REDO = 'No move left to Redo.',
  NO_MOVE_TO_GO = 'No move to go to.',
  WRONG_INPUT = 'You submitted a wrong input.',
  GAME_FINISHED = 'Game has already finished.',
}

export enum BoardSuccess {
  MOVE_SUCCESS = 'Successfully moved piece.',
  UNDO_SUCCESS = 'Successfully undid move.',
  REDO_SUCCESS = 'Successfully redid move.',
  GO_TO_SUCCESS = 'Successfully restored turn.',
  WIN = 'You won the game',
  UNDEFINED = 'Undefined',
  LOST = 'You lost',
}

export enum BoardState {
  DRAW = 1 / 2,
  WIN = 1,
  UNDEFINED = 0,
  LOST = -1,
}

export type Position = {
  state: BoardState;
  moves: Move[];
};

export const compareBestPosition = (
  position1: Position,
  position2: Position
): Position => {
  if (position1.state === BoardState.WIN) return position1;
  else if (position2.state === BoardState.WIN) return position2;
  else if (position1.state === BoardState.UNDEFINED) return position1;
  else if (position2.state === BoardState.UNDEFINED) return position2;
  else if (position1.state === BoardState.LOST) return position1;
  else return position2;
};
export type BoardResult = BoardSuccess | BoardError | BoardState;
export const isBoardError = (val: any): boolean => {
  if (Object.values(BoardError).includes(val as BoardError)) {
    return true;
  }
  return false;
};

const getConfiguration = (
  normiePieces: bigint,
  goldenPieces: bigint
): bigint => {
  // const configuration =(BigInt.asUintN(128, goldenPieces) << BigInt(64)) | normiePieces;
  const configuration = normiePieces | goldenPieces;
  return configuration;
};
