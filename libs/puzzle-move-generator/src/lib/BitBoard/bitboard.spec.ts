import {
  BitBoard,
  BitBoardFromArrayPieceString,
  BoardStringToArrayPiecesString,
  and,
  mergeBytesIntoUint64,
  or,
  reverse,
  reverseBytes,
  splitUint64IntoBytes,
  xor,
} from './bitboard';
describe('BitBoard', () => {
  test('Creating a BitBoard from binary string', () => {
    const binaryString =
      '1010101010101010101010101010101010101010101010101010101010101010';
    const bitboard = BitBoard.fromBinaryString(binaryString);
    expect(bitboard.getBoard().toString()).toEqual(
      BigInt('0b' + binaryString).toString()
    );
  });

  test('Reverse operation', () => {
    const boardToReverse = BitBoard.empty().setBit(0);
    const expectedBoard = BitBoard.empty().setBit(63);
    const reversed_board = reverse(boardToReverse);

    expect(reversed_board.getBoard().toString(2)).toEqual(
      expectedBoard.getBoard().toString(2)
    );
  });
  test('Bitwise OR operation', () => {
    const board1 = BitBoard.fromBinaryString(
      '1010101010101010101010101010101010101010101010101010101010101010'
    );
    const board2 = BitBoard.fromBinaryString(
      '1100110011001100110011001100110011001100110011001100110011001100'
    );

    const result = or(board1, board2);

    expect(result.getBoard().toString()).toEqual(
      BigInt(
        '0b1110111011101110111011101110111011101110111011101110111011101110'
      ).toString()
    );
  });

  test('Bitwise AND operation', () => {
    const board1 = BitBoard.fromBinaryString(
      '1010101010101010101010101010101010101010101010101010101010101010'
    );
    const board2 = BitBoard.fromBinaryString(
      '1100110011001100110011001100110011001100110011001100110011001100'
    );
    const result = and(board1, board2);

    expect(result.getBoard().toString()).toEqual(
      BigInt(
        '0b1000100010001000100010001000100010001000100010001000100010001000'
      ).toString()
    );
  });
  test('AND operation', () => {
    const board1 = BitBoard.fromBinaryString(
      '1010101010101010101010101010101010101010101010101010101010101010'
    );
    const board2 = BitBoard.fromBinaryString(
      '1100110011001100110011001100110011001100110011001100110011001100'
    );
    const result = board1.getBoard() & board2.getBoard();

    expect(result.toString()).toEqual(
      BigInt(
        '0b1000100010001000100010001000100010001000100010001000100010001000'
      ).toString()
    );
  });

  test('Bitwise XOR operation', () => {
    const board1 = BitBoard.fromBinaryString(
      '1010101010101010101010101010101010101010101010101010101010101010'
    );
    const board2 = BitBoard.fromBinaryString(
      '1100110011001100110011001100110011001100110011001100110011001100'
    );
    const result = xor(board1, board2);

    expect(result.getBoard().toString()).toEqual(
      (board1.getBoard() ^ board2.getBoard()).toString()
    );
  });

  test('Set Bit operation', () => {
    // Initial bitboard: 1010101010101010101010101010101010101010101010101010101010101010
    const initialBoard = BitBoard.fromBinaryString(
      '0010101010101010101010101010101010101010101010101010101010100010'
    );

    // Set the 4th bit to 1
    const setBitBoard = initialBoard.setBit(3);
    expect(setBitBoard.getBoard().toString(2).padStart(64, '0')).toEqual(
      '0010101010101010101010101010101010101010101010101010101010101010'
    );

    // Set the last bit to 1
    const setBitBoard2 = initialBoard.setBit(63);
    expect(setBitBoard2.getBoard().toString(2).padStart(64, '0')).toEqual(
      '1010101010101010101010101010101010101010101010101010101010100010'
    );
  });
  test('Clear Bit operation', () => {
    // Initial bitboard: 1010101010101010101010101010101010101010101010101010101010101010
    const initialBoard = BitBoard.fromBinaryString(
      '1010101010101010101010101010101010101010101010101010101010101010'
    );

    // Clear the 4th bit to 0
    const clearBitBoard = initialBoard.clearBit(3);
    expect(clearBitBoard.getBoard().toString(2).padStart(64, '0')).toEqual(
      '1010101010101010101010101010101010101010101010101010101010100010'
    );

    // Clear the last bit to 0
    const clearBitBoard2 = initialBoard.clearBit(63);
    expect(clearBitBoard2.getBoard().toString(2).padStart(64, '0')).toEqual(
      '0010101010101010101010101010101010101010101010101010101010101010'
    );
  });
  test('Get Bit operation', () => {
    // Initial bitboard: 1010101010101010101010101010101010101010101010101010101010101010
    const initialBoard = BitBoard.fromBinaryString(
      '1010101010101010101010101010101010101010101010101010101010101010'
    );

    // Check the value of the 4th bit (0-based index)
    const bitValue = initialBoard.getBit(3);

    expect(bitValue).toBe(1); // Adjust this value based on the expected result
    expect(initialBoard.getBit(63)).toBe(1); // Adjust this value based on the expected result
    expect(initialBoard.getBit(0)).toBe(0); // Adjust this value based on the expected result
  });
  test('Reverse bytes', () => {
    const input_bytes = new Uint8Array(8);
    input_bytes[0] = 1;
    const reversed_bytes = reverseBytes(input_bytes);

    expect(reversed_bytes[0]).toBe(128);
  });
  test('Split Uint64 Into Bytes', () => {
    const input = BigInt.asUintN(
      64,
      0b1000000000000000000000000000000000000000000000000000000000000001n
    );
    splitUint64IntoBytes(input);
  });
  test('Merge Bytes into Uint64', () => {
    const input_bytes = new Uint8Array(8);
    input_bytes[0] = 255;
    input_bytes[2] = 255;
    input_bytes[3] = 255;
    input_bytes[5] = 255;
    input_bytes[7] = 255;
    const uint64 = mergeBytesIntoUint64(input_bytes);

    expect(uint64.toString(2)).toEqual(
      '1111111100000000111111111111111100000000111111110000000011111111'
    );
  });
  test('Get Bitboard from Board String', () => {
    const boardString = 'A1B1C1';
    const piecesString = BoardStringToArrayPiecesString(boardString);
    const bitboard = BitBoardFromArrayPieceString(piecesString as string[]);
    const expectedBitboard = BitBoard.empty().setBit(0).setBit(1).setBit(2);

    expect((bitboard as BitBoard).getBoard().toString()).toEqual(
      expectedBitboard.getBoard().toString()
    );
  });

  // test('Bit Reverse Table', () => {
  //   console.log(BitReverseTable256);
  // });
});
