import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartDrawer from "./Components/CartDrawer";
import { useCart } from "./CartContext";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Toast from "./Components/Toast";

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
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

      </Routes>
      

      <CartDrawer />
      <Toast />
    </>
  );
}