import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { id, title, thumbnail, price, discountPercentage, brand } = product;
  const salePrice = price * (1 - discountPercentage / 100);

  return (
    <Link to={`/product/${id}`} className="card-link">
      <article className="card">
        <div className="card-img">
          <img src={thumbnail} alt={title} loading="lazy" />
          {discountPercentage > 10 && (
            <span className="badge">-{Math.round(discountPercentage)}%</span>
          )}
        </div>
        <p className="brand">{brand}</p>
        <h3>{title}</h3>
        <p className="price">
          ${salePrice.toFixed(2)}
          {discountPercentage > 0 && <s>${price.toFixed(2)}</s>}
        </p>
      </article>
    </Link>
  );
}