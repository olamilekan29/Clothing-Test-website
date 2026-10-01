import { useState } from "react";
import { supabase } from "../supabase";
import { CATEGORIES } from "../supabase-store/source";
import { uploadImage, removeImages } from "../supabase-store/storage";

const PRESETS = {
  Clothing: "XS, S, M, L, XL",
  Shoes: "38, 39, 40, 41, 42, 43",
  "One size": "One size",
};

export default function ProductForm({ product, onSaved, onCancel }) {
  const editing = !!product;
  const original = product?.images ?? [];
  const isNew = (url) => !original.includes(url);

  const [form, setForm] = useState({
    title: product?.title ?? "",
    category: product?.category ?? CATEGORIES[0].slug,
    brand: product?.brand ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    sale_price: product?.sale_price ?? "",
    sizes: product?.sizes?.join(", ") ?? "",
    stock: product?.stock ?? 0,
    active: product?.active ?? true,
  });
  const [images, setImages] = useState(original);
  const [removed, setRemoved] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) =>
    setForm({
      ...form,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const addFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      const urls = [];
      for (const file of files) urls.push(await uploadImage(file));
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err.message || "Upload failed");
    }
    setBusy(false);
  };

  const removeImage = (url) => {
    setImages((prev) => prev.filter((u) => u !== url));
    setRemoved((prev) => [...prev, url]);
  };

  const makeMain = (url) =>
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);

  const cancel = async () => {
    // Delete photos uploaded during this edit that were never saved.
    await removeImages([...images, ...removed].filter(isNew));
    onCancel();
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");

    const price = Number(form.price);
    const sale = form.sale_price === "" ? null : Number(form.sale_price);
    const stock = Number(form.stock);
    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);

    if (form.title.trim().length < 2) return setError("Enter a product name");
    if (!Number.isInteger(price) || price <= 0) return setError("Price must be a whole number above 0");
    if (sale !== null && (!Number.isInteger(sale) || sale <= 0 || sale >= price))
      return setError("Sale price must be a whole number lower than the price");
    if (!Number.isInteger(stock) || stock < 0) return setError("Stock must be 0 or more");
    if (sizes.length === 0) return setError("Add at least one size (use 'One size' for bags)");
    if (images.length === 0) return setError("Add at least one photo");

    const row = {
      title: form.title.trim(),
      category: form.category,
      brand: form.brand.trim(),
      description: form.description.trim(),
      price,
      sale_price: sale,
      sizes,
      stock,
      images,
      active: form.active,
    };

    setBusy(true);
    const { error: dbError } = editing
      ? await supabase.from("products").update(row).eq("id", product.id)
      : await supabase.from("products").insert(row);

    if (dbError) {
      setError(dbError.message);
      setBusy(false);
      return;
    }
    await removeImages(removed);
    setBusy(false);
    onSaved();
  };

  return (
    <form className="admin-form" onSubmit={save} noValidate>
      <h3>{editing ? "Edit product" : "Add product"}</h3>

      <div className="grid2">
        <label className="field">
          <span>Name</span>
          <input value={form.title} onChange={set("title")} />
        </label>
        <label className="field">
          <span>Category</span>
          <select value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Price (₦)</span>
          <input type="number" min="0" value={form.price} onChange={set("price")} />
        </label>
        <label className="field">
          <span>Sale price (₦, optional)</span>
          <input type="number" min="0" value={form.sale_price} onChange={set("sale_price")} />
        </label>
        <label className="field">
          <span>Stock (how many in total)</span>
          <input type="number" min="0" value={form.stock} onChange={set("stock")} />
        </label>
        <label className="field">
          <span>Brand (optional)</span>
          <input value={form.brand} onChange={set("brand")} />
        </label>
      </div>

      <div className="field">
        <span>Sizes (separated by commas)</span>
        <input value={form.sizes} onChange={set("sizes")} placeholder="S, M, L, XL" />
        <div className="presets">
          {Object.entries(PRESETS).map(([label, value]) => (
            <button
              type="button"
              className="btn-light"
              key={label}
              onClick={() => setForm({ ...form, sizes: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span>Description</span>
        <textarea rows="4" value={form.description} onChange={set("description")} />
      </label>

      <div className="field">
        <span>Photos (the first one is the main photo; use JPG or PNG)</span>
        <div className="photo-grid">
          {images.map((url, i) => (
            <div className="photo" key={url}>
              <img src={url} alt="" />
              {i === 0 && <span className="main-tag">Main</span>}
              <button type="button" className="x" onClick={() => removeImage(url)} aria-label="Remove photo">✕</button>
              {i !== 0 && (
                <button type="button" className="make-main" onClick={() => makeMain(url)}>Make main</button>
              )}
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={addFiles} disabled={busy} />
      </div>

      <label className="check">
        <input type="checkbox" checked={form.active} onChange={set("active")} />
        Visible in the store
      </label>

      {error && <p className="err-text auth-msg">{error}</p>}

      <div className="form-actions">
        <button className="add-btn" type="submit" disabled={busy}>
          {busy ? "Please wait..." : editing ? "Save changes" : "Add product"}
        </button>
        <button className="btn-light" type="button" onClick={cancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  );
}