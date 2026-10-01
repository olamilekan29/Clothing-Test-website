// const BASE = "https://dummyjson.com";

// export const CATEGORIES = [
//   { slug: "mens-shirts", label: "Men's Shirts" },
//   { slug: "womens-dresses", label: "Dresses" },
//   { slug: "tops", label: "Tops" },
//   { slug: "womens-shoes", label: "Women's Shoes" },
//   { slug: "mens-shoes", label: "Men's Shoes" },
//   { slug: "womens-bags", label: "Bags" },
// ];

// async function get(path) {
//   const res = await fetch(`${BASE}${path}`);
//   if (!res.ok) throw new Error(`Request failed: ${res.status}`);
//   return res.json();
// }

// // category = slug or "all"
// export async function getProducts(category = "all") {
//   if (category === "all") {
//     const results = await Promise.all(
//       CATEGORIES.map((c) => get(`/products/category/${c.slug}`))
//     );
//     return results.flatMap((r) => r.products);
//   }
//   const data = await get(`/products/category/${category}`);
//   return data.products;
// }

// export const getProduct = (id) => get(`/products/${id}`);
// export const searchProducts = async (q) =>
//   (await get(`/products/search?q=${encodeURIComponent(q)}`)).products;

// export function getSizes(product) {
//   if (product.category.includes("shoes")) return ["38", "39", "40", "41", "42", "43"];
//   if (product.category.includes("bags")) return ["One size"];
//   return ["XS", "S", "M", "L", "XL"];
// }

import { SOURCE } from "./config";
import * as remote from "./remote-store/source";
import * as supabaseStore from "./supabase-store/source";

const source = SOURCE === "remote" ? remote : supabaseStore;

export const CATEGORIES = source.CATEGORIES;
export const getProducts = source.getProducts;
export const getProduct = source.getProduct;
export const getSizes = source.getSizes;
