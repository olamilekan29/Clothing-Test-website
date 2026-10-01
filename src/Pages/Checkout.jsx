import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaystackPop from "@paystack/inline-js";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { formatNaira, SHIPPING_FEE_NGN, FREE_SHIPPING_OVER_NGN } from "../utils";

const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

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

// Calls a server function and turns its error message into a normal Error.
async function callFn(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let message = error.message;
    try {
      const detail = await error.context.json();
      if (detail?.error) message = detail.error;
    } catch {
      /* keep the default message */
    }
    throw new Error(message);
  }
  return data;
}

export default function Checkout() {
  const { items, clear } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: profile?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
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

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    if (!PUBLIC_KEY) {
      setError("Missing VITE_PAYSTACK_PUBLIC_KEY in .env.local (restart the dev server after adding it).");
      return;
    }

    setPaying(true);
    try {
      // 1. The server checks prices and stock, and saves the order as pending
      const order = await callFn("create-order", {
        items: items.map((i) => ({ product_id: i.id, size: i.size, quantity: i.qty })),
        customer: form,
      });

      if (order.total !== total) {
        throw new Error(
          `Some prices have changed. Your correct total is ${formatNaira(order.total)}. Please remove and re-add the items in your cart.`
        );
      }

      // 2. Customer pays
      const popup = new PaystackPop();
      popup.newTransaction({
        key: PUBLIC_KEY,
        email: order.email,
        amount: order.total * 100, // Paystack expects kobo
        currency: "NGN",
        reference: order.reference,
        onSuccess: async () => {
          try {
            // 3. The server confirms with Paystack that the money arrived
            const result = await callFn("verify-payment", { reference: order.reference });
            if (result.status === "paid") {
              navigate("/order-success", {
                replace: true,
                state: { reference: order.reference, email: order.email, total: order.total },
              });
              clear();
            } else {
              setError(
                `We couldn't confirm your payment yet. If you were charged, please contact us with reference ${order.reference}.`
              );
              setPaying(false);
            }
          } catch (err) {
            setError(err.message);
            setPaying(false);
          }
        },
        onCancel: () => setPaying(false),
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
      setPaying(false);
    }
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

          {error && <p className="err-text auth-msg">{error}</p>}

          <button className="add-btn" type="submit" disabled={paying}>
            {paying ? "Please wait..." : `Pay ${formatNaira(total)}`}
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