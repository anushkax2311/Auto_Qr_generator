import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ businessName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.businessName || !form.email || !form.password) {
      return setError("Please fill in all fields.");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.businessName);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("This email is already registered.");
      else if (err.code === "auth/invalid-email") setError("Please enter a valid email.");
      else setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-logo">
          <span style={{ color: "var(--accent)", fontSize: 28 }}>⬡</span>
          <span className="auth-logo-text">QRFlow</span>
        </div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-sub">Start your 7-day free trial. No credit card needed.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label className="label">Business Name</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Sharma Electronics"
              value={form.businessName}
              onChange={e => setForm({ ...form, businessName: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", fontSize: 15, padding: "14px" }} disabled={loading}>
            {loading ? <span className="spinner" /> : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
