import { Link } from "react-router-dom";
import "./Landing.css";

const features = [
  { icon: "⚡", title: "Auto-Refreshing QR", desc: "QR updates every 5 minutes automatically. Your customers always see a valid code." },
  { icon: "🔗", title: "One Link Forever", desc: "Share a single link on WhatsApp once. No more manually sending new QRs." },
  { icon: "📱", title: "Works on Any Device", desc: "Customers open it on any phone or browser — no app download needed." },
  { icon: "⚙️", title: "Easy Setup", desc: "Add your UPI ID and business name. Live in under 2 minutes." },
  { icon: "📊", title: "Payment Dashboard", desc: "See your QR status, manage settings and subscriptions in one place." },
  { icon: "🔒", title: "Secure & Reliable", desc: "Each QR is time-bound and unique. Powered by Firebase-backed authentication." }
];

const plans = [
  {
    name: "Starter",
    price: "₹500",
    period: "/month",
    desc: "Perfect for solo business owners",
    features: ["1 QR Link", "Auto-refresh every 5 min", "WhatsApp shareable link", "Basic dashboard"],
    cta: "Start Free Trial",
    highlight: false
  },
  {
    name: "Pro",
    price: "₹1,500",
    period: "/month",
    desc: "For growing businesses",
    features: ["3 QR Links", "Custom refresh interval", "Priority support", "Analytics dashboard", "Custom branding"],
    cta: "Get Pro",
    highlight: true
  }
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">🇮🇳 Built for Indian businesses</div>
        <h1 className="hero-title">
          Stop sending<br />
          <span className="gradient-text">QR codes manually.</span>
        </h1>
        <p className="hero-sub">
          Your payment QR refreshes every 5 minutes — and your employees send it again and again.<br />
          QRFlow automates this completely. Share one link once. Forever.
        </p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
            Start Free Trial →
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ fontSize: 16, padding: "14px 32px" }}>
            Login
          </Link>
        </div>
        <div className="hero-proof">
          <span>✓ 7-day free trial</span>
          <span>✓ No credit card needed</span>
          <span>✓ Cancel anytime</span>
        </div>

        {/* Mock preview */}
        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-dot green" />
            <div className="preview-label">Live Payment QR</div>
            <div className="preview-qr">
              <div className="qr-grid">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={`qr-cell ${Math.random() > 0.5 ? "filled" : ""}`} />
                ))}
              </div>
            </div>
            <div className="preview-bar">
              <div className="preview-bar-fill" />
            </div>
            <div className="preview-timer">Refreshes in 4:23</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-label">Why QRFlow</div>
        <h2 className="section-title">Everything your business needs</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="section-label">How it works</div>
        <h2 className="section-title">Live in 3 steps</h2>
        <div className="steps">
          {[
            { n: "01", title: "Register & add your UPI ID", desc: "Create your account and enter your UPI ID or payment details." },
            { n: "02", title: "Get your shareable link", desc: "We generate a permanent link that always shows your latest QR." },
            { n: "03", title: "Share once on WhatsApp", desc: "Send the link to your customer. The QR updates itself — you never send again." }
          ].map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{s.n}</div>
              <div className="step-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section">
        <div className="section-label">Pricing</div>
        <h2 className="section-title">Simple, honest pricing</h2>
        <div className="plans">
          {plans.map((p, i) => (
            <div className={`plan-card ${p.highlight ? "plan-highlight" : ""}`} key={i}>
              {p.highlight && <div className="plan-badge">Most Popular</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">
                {p.price}<span>{p.period}</span>
              </div>
              <div className="plan-desc">{p.desc}</div>
              <ul className="plan-features">
                {p.features.map((f, j) => (
                  <li key={j}><span className="check">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/register" className={`btn ${p.highlight ? "btn-primary" : "btn-outline"}`} style={{ width: "100%", marginTop: "auto" }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="nav-logo" style={{ justifyContent: "center" }}>
          <span className="logo-icon">⬡</span>
          <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, fontWeight: 700 }}>QRFlow</span>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
          © 2024 QRFlow · Made for Indian small businesses
        </p>
      </footer>
    </div>
  );
}
