export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US");
  return value < 0 ? `-$${formatted}` : `$${formatted}`;
}
