// Currency formatting utilities
export function formatCurrency(amount: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format currency with fallback
export function formatAmount(
  amount: number,
  settings?: {
    currency?: string;
    locale?: string;
  }
): string {
  try {
    return formatCurrency(amount, settings?.currency || "USD", settings?.locale || "en-US");
  } catch (error) {
    // Fallback if locale/currency is not supported
    return `$${amount.toFixed(2)}`;
  }
}

// Parse currency string to number
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and parse
  const numericString = currencyString.replace(/[^\d.-]/g, "");
  const parsed = Number.parseFloat(numericString);
  return Number.isNaN(parsed) ? 0 : parsed;
}

// Simple locale detection for currency formatting (optional utility)
export function detectLocaleFromInput(input: string): string {
  // Basic detection for common currencies
  if (/đồng|vnd|việt|viet/i.test(input)) return "vi-VN";
  if (/元|rmb|人民币/i.test(input)) return "zh-CN";
  if (/円|yen/i.test(input)) return "ja-JP";

  // Default to US English
  return "en-US";
}

// Get currency from locale
export function getCurrencyFromLocale(locale: string): string {
  const currencyMap: Record<string, string> = {
    "vi-VN": "VND",
    "zh-CN": "CNY",
    "ja-JP": "JPY",
    "en-US": "USD",
    "en-GB": "GBP",
    "de-DE": "EUR",
    "fr-FR": "EUR",
    "es-ES": "EUR",
  };

  return currencyMap[locale] || "USD";
}
