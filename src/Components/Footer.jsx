import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    setDone(true);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3 className="footer-brand">THREAD</h3>
          <p className="footer-text">Everyday style, delivered across Nigeria.</p>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/">All products</Link></li>
            <li><Link to="/?category=mens-shirts">Men's Shirts</Link></li>
            <li><Link to="/?category=womens-dresses">Dresses</Link></li>
            <li><Link to="/?category=womens-shoes">Shoes</Link></li>
            <li><Link to="/?category=womens-bags">Bags</Link></li>
          </ul>
        </div>

        <div>
          <h4>Account</h4>
          <ul>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
          </ul>
        </div>

        <div>
          <h4>Stay in the loop</h4>
          {done ? (
            <p className="footer-text">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={subscribe} noValidate className="news">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit">Join</button>
            </form>
          )}
          {error && <small className="err-text">{error}</small>}
        </div>
      </div>

      <p className="footer-copy">© {new Date().getFullYear()} THREAD. All rights reserved.</p>
    </footer>
  );
}