export const USD_TO_NGN = 1450; // placeholder rate, adjust as needed
export const SHIPPING_FEE_NGN = 2500;
export const FREE_SHIPPING_OVER_NGN = 50000;

// Round to the nearest ₦100 so prices look like a real store (₦38,000, not ₦37,987)
const roundTo100 = (n) => Math.round(n / 100) * 100;

export const toNaira = (usd) => roundTo100(usd * USD_TO_NGN);

// Use these everywhere a product price is shown or added to the cart
export const saleNGN = (p) => toNaira(p.price * (1 - p.discountPercentage / 100));
export const listNGN = (p) => toNaira(p.price);

export const formatNaira = (n) => "₦" + n.toLocaleString("en-NG");