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


// import { Link, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import ProductPage from "./pages/ProductPage";
// import Checkout from "./pages/Checkout";
// import OrderSuccess from "./pages/OrderSuccess";
// import Wishlist from "./pages/Wishlist";
// import CartDrawer from "./Components/CartDrawer";
// import Toast from "./Components/Toast";
// import Footer from "./Components/Footer";
// import { useCart } from "./CartContext";
// import { useWishlist } from "./WishlistContext";

// export default function App() {
//   const { count, setOpen } = useCart();
//   const { count: wishCount } = useWishlist();

//   return (
//     <div className="app">
//       <header className="header">
//         <Link to="/wishlist" className="wish-link">
//           ♡ Wishlist{wishCount > 0 && <span className="count">{wishCount}</span>}
//         </Link>
//         <Link to="/"><h1>THREAD</h1></Link>
//         <button className="cart-btn" onClick={() => setOpen(true)}>
//           Cart{count > 0 && <span className="count">{count}</span>}
//         </button>
//       </header>

//       <div className="app-body">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/product/:id" element={<ProductPage />} />
//           <Route path="/wishlist" element={<Wishlist />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="/order-success" element={<OrderSuccess />} />
//         </Routes>
//       </div>

//       <Footer />
//       <CartDrawer />
//       <Toast />
//     </div>
//   );
// }


// import { Link, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import ProductPage from "./pages/ProductPage";
// import Checkout from "./pages/Checkout";
// import OrderSuccess from "./pages/OrderSuccess";
// import Wishlist from "./pages/Wishlist";
// import Login from "./pages/Login";
// import CartDrawer from "./Components/CartDrawer";
// import Toast from "./Components/Toast";
// import Footer from "./Components/Footer";
// import RequireAuth from "./Components/RequireAuth";
// import { useCart } from "./CartContext";
// import { useWishlist } from "./WishlistContext";
// import { useAuth } from "./AuthContext";
// import Admin from "./pages/Admin";

// export default function App() {
//   const { count, setOpen } = useCart();
//   const { count: wishCount } = useWishlist();
//   const { user, isAdmin, signOut } = useAuth();

//   return (
//     <div className="app">
//       <header className="header">
//         <Link to="/wishlist" className="wish-link">
//           ♡ Wishlist{wishCount > 0 && <span className="count">{wishCount}</span>}
//         </Link>
//         <Link to="/"><h1>THREAD</h1></Link>

//         <div className="header-right">
//           {user ? (
//             <>
//               {isAdmin && <Link to="/admin" className="acct-btn">Admin</Link>}
//               <button className="acct-btn" onClick={signOut}>Sign out</button>
//             </>
//           ) : (
//             <Link to="/login" className="acct-btn">Sign in</Link>
//           )}
//           <button className="cart-btn" onClick={() => setOpen(true)}>
//             Cart{count > 0 && <span className="count">{count}</span>}
//           </button>
//         </div>
//       </header>

//       <div className="app-body">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/product/:id" element={<ProductPage />} />
//           <Route path="/wishlist" element={<Wishlist />} />
//           <Route path="/login" element={<Login />} />
//           <Route
//   path="/admin"
//   element={
//     <RequireAuth adminOnly>
//       <Admin />
//     </RequireAuth>
//   }
// />
//           <Route
//             path="/checkout"
//             element={
//               <RequireAuth>
//                 <Checkout />
//               </RequireAuth>
//             }
//           />
//           <Route path="/order-success" element={<OrderSuccess />} />
//         </Routes>
//       </div>

//       <Footer />
//       <CartDrawer />
//       <Toast />
//     </div>
//   );
// }

import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import CartDrawer from "./Components/CartDrawer";
import Toast from "./Components/Toast";
import Footer from "./Components/Footer";
import RequireAuth from "./Components/RequireAuth";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useAuth } from "./AuthContext";
import { useAdminAlerts } from "./AdminAlertsContext";

export default function App() {
  const { count, setOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, isAdmin, signOut } = useAuth();
  const { unseen } = useAdminAlerts();

  return (
    <div className="app">
      <header className="header">
        <Link to="/wishlist" className="wish-link">
          ♡ Wishlist{wishCount > 0 && <span className="count">{wishCount}</span>}
        </Link>
        <Link to="/"><h1>THREAD</h1></Link>

        <div className="header-right">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="acct-btn">
                  Admin{unseen > 0 && <span className="count">{unseen}</span>}
                </Link>
              )}
              <button className="acct-btn" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <Link to="/login" className="acct-btn">Sign in</Link>
          )}
          <button className="cart-btn" onClick={() => setOpen(true)}>
            Cart{count > 0 && <span className="count">{count}</span>}
          </button>
        </div>
      </header>

      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route
            path="/admin"
            element={
              <RequireAuth adminOnly>
                <Admin />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RequireAuth adminOnly>
                <AdminOrders />
              </RequireAuth>
            }
          />
        </Routes>
      </div>

      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
}