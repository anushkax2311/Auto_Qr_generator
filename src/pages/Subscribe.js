import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Subscribe.css";

// Replace with your actual Razorpay Key ID from Razorpay Dashboard
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 500,
    priceDisplay: "₹500",
    period: "/month",
    desc: "Perfect for solo businesses",
    features: ["1 QR Link", "Auto-refresh every 5 min", "WhatsApp shareable link", "Basic dashboard"],
    color: "var(--accent)"
  },
  {
    id: "pro",
    name: "Pro",
    price: 1500,
    priceDisplay: "₹1,500",
    period: "/month",
    desc: "For growing businesses",
    features: ["3 QR Links", "Custom refresh interval", "Priority support", "Analytics", "Custom branding"],
    color: "var(--accent2)",
    highlight: true
  }
];

export default function Subscribe() {
  const { user, userData, fetchUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  function loadRazorpay(plan) {
    setLoading(plan.id);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: RAZORPAY_KEY,
        amount: plan.price * 100, // in paise
        currency: "INR",
        name: "QRFlow",
        description: `${plan.name} Plan – Monthly`,
        image: "",
        handler: async function (response) {
          // Payment successful — update Firestore
          try {
            await updateDoc(doc(db, "users", user.uid), {
              plan: plan.id,
              razorpay_payment_id: response.razorpay_payment_id,
              planActivatedAt: new Date().toISOString()
            });
            await fetchUserData(user.uid);
            navigate("/dashboard");
          } catch (e) {
            alert("Payment received but activation failed. Please contact support.");
          }
        },
        prefill: {
          email: user?.email || "",
          name: userData?.businessName || ""
        },
        theme: { color: "#7c5cfc" },
        modal: {
          ondismiss: () => setLoading(null)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(null);
    };
    script.onerror = () => {
      alert("Failed to load payment gateway. Please try again.");
      setLoading(null);
    };
    document.body.appendChild(script);
  }

  const currentPlan = userData?.plan;

  return (
    <div className="subscribe-page">
      <div className="sub-glow" />
      <div className="sub-content">
        <div className="sub-badge">💳 Subscription</div>
        <h1 className="sub-title">Choose your plan</h1>
        <p className="sub-desc">Unlock your auto-refreshing payment QR link for your business.</p>

        <div className="plans-row">
          {plans.map(plan => (
            <div key={plan.id} className={`sub-plan-card ${plan.highlight ? "highlight" : ""}`}>
              {plan.highlight && <div className="plan-badge-top">Most Popular</div>}

              <div className="plan-top">
                <div className="plan-name-lg">{plan.name}</div>
                <div className="plan-price-lg">
                  {plan.priceDisplay}<span>{plan.period}</span>
                </div>
                <div className="plan-desc-sm">{plan.desc}</div>
              </div>

              <ul className="plan-feats">
                {plan.features.map((f, i) => (
                  <li key={i}><span style={{ color: "var(--green)" }}>✓</span> {f}</li>
                ))}
              </ul>

              {currentPlan === plan.id ? (
                <div className="current-plan-badge">✓ Current Plan</div>
              ) : (
                <button
                  className={`btn ${plan.highlight ? "btn-primary" : "btn-outline"}`}
                  style={{ width: "100%", fontSize: 15, padding: "13px" }}
                  onClick={() => loadRazorpay(plan)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id ? <span className="spinner" /> : `Subscribe – ${plan.priceDisplay}/mo`}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="sub-notes">
          <div className="note">🔒 Payments secured by Razorpay</div>
          <div className="note">✉️ Receipt sent to your email</div>
          <div className="note">❌ Cancel anytime</div>
        </div>

        <button className="btn btn-ghost" onClick={() => navigate("/dashboard")} style={{ marginTop: 8 }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
