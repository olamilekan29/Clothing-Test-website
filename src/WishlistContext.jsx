import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

const slim = (p) => ({
  id: p.id,
  title: p.title,
  thumbnail: p.thumbnail,
  price: p.price,
  discountPercentage: p.discountPercentage,
  brand: p.brand,
  stock: p.stock,
  category: p.category,
});

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const has = (id) => items.some((i) => i.id === id);

  const toggle = (product) =>
    setItems((prev) =>
      prev.some((i) => i.id === product.id)
        ? prev.filter((i) => i.id !== product.id)
        : [...prev, slim(product)]
    );

  return (
    <WishlistContext.Provider value={{ items, has, toggle, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}