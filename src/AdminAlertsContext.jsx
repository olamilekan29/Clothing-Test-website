import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";
import { formatNaira } from "./utils";

const AdminAlertsContext = createContext({ unseen: 0, version: 0, refresh: () => {} });
export const useAdminAlerts = () => useContext(AdminAlertsContext);

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    /* sound is optional */
  }
}

export function AdminAlertsProvider({ children }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [unseen, setUnseen] = useState(0);
  const [version, setVersion] = useState(0);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const refresh = useCallback(async () => {
    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("admin_seen", false)
      .neq("status", "pending");
    setUnseen(count ?? 0);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setUnseen(0);
      return;
    }
    refresh();

    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        setVersion((v) => v + 1);
        refresh();

        const row = payload.new;
        // An order becomes "paid" after Paystack confirms it
        if (payload.eventType === "UPDATE" && row?.status === "paid" && !row.admin_seen) {
          setToast(row);
          beep();
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setToast(null), 12000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearTimeout(timer.current);
    };
  }, [isAdmin, refresh]);

  // Shows the count in the browser tab title, e.g. "(2) New orders"
  useEffect(() => {
    if (!isAdmin) return;
    document.title = unseen > 0 ? `(${unseen}) New orders · THREAD` : "THREAD";
  }, [unseen, isAdmin]);

  return (
    <AdminAlertsContext.Provider value={{ unseen, version, refresh }}>
      {children}
      {toast && (
        <div className="order-alert" role="alert">
          <div>
            <p className="order-alert-title">New order · {formatNaira(toast.total)}</p>
            <p className="order-alert-sub">{toast.customer_name}</p>
          </div>
          <button
            className="toast-view"
            onClick={() => {
              setToast(null);
              navigate("/admin/orders");
            }}
          >
            View
          </button>
          <button className="order-alert-x" onClick={() => setToast(null)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}
    </AdminAlertsContext.Provider>
  );
}