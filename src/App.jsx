// import { Link, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import ProductPage from "./pages/ProductPage";
// import CartDrawer from "./Components/CartDrawer";
// import { useCart } from "./CartContext";
// import Checkout from "./pages/Checkout";
// import OrderSuccess from "./pages/OrderSuccess";
// import Toast from "./Components/Toast";

// export default function App() {
//   const { count, setOpen } = useCart();

//   return (
//     <>
//       <header className="header">
//         <Link to="/"><h1>THREAD</h1></Link>
//         <button className="cart-btn" onClick={() => setOpen(true)}>
//           Cart{count > 0 && <span className="count">{count}</span>}
//         </button>
//       </header>

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/product/:id" element={<ProductPage />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/order-success" element={<OrderSuccess />} />

//       </Routes>
      

//       <CartDrawer />
//       <Toast />
//     </>
//   );
// }


// import { Link, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import ProductPage from "./pages/ProductPage";
// import Checkout from "./pages/Checkout";
// import OrderSuccess from "./pages/OrderSuccess";
// import Wishlist from "./pages/Wishlist";
// import CartDrawer from "./Components/CartDrawer";
// import Toast from "./Components/Toast";
// import { useCart } from "./CartContext";
// import { useWishlist } from "./WishlistContext";

// export default function App() {
//   const { count, setOpen } = useCart();
//   const { count: wishCount } = useWishlist();

//   return (
//     <>
//       <header className="header">
//         <Link to="/wishlist" className="wish-link">
//           ♡ Wishlist{wishCount > 0 && <span className="count">{wishCount}</span>}
//         </Link>
//         <Link to="/"><h1>THREAD</h1></Link>
//         <button className="cart-btn" onClick={() => setOpen(true)}>
//           Cart{count > 0 && <span className="count">{count}</span>}
//         </button>
//       </header>

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/product/:id" element={<ProductPage />} />
//         <Route path="/wishlist" element={<Wishlist />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/order-success" element={<OrderSuccess />} />
//       </Routes>

//       <CartDrawer />
//       <Toast />
//     </>
//   );
// }


import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import CartDrawer from "./Components/CartDrawer";
import Toast from "./Components/Toast";
import Footer from "./Components/Footer";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

export default function App() {
  const { count, setOpen } = useCart();
  const { count: wishCount } = useWishlist();

  return (
    <div className="app">
      <header className="header">
        <Link to="/wishlist" className="wish-link">
          ♡ Wishlist{wishCount > 0 && <span className="count">{wishCount}</span>}
        </Link>
        <Link to="/"><h1>THREAD</h1></Link>
        <button className="cart-btn" onClick={() => setOpen(true)}>
          Cart{count > 0 && <span className="count">{count}</span>}
        </button>
      </header>

      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>

      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
}