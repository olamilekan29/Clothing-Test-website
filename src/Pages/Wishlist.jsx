import { Link } from "react-router-dom";
import { useWishlist } from "../WishlistContext";
import ProductCard from "../Components/ProductCard";

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <main className="product">
      <Link to="/" className="back">← Continue shopping</Link>
      <h2 className="co-title">Your wishlist ({items.length})</h2>

      {items.length === 0 ? (
        <p className="msg">
          Nothing saved yet. Tap the ♡ on any product to keep it here.
        </p>
      ) : (
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}