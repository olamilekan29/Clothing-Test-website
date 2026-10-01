import { useCart } from "../CartContext";

export default function CartDrawer() {
  const { items, setQty, total, open, setOpen } = useCart();

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
                    <p className="p">${i.price.toFixed(2)}</p>
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
                <span>Subtotal</span> <strong>${total.toFixed(2)}</strong>
              </p>
              <button className="add-btn">Checkout</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}