export function formatCurrency(priceCents) {
  return (Math.round(Math.abs(priceCents)) / 100).toFixed(2);
};