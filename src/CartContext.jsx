// import { createContext, useContext, useEffect, useState } from "react";

// const CartContext = createContext();
// export const useCart = () => useContext(CartContext);

// export function CartProvider({ children }) {
//   const [items, setItems] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("cart")) || [];
//     } catch {
//       return [];
//     }
//   });
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(items));
//   }, [items]);

//   const add = (product, size) => {
//     const key = `${product.id}-${size}`;
//     const price =
//   Math.round(product.price * (1 - product.discountPercentage / 100) * 100) / 100;
//   const price = saleNGN(product);
//     setItems((prev) => {
//       const existing = prev.find((i) => i.key === key);
//       if (existing) {
//         return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
//       }
//       return [
//         ...prev,
//         { key, id: product.id, title: product.title, thumbnail: product.thumbnail, price, size, qty: 1 },
//       ];
//     });
//     setOpen(true);
//   };

//   const setQty = (key, qty) =>
//     setItems((prev) =>
//       qty <= 0
//         ? prev.filter((i) => i.key !== key)
//         : prev.map((i) => (i.key === key ? { ...i, qty } : i))
//     );

//   const clear = () => setItems([]);

//   const count = items.reduce((s, i) => s + i.qty, 0);
//   const total = items.reduce((s, i) => s + i.qty * i.price, 0);

//   return (
//     <CartContext.Provider value={{ items, add, setQty, clear, count, total, open, setOpen }}>
//       {children}
//     </CartContext.Provider>
//   );
// }



// import { createContext, useContext, useEffect, useState } from "react";
// import { saleNGN } from "./utils";

// const CartContext = createContext();
// export const useCart = () => useContext(CartContext);

// export function CartProvider({ children }) {
//   const [items, setItems] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("cart")) || [];
//     } catch {
//       return [];
//     }
//   });
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(items));
//   }, [items]);

//   const add = (product, size) => {
//     const key = `${product.id}-${size}`;
//     const price = saleNGN(product);

//     setItems((prev) => {
//       const existing = prev.find((i) => i.key === key);
//       if (existing) {
//         return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
//       }
//       return [
//         ...prev,
//         { key, id: product.id, title: product.title, thumbnail: product.thumbnail, price, size, qty: 1 },
//       ];
//     });
//     setOpen(true);
//   };

//   const setQty = (key, qty) =>
//     setItems((prev) =>
//       qty <= 0
//         ? prev.filter((i) => i.key !== key)
//         : prev.map((i) => (i.key === key ? { ...i, qty } : i))
//     );

//   const clear = () => setItems([]);

//   const count = items.reduce((s, i) => s + i.qty, 0);
//   const total = items.reduce((s, i) => s + i.qty * i.price, 0);

//   return (
//     <CartContext.Provider value={{ items, add, setQty, clear, count, total, open, setOpen }}>
//       {children}
//     </CartContext.Provider>
//   );
// }


import { createContext, useContext, useEffect, useRef, useState } from "react";
import { saleNGN } from "./utils";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const showToast = (item) => {
    clearTimeout(timer.current);
    setToast(item);
    timer.current = setTimeout(() => setToast(null), 3500);
  };

  const add = (product, size) => {
    const key = `${product.id}-${size}`;
    const price = saleNGN(product);

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        { key, id: product.id, title: product.title, thumbnail: product.thumbnail, price, size, qty: 1 },
      ];
    });

    showToast({ id: Date.now(), title: product.title, thumbnail: product.thumbnail, size });
  };

  const setQty = (key, qty) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);
  const dismissToast = () => setToast(null);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{ items, add, setQty, clear, count, total, open, setOpen, toast, dismissToast }}
    >
      {children}
    </CartContext.Provider>
  );
}