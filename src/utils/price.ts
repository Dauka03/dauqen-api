export const formatPrice = (price: number, currency: string = 'KZT'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateTotalPrice = (
  subtotal: number,
  deliveryFee: number = 0,
  discount: number = 0
): number => {
  return subtotal + deliveryFee - discount;
};

export const calculateDeliveryFee = (
  distance: number,
  baseFee: number = 500,
  perKmFee: number = 100
): number => {
  return baseFee + Math.ceil(distance * perKmFee);
};

export const calculateDiscount = (
  price: number,
  discountPercentage: number
): number => {
  return Math.round(price * (discountPercentage / 100));
};

export const calculatePriceWithDiscount = (
  price: number,
  discountPercentage: number
): number => {
  return price - calculateDiscount(price, discountPercentage);
};

export const calculateTax = (
  price: number,
  taxRate: number = 12
): number => {
  return Math.round(price * (taxRate / 100));
};

export const calculatePriceWithTax = (
  price: number,
  taxRate: number = 12
): number => {
  return price + calculateTax(price, taxRate);
};

export const calculateTip = (
  price: number,
  tipPercentage: number
): number => {
  return Math.round(price * (tipPercentage / 100));
};

export const calculatePriceWithTip = (
  price: number,
  tipPercentage: number
): number => {
  return price + calculateTip(price, tipPercentage);
};

export const isValidPrice = (price: number): boolean => {
  return price >= 0 && !isNaN(price) && isFinite(price);
};

export const roundPrice = (price: number, roundTo: number = 100): number => {
  return Math.round(price / roundTo) * roundTo;
};

export const calculatePricePerUnit = (
  totalPrice: number,
  quantity: number
): number => {
  return quantity > 0 ? totalPrice / quantity : 0;
};

export const calculateBulkDiscount = (
  price: number,
  quantity: number,
  bulkThreshold: number = 5,
  bulkDiscountPercentage: number = 10
): number => {
  if (quantity >= bulkThreshold) {
    return calculateDiscount(price, bulkDiscountPercentage);
  }
  return 0;
};

export const calculateLoyaltyPoints = (
  price: number,
  pointsRate: number = 1
): number => {
  return Math.floor(price * pointsRate);
};

export const calculatePriceFromPoints = (
  points: number,
  pointsRate: number = 1
): number => {
  return Math.floor(points / pointsRate);
};

export default {
  formatPrice,
  calculateTotalPrice,
  calculateDeliveryFee,
  calculateDiscount,
  calculatePriceWithDiscount,
  calculateTax,
  calculatePriceWithTax,
  calculateTip,
  calculatePriceWithTip,
  isValidPrice,
  roundPrice,
  calculatePricePerUnit,
  calculateBulkDiscount,
  calculateLoyaltyPoints,
  calculatePriceFromPoints,
}; 