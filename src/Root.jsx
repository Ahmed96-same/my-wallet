import { useState } from "react";
import App from "./App.jsx";
import InstagramResponder from "./InstagramResponder.jsx";

const STYLES = `
  *{box-sizing:border-box;margin:0;padding:0}
  .mode-bar{
    position:fixed;bottom:0;left:50%;transform:translateX(-50%);
    width:100%;max-width:520px;
    display:flex;border-top:1px solid #252525;
    background:#0d0d0d;z-index:200;
    padding:8px 12px calc(8px + env(safe-area-inset-bottom, 10px));
    gap:8px;
  }
  .mode-btn{
    flex:1;padding:11px 0;border-radius:12px;border:none;cursor:pointer;
    font-family:inherit;font-size:13px;font-weight:700;
    transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px;
    /* منع تأخير اللمس على iOS */
    touch-action:manipulation;
  }
  .mode-btn.active-wallet{
    background:linear-gradient(135deg,#1a1a2e,#2d2d5e);
    color:#c9921a;box-shadow:0 2px 12px #c9921a30;
  }
  .mode-btn.active-insta{
    background:linear-gradient(135deg,#833ab4,#e1306c,#fcb045);
    color:#fff;box-shadow:0 2px 12px #c1358460;
  }
  .mode-btn.inactive{
    background:#1a1a1a;color:#555;
  }
`;

export default function Root() {
  const [mode, setMode] = useState("instagram"); // default to the new feature

  return (
    <>
      <style>{STYLES}</style>
      {/* push content above bottom bar */}
      <div style={{ paddingBottom: 70 }}>
        {mode === "wallet" ? <App /> : <InstagramResponder />}
      </div>
      <nav className="mode-bar">
        <button
          className={`mode-btn ${mode === "instagram" ? "active-insta" : "inactive"}`}
          onClick={() => setMode("instagram")}
        >
          <span>🛋️</span>
          <span>ردود الأثاث</span>
        </button>
        <button
          className={`mode-btn ${mode === "wallet" ? "active-wallet" : "inactive"}`}
          onClick={() => setMode("wallet")}
        >
          <span>💰</span>
          <span>محفظتي</span>
        </button>
      </nav>
    </>
  );
}
