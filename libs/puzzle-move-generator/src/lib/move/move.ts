import { CompareSquares, Square, SquareToString } from '../Square/square';

export type Move = {
  origin: Square;
  destination: Square;
};

export const Move = (origin: Square, destination: Square): Move => {
  return { origin, destination };
};

/**
 * Compares two {@link Move} and checks if they are equal.
 *
 * @param move1
 * @param move2
 * @returns if the moves are equal or not.
 */
export const CompareMove = (move1: Move, move2: Move): boolean => {
  return (
    CompareSquares(move1.origin, move2.origin) &&
    CompareSquares(move1.destination, move2.destination)
  );
};

/**
 * Converts a {@link Move} to a {@link String}.
 *
 * @param move the move to convert.
 * @returns A string of the move following the corresponding board notation.
 */
export const MoveToString = (move: Move): string => {
  return `${SquareToString(move.origin)} => ${SquareToString(
    move.destination
  )}`;
};
