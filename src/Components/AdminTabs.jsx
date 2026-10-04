import { NavLink } from "react-router-dom";
import { useAdminAlerts } from "../AdminAlertsContext";

export default function AdminTabs() {
  const { unseen } = useAdminAlerts();
  const cls = ({ isActive }) => `admin-tab ${isActive ? "active" : ""}`;

  return (
    <div className="admin-tabs">
      <NavLink to="/admin" end className={cls}>Products</NavLink>
      <NavLink to="/admin/orders" className={cls}>
        Orders{unseen > 0 && <span className="count">{unseen}</span>}
      </NavLink>
    </div>
  );
}