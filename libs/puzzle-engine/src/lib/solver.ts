import {
  Board,
  BoardState,
  MoveToString,
  Position,
  compareBestPosition,
} from '@puzzle-repo/puzzle-move-generator';
let i = 0;
let transpositionTable: Map<bigint, number>;

export const solve = (board: Board, max_depth: number): Position[] => {
  let solvedPositions: Position[] = [];
  transpositionTable = new Map<bigint, number>();
  i = 0;
  search(board, max_depth, solvedPositions);
  console.log(i);
  return solvedPositions;
};

export const search = (
  board: Board,
  depth: number,
  solvedPositions?: Position[]
): Position => {
  const configuration = board.configuration;
  if (transpositionTable.get(configuration)) {
    return { state: BoardState.LOST, moves: [] };
  }
  transpositionTable.set(configuration, 1);

  if (depth === 0 || board.currentLegalMoves.length === 0)
    return evaluatePosition(board);
  let bestPosition: Position = {
    state: BoardState.UNDEFINED,
    moves: [],
  };

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
  const position: Position = {
    state: board.gameState,
    moves: [...board.moveHistory],
  };
  return position;
};
