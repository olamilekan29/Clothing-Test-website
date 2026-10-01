import { SOURCE } from "./config";

export const USD_TO_NGN = 1500; // only used by the DummyJSON demo
export const SHIPPING_FEE_NGN = 3500; // ask the client for their real rates
export const FREE_SHIPPING_OVER_NGN = 100000;

// Supabase prices are already in naira; DummyJSON prices are converted from USD.
const IN_NAIRA = SOURCE !== "remote";
const RATE = IN_NAIRA ? 1 : USD_TO_NGN;
const STEP = IN_NAIRA ? 1 : 100;
const roundTo = (n) => Math.round(n / STEP) * STEP;

export const toNaira = (amount) => roundTo(amount * RATE);
export const saleNGN = (p) => toNaira(p.price * (1 - p.discountPercentage / 100));
export const listNGN = (p) => toNaira(p.price);

export const formatNaira = (n) => "₦" + n.toLocaleString("en-NG");