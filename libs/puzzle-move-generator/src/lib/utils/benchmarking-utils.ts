export const benchmark_function = (
  fn: Function,
  params: any
): [number, number] => {
  const time = process.hrtime();
  fn(params);
  const timeEnd = process.hrtime(time);

  return timeEnd;
};
