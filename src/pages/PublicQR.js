import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import QRCode from "qrcode";
import "./PublicQR.css";

const REFRESH_SECS = 300;

export default function PublicQR() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(REFRESH_SECS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (!snap.exists()) return setError("QR link not found.");
        const data = snap.data();
        if (data.plan === "free" || !data.plan) return setError("This QR link is not active.");
        setUserData(data);
      } catch (e) {
        setError("Failed to load. Please try again.");
      }
      setLoading(false);
    }
    load();
  }, [uid]);

  const generateQR = useCallback(async () => {
    if (!userData?.upiId) return;
    const token = Math.floor(Date.now() / (REFRESH_SECS * 1000));
    const upiUrl = `upi://pay?pa=${encodeURIComponent(userData.upiId)}&pn=${encodeURIComponent(userData.businessName || "")}&am=${userData.amount || ""}&t=${token}`;
    try {
      const url = await QRCode.toDataURL(upiUrl, { width: 260, margin: 2 });
      setQrUrl(url);
    } catch (e) {}
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    generateQR();

    const now = Date.now();
    const slotMs = REFRESH_SECS * 1000;
    const remaining = Math.ceil((slotMs - (now % slotMs)) / 1000);
    setTimeLeft(remaining);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { generateQR(); return REFRESH_SECS; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [userData, generateQR]);

  const pct = timeLeft / REFRESH_SECS;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  if (loading) return (
    <div className="pqr-center">
      <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  );

  if (error) return (
    <div className="pqr-center">
      <div className="pqr-error">
        <div style={{ fontSize: 40 }}>⚠️</div>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="pqr-page">
      <div className="pqr-glow" />
      <div className="pqr-card">
        <div className="pqr-badge">Scan to Pay</div>

        <div className="pqr-business">{userData?.businessName}</div>
        <div className="pqr-sub">Payment QR · Auto-updates every 5 min</div>

        {qrUrl && (
          <div className="pqr-qr-wrap">
            <div className="pqr-corner tl" /><div className="pqr-corner tr" />
            <div className="pqr-corner bl" /><div className="pqr-corner br" />
            <img src={qrUrl} alt="Payment QR" style={{ width: 240, height: 240, borderRadius: 8 }} />
          </div>
        )}

        {userData?.amount && (
          <div className="pqr-amount">
            <span>Amount Due</span>
            <span className="pqr-amount-val">₹ {userData.amount}</span>
          </div>
        )}

        <div className="pqr-timer-section">
          <div className="pqr-bar-wrap">
            <div className="pqr-bar-fill" style={{
              transform: `scaleX(${pct})`,
              background: pct < 0.15
                ? "linear-gradient(90deg, #f43f5e, #ff9a00)"
                : "linear-gradient(90deg, #7c5cfc, #c084fc)"
            }} />
          </div>
          <div className="pqr-timer-txt">Refreshes in {mins}:{secs.toString().padStart(2, "0")}</div>
        </div>

        <div className="pqr-live">
          <span className="pqr-dot" />
          QR updates automatically
        </div>

        <div className="pqr-footer">Powered by QRFlow</div>
      </div>
    </div>
  );
}
