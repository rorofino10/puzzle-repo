import { Board, MoveToString } from '@puzzle-repo/puzzle-move-generator';
import { calls, search, solve } from './solver';

const easyBoard = Board.FromString('A1', 'A3', 'A2');
const mediumBoard = Board.FromString('A2C1', 'C7', 'B2');
const hardBoard = Board.FromString('A1A3A5C5E5', 'E1', 'C3');
const hardBoard2 = Board.FromString('A1A3A5C1C5E5', 'E1', 'C3');
const kindaHardBoard = Board.FromString(
  'h4h8g8g1f2c8a4b6d7b2c4d3e5f6',
  'a1',
  'g7'
);
describe('solver', () => {
  test('Solve Board', () => {
    const board = Board.FromString('A3A5D5A2E2', 'B1', 'C3');
    const solvedPositions = solve(board);
    solvedPositions.forEach((position) => {
      console.log(
        position.moves.map((move) => MoveToString(move)),
        position.moves.length
      );
    });
  });
  // test('Solve Easy Board', () => {
  //   const bestPosition = search(easyBoard, 2);
  //   // console.log(calls());
  //   console.log(bestPosition.moves.map((move) => MoveToString(move)));
  //   expect(bestPosition.moves.length).toBe(1);
  // });
  // test('Solve Medium Board', () => {
  //   const bestPosition = search(mediumBoard, 5);
  //   console.log(calls());
  //   console.log(bestPosition.moves.map((move) => MoveToString(move)));
  //   expect(bestPosition.moves.length).toBe(2);
  // });
  // test('Solve Hard Board', () => {
  //   const bestPosition = search(hardBoard, 7);
  //   console.log(calls());
  //   console.log(bestPosition);
  //   console.log(bestPosition.moves.map((move) => MoveToString(move)));
  //   // expect(bestPosition.moves.length).toBe(13);
  // });
  // test('Solve Hard Board2', () => {
  //   const bestPosition = search(hardBoard2, 4);
  //   console.log(calls());
  //   console.log(bestPosition);
  //   console.log(bestPosition.moves.map((move) => MoveToString(move)));
  //   // expect(bestPosition.moves.length).toBe(13);
  // });
  // test('Solve Kinda Hard Board', () => {
  //   const bestPosition = search(kindaHardBoard, 5);
  //   console.log(calls());
  //   console.log(bestPosition);
  //   console.log(bestPosition.moves.map((move) => MoveToString(move)));
  //   // expect(bestPosition.moves.length).toBe(13);
  // });
});
