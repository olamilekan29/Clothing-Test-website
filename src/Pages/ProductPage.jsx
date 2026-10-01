import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, getSizes } from "../api";
import { useCart } from "../CartContext";
import { formatNaira, saleNGN, listNGN } from "../utils";

export default function ProductPage() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [needSize, setNeedSize] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setActiveImg(0);
    setSize(null);
    setNeedSize(false);
    getProduct(id)
      .then((p) => {
        if (!cancelled) {
          setProduct(p);
          setStatus("ready");
        }
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") return <p className="msg">Loading...</p>;
  if (status === "error" || !product) return <p className="msg">Product not found.</p>;

  
  const sizes = getSizes(product);

  const handleAdd = () => {
    if (!size) return setNeedSize(true);
    add(product, size);
  };

  return (
    <main className="product">
      <Link to="/" className="back">← Back to shop</Link>

      <div className="product-layout">
        <div className="gallery">
          <div className="main-img">
            <img src={product.images[activeImg]} alt={product.title} />
          </div>
          <div className="thumbs">
            {product.images.map((img, i) => (
              <button
                key={img}
                className={i === activeImg ? "active" : ""}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="info">
          <p className="brand">{product.brand}</p>
          <h2>{product.title}</h2>
          <p className="price big">
  {formatNaira(saleNGN(product))}
  {listNGN(product) > saleNGN(product) && <s>{formatNaira(listNGN(product))}</s>}
</p>
          <p className="desc">{product.description}</p>

          <p className="label">Size {needSize && <span className="err">Please select a size</span>}</p>
          <div className="sizes">
            {sizes.map((s) => (
              <button
                key={s}
                className={s === size ? "active" : ""}
                onClick={() => {
                  setSize(s);
                  setNeedSize(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <button className="add-btn" onClick={handleAdd} disabled={product.stock === 0}>
            {product.stock === 0 ? "Sold out" : "Add to cart"}
          </button>
          {product.stock > 0 && product.stock <= 10 && (
            <p className="low">Only {product.stock} left</p>
          )}
        </div>
      </div>
    </main>
  );
}