// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { getSizes } from "../api";
// import { useCart } from "../CartContext";

// export default function ProductCard({ product }) {
//   const { id, title, thumbnail, price, discountPercentage, brand, stock } = product;
//   const { add } = useCart();
//   const [picking, setPicking] = useState(false);

//   const sizes = getSizes(product);
//   const salePrice = price * (1 - discountPercentage / 100);
//   const soldOut = stock === 0;

//   const handleQuickAdd = () => {
//     if (soldOut) return;
//     if (sizes.length === 1) {
//       add(product, sizes[0]); // e.g. bags: "One size"
//       return;
//     }
//     setPicking(true);
//   };

//   const pick = (size) => {
//     add(product, size);
//     setPicking(false);
//   };

//   return (
//     <article className="card">
//       <div className="card-img">
//         <Link to={`/product/${id}`} className="card-link">
//           <img src={thumbnail} alt={title} loading="lazy" />
//         </Link>

//         {discountPercentage > 10 && (
//           <span className="badge">-{Math.round(discountPercentage)}%</span>
//         )}

//         {picking && (
//           <div className="size-picker">
//             <div className="size-picker-head">
//               <span>Select size</span>
//               <button onClick={() => setPicking(false)} aria-label="Close size picker">✕</button>
//             </div>
//             <div className="size-picker-options">
//               {sizes.map((s) => (
//                 <button key={s} onClick={() => pick(s)}>{s}</button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <p className="brand">{brand}</p>
//       <Link to={`/product/${id}`} className="card-link">
//         <h3>{title}</h3>
//       </Link>
//       <p className="price">
//         ${salePrice.toFixed(2)}
//         {discountPercentage > 0 && <s>${price.toFixed(2)}</s>}
//       </p>

//       <button className="quick-add" onClick={handleQuickAdd} disabled={soldOut}>
//         {soldOut ? "Sold out" : "Add to cart"}
//       </button>
//     </article>
//   );
// }






// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { getSizes } from "../api";
// import { useCart } from "../CartContext";
// import { formatNaira, saleNGN, listNGN } from "../utils";

// export default function ProductCard({ product }) {
//   const { id, title, thumbnail, discountPercentage, brand, stock } = product;
//   const { add } = useCart();
//   const [picking, setPicking] = useState(false);

//   const sizes = getSizes(product);
//   const sale = saleNGN(product);
//   const list = listNGN(product);
//   const soldOut = stock === 0;

//   const handleQuickAdd = () => {
//     if (soldOut) return;
//     if (sizes.length === 1) {
//       add(product, sizes[0]);
//       return;
//     }
//     setPicking(true);
//   };

//   const pick = (size) => {
//     add(product, size);
//     setPicking(false);
//   };

//   return (
//     <article className="card">
//       <div className="card-img">
//         <Link to={`/product/${id}`} className="card-link">
//           <img src={thumbnail} alt={title} loading="lazy" />
//         </Link>

//         {discountPercentage > 10 && (
//           <span className="badge">-{Math.round(discountPercentage)}%</span>
//         )}

//         {picking && (
//           <div className="size-picker">
//             <div className="size-picker-head">
//               <span>Select size</span>
//               <button onClick={() => setPicking(false)} aria-label="Close size picker">✕</button>
//             </div>
//             <div className="size-picker-options">
//               {sizes.map((s) => (
//                 <button key={s} onClick={() => pick(s)}>{s}</button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <p className="brand">{brand}</p>
//       <Link to={`/product/${id}`} className="card-link">
//         <h3>{title}</h3>
//       </Link>
//       <p className="price">
//         {formatNaira(sale)}
//         {list > sale && <s>{formatNaira(list)}</s>}
//       </p>

//       <button className="quick-add" onClick={handleQuickAdd} disabled={soldOut}>
//         {soldOut ? "Sold out" : "Add to cart"}
//       </button>
//     </article>
//   );
// }


import { useState } from "react";
import { Link } from "react-router-dom";
import { getSizes } from "../api";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import { formatNaira, saleNGN, listNGN } from "../utils";

export default function ProductCard({ product }) {
  const { id, title, thumbnail, discountPercentage, brand, stock } = product;
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [picking, setPicking] = useState(false);

  const sizes = getSizes(product);
  const sale = saleNGN(product);
  const list = listNGN(product);
  const soldOut = stock === 0;
  const saved = has(id);

  const handleQuickAdd = () => {
    if (soldOut) return;
    if (sizes.length === 1) {
      add(product, sizes[0]);
      return;
    }
    setPicking(true);
  };

  const pick = (size) => {
    add(product, size);
    setPicking(false);
  };

  return (
    <article className="card">
      <div className="card-img">
        <Link to={`/product/${id}`} className="card-link">
          <img src={thumbnail} alt={title} loading="lazy" />
        </Link>

        {discountPercentage > 10 && (
          <span className="badge">-{Math.round(discountPercentage)}%</span>
        )}

        <button
          className={`heart ${saved ? "on" : ""}`}
          onClick={() => toggle(product)}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
        >
          {saved ? "♥" : "♡"}
        </button>

        {picking && (
          <div className="size-picker">
            <div className="size-picker-head">
              <span>Select size</span>
              <button onClick={() => setPicking(false)} aria-label="Close size picker">✕</button>
            </div>
            <div className="size-picker-options">
              {sizes.map((s) => (
                <button key={s} onClick={() => pick(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="brand">{brand}</p>
      <Link to={`/product/${id}`} className="card-link">
        <h3>{title}</h3>
      </Link>
      <p className="price">
        {formatNaira(sale)}
        {list > sale && <s>{formatNaira(list)}</s>}
      </p>

      <button className="quick-add" onClick={handleQuickAdd} disabled={soldOut}>
        {soldOut ? "Sold out" : "Add to cart"}
      </button>
    </article>
  );
}