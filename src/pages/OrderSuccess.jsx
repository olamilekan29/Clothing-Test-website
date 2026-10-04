import { Link, Navigate, useLocation } from "react-router-dom";
import { formatNaira } from "../utils";

export default function OrderSuccess() {
  const { state } = useLocation();
  if (!state) return <Navigate to="/" replace />;

  return (
    <main className="product success">
      <div className="tick">✓</div>
      <h2>Thank you for your order!</h2>
<p>We've received your order and will contact you about delivery. Your email: <strong>{state.email}</strong>.</p>      <p className="ref">Reference: {state.reference}</p>
      <p>Amount paid: <strong>{formatNaira(state.total)}</strong></p>
      <Link to="/" className="add-btn link-btn">Continue shopping</Link>
    </main>
  );
}