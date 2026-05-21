/**
 * Shared utility for safely handling currency conversions between the
 * backend's integer (Paise/Cents) requirement and the frontend's visual
 * floating point representation.
 */

export const displayPrice = (paise: number): string => {
  return (paise / 100).toFixed(2);
};

export const toPaise = (price: number): number => {
  return Math.round(price * 100);
};
