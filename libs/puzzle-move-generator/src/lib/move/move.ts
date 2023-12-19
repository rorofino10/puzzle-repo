import { CompareSquares, Square } from '../Square/square';

export type Move = {
  origin: Square;
  destination: Square;
};

export const Move = (origin: Square, destination: Square): Move => {
  return { origin, destination };
};

export const CompareMove = (move1: Move, move2: Move): boolean => {
  return (
    CompareSquares(move1.origin, move2.origin) &&
    CompareSquares(move1.destination, move2.destination)
  );
};
