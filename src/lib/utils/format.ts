/**
 * Format utilities for currency, numbers, dates, etc.
 */

/**
 * Format a number as currency (PEN - Peruvian Soles)
 * Handles floating-point precision errors
 */
export function formatCurrency(amount: number): string {
  // Round to 2 decimal places to avoid floating-point errors
  const rounded = Math.round(amount * 100) / 100;
  return rounded.toFixed(2);
}

/**
 * Format a number as currency with symbol
 */
export function formatPrice(amount: number, symbol: string = 'S/'): string {
  return `${symbol} ${formatCurrency(amount)}`;
}

/**
 * Parse a price string to number
 */
export function parsePrice(priceString: string): number {
  const cleaned = priceString.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}

