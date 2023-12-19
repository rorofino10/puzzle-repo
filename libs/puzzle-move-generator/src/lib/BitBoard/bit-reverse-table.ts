const Buffer = new ArrayBuffer(256);
export const BitReverseTable256 = new Uint8Array(Buffer);

// Define helper functions
const R2 = (n: number): number[] => [n, n + 2 * 64, n + 1 * 64, n + 3 * 64];
const R4 = (n: number): number[] => [
  ...R2(n),
  ...R2(n + 2 * 16),
  ...R2(n + 1 * 16),
  ...R2(n + 3 * 16),
];
const R6 = (n: number): number[] => [
  ...R4(n),
  ...R4(n + 2 * 4),
  ...R4(n + 1 * 4),
  ...R4(n + 3 * 4),
];

BitReverseTable256.set([...R6(0), ...R6(2), ...R6(1), ...R6(3)]);
