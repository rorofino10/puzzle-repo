import { getFile, getRank } from '../BitBoard/bitboard';
import { FILE, FILE_STRING_MAP } from './file';
import { RANK } from './rank';

export type Index =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63;

export type Square = {
  file: FILE;
  rank: RANK;
};
export const RankFileToIndex = (rank: RANK, file: FILE): Index => {
  return (rank * 8 + file) as Index;
};
export const SquareToIndex = (square: Square): Index => {
  return (square.rank * 8 + square.file) as Index;
};

export const IndexToSquare = (index: Index): Square => {
  return Square(getRank(index), getFile(index));
};

export const Square = (rank: RANK, file: FILE): Square => {
  return {
    rank,
    file,
  };
};

export const CompareSquares = (square1: Square, square2: Square): boolean => {
  return square1.file === square2.file && square1.rank === square2.rank;
};

export const SquareToString = (square: Square): string => {
  return `${FILE_STRING_MAP[square.file]}${square.rank + 1}`;
};

export const StringToSquare = (moveString: string): Square => {
  return Square(
    Number(moveString[1]),
    FILE_STRING_MAP.findIndex((file) => file === moveString[0])
  );
};
