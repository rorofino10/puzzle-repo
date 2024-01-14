import {
  Board,
  BoardState,
  MoveToString,
  Position,
  compareBestPosition,
} from '@puzzle-repo/puzzle-move-generator';
let i = 0;

export const solve = (board: Board): Position[] => {
  let solvedPositions: Position[] = [];
  i = 0;
  search(board, 10, solvedPositions);
  console.log(i);
  return solvedPositions;
};

export const search = (
  board: Board,
  depth: number,
  solvedPositions?: Position[]
) => {
  if (depth === 0 || board.currentLegalMoves.length === 0)
    return evaluatePosition(board);
  let bestPosition: Position = { state: BoardState.UNDEFINED, moves: [] };

  board.currentLegalMoves.forEach((move) => {
    board.inputMove(move);
    i++;
    const position = search(board, depth - 1);
    board.undoMove();

    if (position.state === BoardState.WIN) {
      bestPosition = position;
      solvedPositions?.push(position);
    }
    // bestPosition = compareBestPosition(bestPosition, position);
  });
  return bestPosition;
};

const evaluatePosition = (board: Board): Position => {
  i++;
  const position = {
    state: board.gameState,
    moves: [...board.moveHistory],
  };
  return position;
};

export const calls = () => i;
