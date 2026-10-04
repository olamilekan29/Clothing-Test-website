import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import AdminTabs from "../Components/AdminTabs";
import { useAdminAlerts } from "../AdminAlertsContext";
import { formatNaira } from "../utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "paid", label: "New (paid)" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "pending", label: "Unpaid" },
];

const NEXT = {
  paid: { to: "processing", label: "Start processing" },
  processing: { to: "shipped", label: "Mark as shipped" },
  shipped: { to: "delivered", label: "Mark as delivered" },
};

const LABEL = {
  pending: "Unpaid",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const when = (iso) =>
  new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });

export default function AdminOrders() {
  const { version, refresh } = useAdminAlerts();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      setMsg(error.message);
      setStatus("error");
      return;
    }
    setOrders(data);
    setStatus("ready");
  };

  // Loads on open, and again whenever a live order event arrives
  useEffect(() => {
    load();
  }, [version]);

  const patch = async (id, changes) => {
    setMsg("");
    const { error } = await supabase.from("orders").update(changes).eq("id", id);
    if (error) return setMsg(error.message);
    await load();
    refresh();
  };

  const toggle = (o) => {
    const opening = openId !== o.id;
    setOpenId(opening ? o.id : null);
    if (opening && !o.admin_seen && o.status !== "pending") patch(o.id, { admin_seen: true });
  };

  const cancel = (o) => {
    if (
      !window.confirm(
        "Cancel this order? Stock is not put back automatically, and any refund must be done in your Paystack dashboard."
      )
    )
      return;
    patch(o.id, { status: "cancelled", admin_seen: true });
  };

  const visible = orders.filter((o) =>
    filter === "all" ? o.status !== "pending" : o.status === filter
  );

  return (
    <main className="product admin">
      <Link to="/" className="back">← Back to store</Link>
      <AdminTabs />

      <div className="admin-head">
        <h2>Orders</h2>
      </div>

      <div className="order-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? "active" : ""}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {msg && <p className="admin-msg">{msg}</p>}
      {status === "loading" && <p className="msg">Loading...</p>}
      {status === "ready" && visible.length === 0 && <p className="msg">No orders here yet.</p>}

      <div className="order-list">
        {visible.map((o) => {
          const isNew = !o.admin_seen && o.status !== "pending";
          return (
            <article key={o.id} className={`order-card ${isNew ? "unseen" : ""}`}>
              <button className="order-row" onClick={() => toggle(o)}>
                <span className="o-main">
                  <span>
                    <strong>{o.customer_name}</strong>
                    {isNew && <span className="new-tag">NEW</span>}
                  </span>
                  <small>
                    {when(o.created_at)} · {o.order_items.length} item(s)
                  </small>
                </span>
                <span className="o-total">{formatNaira(o.total)}</span>
                <span className={`status st-${o.status}`}>{LABEL[o.status]}</span>
              </button>

              {openId === o.id && (
                <div className="order-detail">
                  <div className="od-cols">
                    <div>
                      <h4>Customer</h4>
                      <p>{o.customer_name}</p>
                      <p><a href={`tel:${o.customer_phone}`}>{o.customer_phone}</a></p>
                      <p><a href={`mailto:${o.customer_email}`}>{o.customer_email}</a></p>
                      <h4>Deliver to</h4>
                      <p>{o.address}, {o.city}, {o.state}</p>
                    </div>

                    <div>
                      <h4>Items</h4>
                      <ul className="od-items">
                        {o.order_items.map((i) => (
                          <li key={i.id}>
                            {i.image && <img src={i.image} alt="" />}
                            <div>
                              <p className="t">{i.title}</p>
                              <p className="s">Size {i.size} · Qty {i.quantity}</p>
                            </div>
                            <p className="p">{formatNaira(i.unit_price * i.quantity)}</p>
                          </li>
                        ))}
                      </ul>
                      <p className="line"><span>Subtotal</span><span>{formatNaira(o.subtotal)}</span></p>
                      <p className="line">
                        <span>Shipping</span>
                        <span>{o.shipping === 0 ? "Free" : formatNaira(o.shipping)}</span>
                      </p>
                      <p className="line total"><span>Total</span><span>{formatNaira(o.total)}</span></p>
                    </div>
                  </div>

                  <p className="ref">
                    Reference: {o.reference}
                    {o.paid_at && ` · Paid ${when(o.paid_at)}`}
                  </p>

                  <div className="form-actions">
                    {NEXT[o.status] && (
                      <button
                        className="btn-dark"
                        onClick={() => patch(o.id, { status: NEXT[o.status].to, admin_seen: true })}
                      >
                        {NEXT[o.status].label}
                      </button>
                    )}
                    {["paid", "processing", "shipped"].includes(o.status) && (
                      <button className="btn-light btn-danger" onClick={() => cancel(o)}>
                        Cancel order
                      </button>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}