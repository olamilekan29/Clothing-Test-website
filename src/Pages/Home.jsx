// import { useEffect, useMemo, useState } from "react";
// import { CATEGORIES, getProducts } from "../api";
// import ProductCard from "../Components/ProductCard";

// export default function Home() {
//   const [category, setCategory] = useState("all");
//   const [products, setProducts] = useState([]);
//   const [status, setStatus] = useState("loading");
//   const [query, setQuery] = useState("");
//   const [sort, setSort] = useState("featured");

//   useEffect(() => {
//     let cancelled = false;
//     setStatus("loading");
//     getProducts(category)
//       .then((data) => {
//         if (!cancelled) {
//           setProducts(data);
//           setStatus("ready");
//         }
//       })
//       .catch(() => !cancelled && setStatus("error"));
//     return () => {
//       cancelled = true;
//     };
//   }, [category]);

//   const visible = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const sale = (p) => p.price * (1 - p.discountPercentage / 100);

//     let list = products.filter(
//       (p) =>
//         !q ||
//         p.title.toLowerCase().includes(q) ||
//         (p.brand || "").toLowerCase().includes(q)
//     );

//     if (sort === "price-asc") list = [...list].sort((a, b) => sale(a) - sale(b));
//     if (sort === "price-desc") list = [...list].sort((a, b) => sale(b) - sale(a));
//     if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
//     if (sort === "discount")
//       list = [...list].sort((a, b) => b.discountPercentage - a.discountPercentage);

//     return list;
//   }, [products, query, sort]);

//   return (
//     <>
//       <nav className="filters">
//         <button
//           className={category === "all" ? "active" : ""}
//           onClick={() => setCategory("all")}
//         >
//           All
//         </button>
//         {CATEGORIES.map((c) => (
//           <button
//             key={c.slug}
//             className={category === c.slug ? "active" : ""}
//             onClick={() => setCategory(c.slug)}
//           >
//             {c.label}
//           </button>
//         ))}
//       </nav>

//       <div className="toolbar">
//         <input
//           type="search"
//           placeholder="Search products or brands..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <select value={sort} onChange={(e) => setSort(e.target.value)}>
//           <option value="featured">Featured</option>
//           <option value="price-asc">Price: low to high</option>
//           <option value="price-desc">Price: high to low</option>
//           <option value="rating">Top rated</option>
//           <option value="discount">Biggest discount</option>
//         </select>
//       </div>

//       <main>
//         {status === "loading" && <p className="msg">Loading...</p>}
//         {status === "error" && <p className="msg">Couldn't load products.</p>}
//         {status === "ready" && visible.length === 0 && (
//           <p className="msg">No products match "{query}".</p>
//         )}
//         {status === "ready" && visible.length > 0 && (
//           <div className="grid">
//             {visible.map((p) => (
//               <ProductCard key={p.id} product={p} />
//             ))}
//           </div>
//         )}
//       </main>
//     </>
//   );
// }



import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES, getProducts } from "../api";
import ProductCard from "../Components/ProductCard";

const TILES = [
  { slug: "mens-shirts", label: "Men's Shirts" },
  { slug: "womens-dresses", label: "Dresses" },
  { slug: "womens-shoes", label: "Women's Shoes" },
  { slug: "womens-bags", label: "Bags" },
];

export default function Home() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const shopRef = useRef(null);

  const setCategory = (slug) => {
    if (slug === "all") setParams({});
    else setParams({ category: slug });
  };

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getProducts(category)
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setStatus("ready");
        }
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [category]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sale = (p) => p.price * (1 - p.discountPercentage / 100);

    let list = products.filter(
      (p) =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q)
    );

    if (sort === "price-asc") list = [...list].sort((a, b) => sale(a) - sale(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => sale(b) - sale(a));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "discount")
      list = [...list].sort((a, b) => b.discountPercentage - a.discountPercentage);

    return list;
  }, [products, query, sort]);

  const showHero = category === "all";

  return (
    <>
      {showHero && (
        <>
          <section className="hero">
            <div className="hero-inner">
              <p className="hero-kicker">New season</p>
              <h2>Dress the way you feel.</h2>
              <p className="hero-sub">
                Shirts, dresses, shoes and bags picked for everyday style.
              </p>
              <button
                className="hero-btn"
                onClick={() => shopRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Shop now
              </button>
            </div>
          </section>

          <section className="tiles">
            {TILES.map((t) => (
              <Link key={t.slug} to={`/?category=${t.slug}`} className="tile">
                <span>{t.label}</span>
                <span className="arrow">→</span>
              </Link>
            ))}
          </section>
        </>
      )}

      <div ref={shopRef} className="shop-anchor" />

      <nav className="filters">
        <button
          className={category === "all" ? "active" : ""}
          onClick={() => setCategory("all")}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            className={category === c.slug ? "active" : ""}
            onClick={() => setCategory(c.slug)}
          >
            {c.label}
          </button>
        ))}
      </nav>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search products or brands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
          <option value="discount">Biggest discount</option>
        </select>
      </div>

      <main>
        {status === "loading" && <p className="msg">Loading...</p>}
        {status === "error" && <p className="msg">Couldn't load products.</p>}
        {status === "ready" && visible.length === 0 && (
          <p className="msg">No products match "{query}".</p>
        )}
        {status === "ready" && visible.length > 0 && (
          <div className="grid">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}