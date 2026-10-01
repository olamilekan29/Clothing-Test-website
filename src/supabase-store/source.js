import { supabase } from "../supabase";

// The first four show as tiles on the home page.
export const CATEGORIES = [
  { slug: "shirts", label: "Shirts" },
  { slug: "dresses", label: "Dresses" },
  { slug: "shoes", label: "Shoes" },
  { slug: "bags", label: "Bags" },
  { slug: "tops", label: "Tops" },
  { slug: "trousers", label: "Trousers" },
];

// Converts a database row into the shape the rest of the app expects.
const normalize = (row) => {
  const sale = row.sale_price && row.sale_price < row.price ? row.sale_price : row.price;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    brand: row.brand || "",
    description: row.description || "",
    price: row.price,
    sizes: row.sizes || [],
    stock: row.stock,
    images: row.images || [],
    thumbnail: row.images?.[0] || "",
    rating: 0,
    discountPercentage: (1 - sale / row.price) * 100,
  };
};

export async function getProducts(category = "all") {
  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (category !== "all") query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(normalize);
}

export async function getProduct(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .single();
  if (error) throw error;
  return normalize(data);
}

export function getSizes(product) {
  return product.sizes?.length ? product.sizes : ["One size"];
}