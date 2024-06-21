export const isNotEmptyArray = <T>(array?: T[]): array is T[] =>
  Array.isArray(array) && array.length > 0;

export const searchTimeDisplayName = (searchTimeSeconds: number) =>
  searchTimeSeconds === Infinity ? "∞" : `${searchTimeSeconds}s`;
