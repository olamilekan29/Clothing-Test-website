import { useCart } from "../CartContext";

export default function Toast() {
  const { toast, dismissToast, setOpen } = useCart();
  if (!toast) return null;

  return (
    <div className="toast" role="status" aria-live="polite" key={toast.id}>
      <img src={toast.thumbnail} alt="" />
      <div className="toast-text">
        <p className="toast-title">Added to cart</p>
        <p className="toast-sub">{toast.title} · Size {toast.size}</p>
      </div>
      <button
        className="toast-view"
        onClick={() => {
          dismissToast();
          setOpen(true);
        }}
      >
        View cart
      </button>
    </div>
  );
}