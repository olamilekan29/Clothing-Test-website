import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { formatNaira } from "../utils";


export default function CartDrawer() {
  const { items, setQty, total, open, setOpen } = useCart();
  const navigate = useNavigate();
  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <h2>Your cart</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <p className="msg">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((i) => (
                <li key={i.key}>
                  <img src={i.thumbnail} alt={i.title} />
                  <div>
                    <p className="t">{i.title}</p>
                    <p className="s">Size: {i.size}</p>
                    <p className="p">{formatNaira(i.price)}</p>
                    <div className="qty">
                      <button onClick={() => setQty(i.key, i.qty - 1)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => setQty(i.key, i.qty + 1)}>+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <p>
                <span>Subtotal</span> <strong>{formatNaira(total)}</strong>
              </p>
              <button
                className="add-btn"
                onClick={() => {
                setOpen(false);
                navigate("/checkout");
  }}
>
  Checkout
</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}