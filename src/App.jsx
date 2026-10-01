import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartDrawer from "./components/CartDrawer";
import { useCart } from "./CartContext";

export default function App() {
  const { count, setOpen } = useCart();

  return (
    <>
      <header className="header">
        <Link to="/"><h1>THREAD</h1></Link>
        <button className="cart-btn" onClick={() => setOpen(true)}>
          Cart{count > 0 && <span className="count">{count}</span>}
        </button>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>

      <CartDrawer />
    </>
  );
}