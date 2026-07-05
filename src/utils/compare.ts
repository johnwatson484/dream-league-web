export function compare (a: string | number, b: string | number): number {
  const order = a < b ? -1 : 1
  return a === b ? 0 : order
}
