import { FILE } from './file';
import { RANK } from './rank';
import {
  CompareSquares,
  Square,
  SquareToString,
  StringToSquare,
} from './square';
describe('Square', () => {
  test('Compare Squares', () => {
    const square1 = Square(RANK.EIGHT, FILE.A);
    const square2 = Square(RANK.EIGHT, FILE.A);
    expect(CompareSquares(square1, square2)).toBeTruthy();

    const square3 = Square(RANK.ONE, FILE.A);
    expect(CompareSquares(square1, square3)).toBeFalsy();
  });
  test('Square to String', () => {
    const square1 = Square(RANK.EIGHT, FILE.A);
    expect(SquareToString(square1)).toEqual('A8');

    const square2 = Square(RANK.ONE, FILE.B);
    expect(SquareToString(square2)).toEqual('B1');
  });
  test('String to Square', () => {
    const squareString1 = 'A8';
    const square1 = StringToSquare(squareString1);
    const square2 = Square(RANK.EIGHT, FILE.A);
    const square3 = Square(RANK.ONE, FILE.B);

    expect(CompareSquares(square1, square2)).toBe(true);
    expect(CompareSquares(square1, square3)).toBe(false);
  });
});
