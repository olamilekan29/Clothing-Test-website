import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaystackPop from "@paystack/inline-js";
import { useCart } from "../CartContext";
import { formatNaira, SHIPPING_FEE_NGN, FREE_SHIPPING_OVER_NGN } from "../utils";

const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const EMPTY = { name: "", email: "", phone: "", address: "", city: "", state: "" };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email";
  if (!/^(\+?234|0)\d{10}$/.test(f.phone.replace(/\s/g, ""))) e.phone = "Enter a valid Nigerian phone number";
  if (f.address.trim().length < 5) e.address = "Enter your delivery address";
  if (!f.city.trim()) e.city = "Enter your city";
  if (!f.state.trim()) e.state = "Enter your state";
  return e;
}

export default function Checkout() {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);

  if (items.length === 0) {
    return (
      <main className="product">
        <p className="msg">Your cart is empty.</p>
        <p className="msg"><Link to="/">← Back to shop</Link></p>
      </main>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const shipping = subtotal >= FREE_SHIPPING_OVER_NGN ? 0 : SHIPPING_FEE_NGN;
  const total = subtotal + shipping;

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const handlePay = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    if (!PUBLIC_KEY) {
      alert("Missing VITE_PAYSTACK_PUBLIC_KEY in .env.local (restart the dev server after adding it).");
      return;
    }

    setPaying(true);
    const popup = new PaystackPop();
    popup.newTransaction({
      key: PUBLIC_KEY,
      email: form.email,
      amount: total * 100, // Paystack expects kobo
      currency: "NGN",
      metadata: { name: form.name, phone: form.phone, address: `${form.address}, ${form.city}, ${form.state}` },
      onSuccess: (transaction) => {
        navigate("/order-success", {
          replace: true,
          state: { reference: transaction.reference, email: form.email, total },
        });
        clear();
      },
      onCancel: () => setPaying(false),
    });
  };

  const field = (name, label, props = {}) => (
    <label className="field">
      <span>{label}</span>
      <input value={form[name]} onChange={update(name)} className={errors[name] ? "invalid" : ""} {...props} />
      {errors[name] && <small className="err-text">{errors[name]}</small>}
    </label>
  );

  return (
    <main className="product">
      <Link to="/" className="back">← Continue shopping</Link>
      <h2 className="co-title">Checkout</h2>

      <div className="checkout-layout">
        <form onSubmit={handlePay} noValidate className="co-form">
          <h3>Delivery details</h3>
          {field("name", "Full name", { autoComplete: "name" })}
          {field("email", "Email", { type: "email", autoComplete: "email" })}
          {field("phone", "Phone number", { type: "tel", autoComplete: "tel", placeholder: "08012345678" })}
          {field("address", "Street address", { autoComplete: "street-address" })}
          <div className="row">
            {field("city", "City", { autoComplete: "address-level2" })}
            {field("state", "State", { autoComplete: "address-level1" })}
          </div>
          <button className="add-btn" type="submit" disabled={paying}>
            {paying ? "Waiting for payment..." : `Pay ${formatNaira(total)}`}
          </button>
        </form>

        <aside className="summary">
          <h3>Order summary</h3>
          <ul>
            {items.map((i) => (
              <li key={i.key}>
                <img src={i.thumbnail} alt={i.title} />
                <div>
                  <p className="t">{i.title}</p>
                  <p className="s">Size {i.size} · Qty {i.qty}</p>
                </div>
                <p className="p">{formatNaira(i.qty * i.price)}</p>
              </li>
            ))}
          </ul>
          <p className="line"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></p>
          <p className="line">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatNaira(shipping)}</span>
          </p>
          <p className="line total"><span>Total</span><span>{formatNaira(total)}</span></p>
          {shipping > 0 && (
            <p className="hint">Free shipping on orders over {formatNaira(FREE_SHIPPING_OVER_NGN)}</p>
          )}
        </aside>
      </div>
    </main>
  );
}