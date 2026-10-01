import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import ProductForm from "../Components/ProductForm";
import { removeImages } from "../supabase-store/storage";
import { CATEGORIES } from "../supabase-store/source";
import { formatNaira } from "../utils";

const categoryLabel = (slug) => CATEGORIES.find((c) => c.slug === slug)?.label || slug;

function StockCell({ product, onSave }) {
  const [value, setValue] = useState(String(product.stock));
  useEffect(() => setValue(String(product.stock)), [product.stock]);

  const commit = () => {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) return setValue(String(product.stock));
    if (n !== product.stock) onSave(n);
  };

  return (
    <input
      className="stock-input"
      type="number"
      min="0"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
    />
  );
}

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [editing, setEditing] = useState(null); // null = closed, "new" = add, product = edit
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setMsg(error.message);
      setStatus("error");
      return;
    }
    setProducts(data);
    setStatus("ready");
  };

  useEffect(() => {
    load();
  }, []);

  const patch = async (id, changes) => {
    setMsg("");
    const { error } = await supabase.from("products").update(changes).eq("id", id);
    if (error) setMsg(error.message);
    else load();
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}" permanently? This can't be undone.`)) return;
    setMsg("");
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return setMsg(error.message);
    await removeImages(p.images || []);
    load();
  };

  if (editing) {
    return (
      <main className="product admin">
        <ProductForm
          key={editing === "new" ? "new" : editing.id}
          product={editing === "new" ? null : editing}
          onSaved={() => {
            setEditing(null);
            load();
          }}
          onCancel={() => setEditing(null)}
        />
      </main>
    );
  }

  return (
    <main className="product admin">
      <Link to="/" className="back">← Back to store</Link>

      <div className="admin-head">
        <h2>Products ({products.length})</h2>
        <button className="btn-dark" onClick={() => setEditing("new")}>+ Add product</button>
      </div>

      {msg && <p className="admin-msg">{msg}</p>}
      {status === "loading" && <p className="msg">Loading...</p>}
      {status === "ready" && products.length === 0 && (
        <p className="msg">No products yet. Click "Add product" to create the first one.</p>
      )}

      {products.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="prod-cell">
                      <img src={p.images?.[0]} alt="" />
                      <div>
                        <p className="t">{p.title}</p>
                        <p className="s">{categoryLabel(p.category)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {formatNaira(p.sale_price && p.sale_price < p.price ? p.sale_price : p.price)}
                  </td>
                  <td>
                    <StockCell product={p} onSave={(n) => patch(p.id, { stock: n })} />
                    {p.stock === 0 && <span className="tag-sold">Sold out</span>}
                  </td>
                  <td>
                    <button
                      className={`pill ${p.active ? "on" : "off"}`}
                      onClick={() => patch(p.id, { active: !p.active })}
                      title="Click to show or hide in the store"
                    >
                      {p.active ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-light" onClick={() => setEditing(p)}>Edit</button>
                      <button className="btn-light btn-danger" onClick={() => remove(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}