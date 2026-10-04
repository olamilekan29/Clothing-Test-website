import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (mode === "signup" && form.name.trim().length < 2) return setError("Enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");

    setBusy(true);
    if (mode === "signin") {
      const { error } = await signIn(form.email, form.password);
      if (error) setError(error.message);
      else navigate(from, { replace: true });
    } else {
      const { data, error } = await signUp(form.email, form.password, form.name.trim());
      if (error) setError(error.message);
      else if (!data.session) {
        setNotice("Account created. Check your email to confirm it, then sign in.");
        setMode("signin");
      } else {
        navigate(from, { replace: true });
      }
    }
    setBusy(false);
  };

  return (
    <main className="product auth">
      <h2 className="co-title">{mode === "signin" ? "Sign in" : "Create your account"}</h2>
      {from === "/checkout" && (
        <p className="hint">Please sign in to complete your order. Your cart is saved.</p>
      )}

      <form onSubmit={submit} noValidate className="co-form">
        {mode === "signup" && (
          <label className="field">
            <span>Full name</span>
            <input value={form.name} onChange={update("name")} autoComplete="name" />
          </label>
        )}
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={update("email")} autoComplete="email" />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={update("password")}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />
        </label>

        {error && <p className="err-text auth-msg">{error}</p>}
        {notice && <p className="auth-notice">{notice}</p>}

        <button className="add-btn" type="submit" disabled={busy}>
          {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
            setNotice("");
          }}
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </main>
  );
}