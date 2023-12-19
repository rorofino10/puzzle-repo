import { FILE } from '../Square/file';
import { RANK } from '../Square/rank';
import { Index, IndexToSquare, Square, SquareToIndex } from '../Square/square';
import { Move } from '../move/move';
import { BitReverseTable256 } from './bit-reverse-table';

export class BitBoard {
  private board: bigint;

  constructor(board: bigint) {
    const newBoard = BigInt.asUintN(64, board);
    this.validateBitboard(newBoard);
    this.board = newBoard;
  }

  private validateBitboard(board: bigint): void {
    if (board < BigInt(0) || board > BigInt('0xFFFFFFFFFFFFFFFF')) {
      throw new Error(
        'Invalid uint64 bitboard. Must be between 0 and 0xFFFFFFFFFFFFFFFF.'
      );
    }
  }

  getBoard(): bigint {
    return this.board;
  }

  // Left shift
  leftShift(shift: number): BitBoard {
    return new BitBoard(this.board << BigInt(shift));
  }

  // Right shift
  rightShift(shift: number): BitBoard {
    return new BitBoard(this.board >> BigInt(shift));
  }

  // Set a specific bit to 1
  setBit(index: number): BitBoard {
    return or(this, BitBoard.one().leftShift(index));
  }

  // Clear a specific bit to 0
  clearBit(index: number): BitBoard {
    return and(this, not(BitBoard.one().leftShift(index)));
  }
  // Get a specific bit
  getBit(index: number) {
    const shifted = this.board >> BigInt(index);
    return Number(shifted & BigInt(1));
  }

  surroundingBits(): BitBoard {
    const size = 8; // Assuming an 8x8 grid
    let result = this.getBoard();
    const inputBitboard = this.getBoard();

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const bitPosition = row * size + col;

        if ((inputBitboard & (1n << BigInt(bitPosition))) !== 0n) {
          // Set surrounding bits to 1, excluding corners
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;

              if (
                newRow >= 0 &&
                newRow < size &&
                newCol >= 0 &&
                newCol < size &&
                !(i !== 0 && j !== 0) // Exclude corners
              ) {
                const newPosition = newRow * size + newCol;
                result |= 1n << BigInt(newPosition);
              }
            }
          }
        }
      }
    }

    // Set the original 1 bits to 0
    result &= ~inputBitboard;

    return new BitBoard(result);
  }
  // Static method for creating a BitBoard from a binary string
  static fromBinaryString(binaryString: string): BitBoard {
    const board = BigInt('0b' + binaryString);
    return new BitBoard(board);
  }
  static fromBinary(binary: number): BitBoard {
    const board = BigInt(binary);
    return new BitBoard(board);
  }

  // Static method for creating a BitBoard with all bits set to 0
  static empty(): BitBoard {
    return new BitBoard(BigInt(0));
  }

  static one(): BitBoard {
    return new BitBoard(BigInt(1));
  }

  // Create a bitboard based on a file mask
  static fileMask(file: number): BitBoard {
    if (file < 0 || file > 7) {
      throw new Error('Invalid file. Must be between 0 and 7.');
    }
    let filemask = BitBoard.empty();

    for (let rank = 0; rank < 8; rank++) {
      const square = rank * 8 + file;
      filemask = filemask.setBit(square);
    }
    return filemask;
  }

  // Create a bitboard based on a rank mask
  static rankMask(rank: number): BitBoard {
    if (rank < 0 || rank > 7) {
      throw new Error('Invalid rank. Must be between 0 and 7.');
    }
    let filemask = BitBoard.empty();

    for (let file = 0; file < 8; file++) {
      const square = rank * 8 + file;
      filemask = filemask.setBit(square);
    }
    return filemask;
  }

  logAsTable(name?: string, unit: string = '1'): void {
    const binaryString = this.board.toString(2).padStart(64, '0');
    let tableString = '';

    for (let rank = 0; rank < 8; rank++) {
      let row = '';
      for (let file = 7; file >= 0; file--) {
        const index = rank * 8 + file;
        row += binaryString[index] === '1' ? `${unit} ` : '0 ';
      }
      tableString += row.trim() + '\n';
    }

    console.log(name, '\n' + tableString.trim());
  }
  logAsArray(): string[] {
    const binaryString = this.board.toString(2).padStart(64, '0');
    const rows = [];
    for (let i = 7; i >= 0; i--) {
      rows.push(
        binaryString
          .slice(i * 8, (i + 1) * 8)
          .split('')
          .reverse()
          .join(' ')
      );
    }
    return rows;
  }

  // Static method for creating a BitBoard with all bits set to 1
  static full(): BitBoard {
    return new BitBoard(BigInt('0xFFFFFFFFFFFFFFFF'));
  }
}

export const xor = (board1: BitBoard, board2: BitBoard): BitBoard => {
  return new BitBoard(board1.getBoard() ^ board2.getBoard());
};

// Bitwise OR
export const or = (board1: BitBoard, board2: BitBoard): BitBoard => {
  return new BitBoard(board1.getBoard() | board2.getBoard());
};

// Bitwise AND
export const and = (board1: BitBoard, board2: BitBoard): BitBoard => {
  return new BitBoard(board1.getBoard() & board2.getBoard());
};

// Bitwise NOT
export const not = (board: BitBoard): BitBoard => {
  return new BitBoard(~board.getBoard());
};

export const getRank = (square: Index): RANK => Math.floor(square / 8);

// Get the file from a given square
export const getFile = (square: Index): FILE => square % 8;

// Bitwise subtraction of two bitboards
export const subtract = (board1: BitBoard, board2: BitBoard): BitBoard => {
  const result = board1.getBoard() & ~board2.getBoard();
  return new BitBoard(result);
};

export const minus = (board1: BitBoard, board2: BitBoard): BitBoard => {
  return new BitBoard(board1.getBoard() - board2.getBoard());
};

export const extractSquaresFromBitboard = (bitboard: BitBoard): Square[] => {
  const squares: Square[] = [];
  for (let index = 0; index < 64; index++) {
    if (bitboard.getBit(index) === 1) {
      squares.push(IndexToSquare(index as Index));
    }
  }
  return squares;
};

const abs = (n: bigint) => (n < 0n ? -n : n);

export const flipVertically = (inputBoard: BitBoard): BitBoard => {
  const inputRows = inputBoard.logAsArray();
  const flippedRows = inputRows.reverse();
  const flippedBoard = flippedRows.join('').replace(/ /g, '');

  return new BitBoard(BigInt('0b' + flippedBoard));
};

export const mirrorHorizontally = (inputBoard: BitBoard): BitBoard => {
  const inputRows = inputBoard.logAsArray();
  const mirroredRows = inputRows.map((row) => row.split('').reverse().join(''));
  const mirroredBoard = mirroredRows.join('').replace(/ /g, '');

  return new BitBoard(BigInt('0b' + mirroredBoard));
};

export const old_reverse = (inputBoard: BitBoard) =>
  mirrorHorizontally(flipVertically(inputBoard));

export const moveToBitboard = (move: Move): BitBoard => {
  return BitBoard.empty()
    .setBit(SquareToIndex(move.origin))
    .setBit(SquareToIndex(move.destination));
};
export const moveOriginToBitboard = (move: Move): BitBoard => {
  return BitBoard.empty().setBit(SquareToIndex(move.origin));
};

export const reverse = (inputBoard: BitBoard): BitBoard => {
  const uint64 = inputBoard.getBoard();

  return new BitBoard(reverse_uint64(uint64));
};
export const reverse_uint64 = (input: bigint): bigint => {
  const bytes = splitUint64IntoBytes(input);
  const reversed_bytes = reverseBytes(bytes);
  const uint64 = mergeBytesIntoUint64(reversed_bytes);
  return uint64;
};

export const splitUint64IntoBytes = (input_uint64: bigint) => {
  const bytes = new Uint8Array(8);

  for (let i = 0; i < 8; i++)
    bytes[i] = Number((input_uint64 >> BigInt(8 * i)) & BigInt(0xff));
  return bytes;
};
export const mergeBytesIntoUint64 = (input_bytes: Uint8Array) => {
  let uint64 = BigInt.asUintN(64, 0n);

  for (let i = 0; i < 8; i++) {
    uint64 = (uint64 << BigInt(8)) ^ BigInt(input_bytes[7 - i]);
  }
  return uint64;
};
export const reverseBytes = (input_bytes: Uint8Array): Uint8Array => {
  const reversed_bytes = input_bytes
    .map((byte) => BitReverseTable256[byte])
    .reverse();
  return reversed_bytes;
};
