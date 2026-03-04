export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value)
}
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}