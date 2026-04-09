import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import "./Dashboard.css";

const REFRESH_SECS = 300;

export default function Dashboard() {
  const { user, userData, fetchUserData, logout } = useAuth();
  const navigate = useNavigate();

  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(REFRESH_SECS);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const isPaid = userData?.plan === "starter" || userData?.plan === "pro";
  const shareableLink = user ? `${window.location.origin}/qr/${user.uid}` : "";

  useEffect(() => {
    if (userData) {
      setUpiId(userData.upiId || "");
      setAmount(userData.amount || "");
    }
  }, [userData]);

  const generateQR = useCallback(async () => {
    if (!userData?.upiId) return;
    const token = Math.floor(Date.now() / (REFRESH_SECS * 1000));
    const upiUrl = `upi://pay?pa=${encodeURIComponent(userData.upiId)}&pn=${encodeURIComponent(userData.businessName || "")}&am=${userData.amount || ""}&t=${token}`;
    try {
      const url = await QRCode.toDataURL(upiUrl, { width: 220, margin: 2, color: { dark: "#000", light: "#fff" } });
      setQrUrl(url);
    } catch (e) {}
  }, [userData]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  useEffect(() => {
    // Sync timer with real time slot
    const now = Date.now();
    const slotMs = REFRESH_SECS * 1000;
    const remaining = Math.ceil((slotMs - (now % slotMs)) / 1000);
    setTimeLeft(remaining);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          generateQR();
          return REFRESH_SECS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [generateQR]);

  async function saveSettings() {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { upiId, amount });
      await fetchUserData(user.uid);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {}
    setSaving(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const pct = timeLeft / REFRESH_SECS;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span style={{ color: "var(--accent)", fontSize: 22 }}>⬡</span>
          <span>QRFlow</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active">📊 Dashboard</div>
          <div className="nav-item" onClick={() => navigate("/subscribe")}>💳 Subscription</div>
        </nav>
        <div className="sidebar-user">
          <div className="user-name">{userData?.businessName || "My Business"}</div>
          <div className="user-email">{user?.email}</div>
          <button className="btn btn-ghost" style={{ padding: "8px 0", fontSize: 13 }} onClick={handleLogout}>
            → Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1>Dashboard</h1>
            <p className="dash-sub">Manage your auto-refreshing payment QR</p>
          </div>
          {!isPaid && (
            <div className="trial-banner">
              ⚡ Free trial active · <span onClick={() => navigate("/subscribe")} style={{ cursor: "pointer", textDecoration: "underline" }}>Upgrade to unlock all features</span>
            </div>
          )}
        </div>

        <div className="dash-grid">
          {/* QR Card */}
          <div className="card qr-card">
            <div className="qr-card-header">
              <div>
                <div className="card-title">Live Payment QR</div>
                <div className="card-sub">Auto-refreshes every 5 minutes</div>
              </div>
              <div className="live-badge">
                <span className="live-dot" />
                Live
              </div>
            </div>

            {userData?.upiId ? (
              <>
                <div className="qr-display">
                  {qrUrl && <img src={qrUrl} alt="Payment QR" className="qr-img" />}
                </div>
                <div className="timer-section">
                  <div className="timer-bar-wrap">
                    <div className="timer-bar-fill" style={{ transform: `scaleX(${pct})`, background: pct < 0.15 ? "linear-gradient(90deg, #f43f5e, #ff9a00)" : "linear-gradient(90deg, var(--accent), var(--accent2))" }} />
                  </div>
                  <div className="timer-text">
                    Refreshes in <strong>{mins}:{secs.toString().padStart(2, "0")}</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="qr-empty">
                <div style={{ fontSize: 40 }}>⚙️</div>
                <p>Add your UPI ID in settings to generate your QR</p>
              </div>
            )}
          </div>

          {/* Share Link Card */}
          <div className="card share-card">
            <div className="card-title">Shareable Link</div>
            <div className="card-sub">Send this once to customers via WhatsApp — QR updates automatically</div>

            <div className="link-box">
              <span className="link-text">{shareableLink}</span>
              <button className="btn btn-primary" style={{ padding: "10px 18px", fontSize: 13, whiteSpace: "nowrap" }} onClick={copyLink}>
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="share-tip">
              <span>💡</span>
              <span>Customers open this link and always see your latest QR. You never need to send it again.</span>
            </div>
          </div>

          {/* Settings Card */}
          <div className="card settings-card">
            <div className="card-title">QR Settings</div>
            <div className="card-sub">Configure your payment details</div>

            <div className="settings-form">
              <div className="field">
                <label className="label">UPI ID</label>
                <input className="input" type="text" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Amount (optional)</label>
                <input className="input" type="number" placeholder="Leave blank for any amount" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={saveSettings} disabled={saving}>
                {saving ? <span className="spinner" /> : saved ? "✓ Saved!" : "Save Settings"}
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card stats-card">
            <div className="card-title">Account</div>
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-label">Plan</span>
                <span className="stat-value plan-pill">{userData?.plan === "pro" ? "🚀 Pro" : userData?.plan === "starter" ? "⭐ Starter" : "Free Trial"}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Business</span>
                <span className="stat-value">{userData?.businessName || "—"}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">UPI ID</span>
                <span className="stat-value">{userData?.upiId || "Not set"}</span>
              </div>
            </div>
            {!isPaid && (
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={() => navigate("/subscribe")}>
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
