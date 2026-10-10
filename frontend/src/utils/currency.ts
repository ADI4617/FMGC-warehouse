/**
 * Centralized INR currency formatting utility.
 * All monetary values in this application are denominated in Indian Rupees (INR).
 * The stored amounts are already in INR — only the display symbol was wrong (was $, now ₹).
 */

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const INR_FORMATTER_NO_DECIMAL = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a number as Indian Rupees: ₹1,23,456.78
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount == null || isNaN(amount)) return '₹0.00';
  return INR_FORMATTER.format(amount);
}

/**
 * Format a number as Indian Rupees without decimal places: ₹1,23,456
 * Useful for large KPI figures on dashboards.
 */
export function formatINRCompact(amount: number | undefined | null): string {
  if (amount == null || isNaN(amount)) return '₹0';
  return INR_FORMATTER_NO_DECIMAL.format(amount);
}

/**
 * Format a number as a plain Indian-style number string (no ₹ symbol): 1,23,456.78
 */
export function formatINRNumber(amount: number | undefined | null): string {
  if (amount == null || isNaN(amount)) return '0.00';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
