import { useState, useRef } from "react";

// ─── Theme ───────────────────────────────────────────────────────────
const C = {
  bg: "#0d0d0d",
  card: "#161616",
  card2: "#1e1e1e",
  border: "#252525",
  borderHover: "#353535",
  text: "#f0f0f0",
  muted: "#888",
  hint: "#444",
  purple: "#c13584",
  pink: "#e1306c",
  blue: "#405de6",
  teal: "#0ea5e9",
  gold: "#f59e0b",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f97316",
  grad: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
};

const STYLES = `
  @keyframes fadeUp{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes ripple{0%{transform:scale(0);opacity:.6}100%{transform:scale(2.5);opacity:0}}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  html,body,#root{background:#0d0d0d;min-height:100vh}
  input,textarea,button,select{
    font-family:inherit;
    /* منع iOS من تكبير الخط عند التركيز على الحقل */
    font-size:max(16px, 1em);
  }
  textarea:focus,input:focus{outline:none}
  button{touch-action:manipulation}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:#111}
  ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
  ::-webkit-scrollbar-thumb:hover{background:#444}
  ::selection{background:#833ab480}
`;

// ─── Templates ───────────────────────────────────────────────────────
const TEMPLATES = [
  {
    key: "price",
    label: "استفسار عن السعر",
    icon: "💰",
    color: C.gold,
    keywords: ["سعر","بكم","كم سعر","بكام","ثمن","تكلفة","السعر","بسعر","سعره","كم","ثمنه"],
    // AIDA: Attention → Interest → Desire → Action
    response: `✨ اخترت بذوق رفيع! 🛋️\n\nأثاثنا مش مجرد قطعة — هو اللمسة اللي تكمّل بيتك وتحسسك فيه كل يوم.\n\nعشان نعطيك السعر المناسب تمامًا، أرسل لنا:\n📐 المقاسات (الطول × العرض × الارتفاع)\n🎨 الخامة أو اللون المفضل لديك\n📦 الكمية المطلوبة\n\n👇 راسلنا الآن وسنرسل لك عرضًا حصريًا خلال دقائق! ⚡`,
  },
  {
    key: "availability",
    label: "توفر المنتج",
    icon: "📦",
    color: C.green,
    keywords: ["متوفر","موجود","عندكم","عندك","يتوفر","متوفرة","موجودة","عنده","يكون"],
    // BAB: Before → After → Bridge
    response: `🎉 خبر يسعدك!\n\nنعم متوفر — وبخيارات أجمل مما تتوقع! 😍\n\n✅ ألوان متعددة تناسب كل ديكور\n✅ خامات فاخرة تدوم سنوات\n✅ جاهز للتسليم الفوري\n\nكثير من عملائنا قالوا "هذا بالضبط ما كنت أبحث عنه" بعد ما شافوا كتالوجنا 📸\n\n👇 أرسل لنا وسنبعث لك الصور الكاملة الآن!`,
  },
  {
    key: "delivery",
    label: "التوصيل والشحن",
    icon: "🚚",
    color: C.teal,
    keywords: ["توصيل","شحن","يوصل","يشحن","ايصل","ارسال","إرسال","توصل","يجيب","يوصله"],
    // FAB: Features → Advantages → Benefits
    response: `🚚 نعم نوصّل لباب بيتك!\n\nما في داعي تتعب نفسك — نحن نتكفل بكل شيء:\n📍 توصيل سريع داخل المدينة: 1-2 يوم\n🗺️ لجميع المناطق: 3-5 أيام عمل\n🔧 تركيب احترافي حتى يصبح أثاثك جاهزًا تمامًا\n💯 بضمان سلامة التوصيل\n\nأنت فقط تستلم وتستمتع! 😊\n\n👇 أرسل عنوانك وسنتواصل معك فورًا`,
  },
  {
    key: "custom",
    label: "طلب خاص / تفصيل",
    icon: "✂️",
    color: "#a855f7",
    keywords: ["تفصيل","مقاس خاص","حسب الطلب","طلب خاص","ابي","ابغى","اريد","نفس الشكل","مثله","تصميم"],
    // PAS: Problem → Agitation → Solution
    response: `💡 ما لقيت اللي يناسب مقاسك أو ذوقك؟\n\nهذا بالضبط ما نحن هنا من أجله! ✂️\n\nنفصّل لك قطعتك من الصفر — حسب:\n📐 مقاساتك الدقيقة تمامًا\n🎨 اللون والخامة اللي تحبها\n🖼️ التصميم الذي تحلم به\n\n⭐ عملاؤنا يقولون: "أخيرًا أثاث يليق ببيتي"\n\n👇 شاركنا تفاصيل طلبك وسنبدأ معك الآن!`,
  },
  {
    key: "warranty",
    label: "الضمان والجودة",
    icon: "🛡️",
    color: C.red,
    keywords: ["ضمان","جودة","خامة","متين","يدوم","خشب","قماش","جلد","مادة"],
    // FAB: Features → Advantages → Benefits
    response: `🏆 جودتنا تتكلم عن نفسها!\n\nنحن لا نوعد فقط — نُثبت:\n💎 خامات مستوردة مختارة بعناية فائقة\n🔨 تصنيع احترافي يدوي ومعتمد\n🛡️ ضمان شامل ضد أي عيب صناعي\n⭐ آلاف العملاء الراضين خير دليل\n\nأثاث تشتريه مرة واحدة — ويبقى معك سنوات! 🌟\n\n👇 تواصل معنا وشاهد الفرق بنفسك`,
  },
  {
    key: "colors",
    label: "الألوان والخيارات",
    icon: "🎨",
    color: C.pink,
    keywords: ["لون","ألوان","الوان","لونه","خيارات","اختيار","يجي","بيجي"],
    // AIDA
    response: `🎨 تخيّل بيتك بالألوان الصح!\n\nلدينا تشكيلة تجعل كل غرفة تحكاية:\n🤍 أبيض وكريمي — أناقة كلاسيكية\n🖤 أسود وأنثراسيت — فخامة عصرية\n🟤 بني وخشبي — دفء ودّي\n💙 رمادي هادئ — راحة بصرية\n💛 بيج وذهبي — لمسة فاخرة\n\n✨ لم تجد لونك؟ نُنفّذ أي لون تختاره!\n\n👇 أرسل لنا وسنبعث لك كتالوج الألوان كاملاً`,
  },
  {
    key: "complaint",
    label: "شكوى أو مشكلة",
    icon: "⚠️",
    color: C.orange,
    keywords: ["مشكلة","عطل","خراب","تالف","شكوى","مو زين","مو كويس","خطأ","غلط","ما يصلح"],
    response: `عزيزنا العميل 🤝\n\nرضاك هو أولويتنا القصوى — ولن نتركك تمر بتجربة سيئة.\n\nنحتاج منك فقط:\n📸 صور توضح المشكلة\n🔢 رقم طلبك أو الفاتورة\n📞 رقم هاتفك\n\nفريقنا سيتواصل معك خلال ساعات ونضمن لك حلاً يُرضيك تماماً 💯\n\n👇 راسلنا الآن ونحن نتكفل بالباقي`,
  },
  {
    key: "greeting",
    label: "ترحيب عام",
    icon: "👋",
    color: C.blue,
    keywords: ["هلا","مرحبا","مساء","صباح","سلام","اهلا","كيف","وش","شو"],
    // AIDA
    response: `أهلاً وسهلاً! ✨🛋️\n\nبيتك يستاهل الأحسن — وهذا ما نقدمه!\n\nنحن متخصصون في أثاث فاخر يجمع بين:\n💎 الجودة العالية والخامات الممتازة\n🎨 التصاميم العصرية والكلاسيكية\n✂️ التفصيل حسب ذوقك ومقاساتك\n🚚 التوصيل والتركيب لباب بيتك\n\nكيف نجعل بيتك أجمل اليوم؟ 😊\n\n👇 أخبرنا بما تبحث عنه!`,
  },
];

// ─── Keyword Detection ────────────────────────────────────────────────
function detectTemplate(msg) {
  const lower = msg.toLowerCase();
  let best = null, bestScore = 0;
  for (const t of TEMPLATES) {
    const score = t.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) { bestScore = score; best = t; }
  }
  return best || TEMPLATES[7]; // greeting fallback
}

// ─── Sub-components ──────────────────────────────────────────────────
function Chip({ label, color, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "8px 14px", borderRadius: 99, cursor: "pointer",
      border: `1px solid ${active ? color : C.border}`,
      background: active ? `${color}18` : "transparent",
      color: active ? color : C.muted,
      fontSize: 13, fontWeight: active ? 700 : 400,
      transition: "all .2s", whiteSpace: "nowrap", flexShrink: 0,
    }}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function CopyBtn({ text, small }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 2200);
    });
  };
  return (
    <button onClick={copy} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: small ? "7px 14px" : "10px 20px",
      borderRadius: 10, cursor: text ? "pointer" : "not-allowed",
      border: `1px solid ${done ? C.green : C.border}`,
      background: done ? `${C.green}18` : "transparent",
      color: done ? C.green : C.muted,
      fontSize: small ? 13 : 14, fontWeight: 600,
      transition: "all .25s",
      opacity: text ? 1 : 0.4,
    }}>
      <span>{done ? "✓" : "📋"}</span>
      <span>{done ? "تم النسخ!" : "نسخ الرد"}</span>
    </button>
  );
}

function HistoryCard({ item, onUse }) {
  return (
    <div style={{
      background: C.card2, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "12px 14px", marginBottom: 8,
      animation: "fadeUp .3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: item.color, fontWeight: 700 }}>{item.icon} {item.label}</span>
        <span style={{ fontSize: 11, color: C.hint }}>{item.time}</span>
      </div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 10, lineHeight: 1.5, direction: "rtl" }}>
        {item.message}
      </div>
      <button onClick={() => onUse(item)} style={{
        fontSize: 12, color: C.blue, background: "transparent",
        border: `1px solid ${C.blue}44`, borderRadius: 7,
        padding: "4px 10px", cursor: "pointer",
      }}>
        استخدم هذا الرد ↩
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function InstagramResponder() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [editedResponse, setEditedResponse] = useState("");
  const [activeKey, setActiveKey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [generated, setGenerated] = useState(false);
  const editRef = useRef(null);

  const generate = () => {
    if (!message.trim()) return;
    const t = detectTemplate(message);
    setResponse(t.response);
    setEditedResponse(t.response);
    setActiveKey(t.key);
    setIsEditing(false);
    setGenerated(true);
    setHistory(prev => [{
      message: message.slice(0, 60) + (message.length > 60 ? "…" : ""),
      response: t.response,
      label: t.label,
      icon: t.icon,
      color: t.color,
      key: t.key,
      time: new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" }),
      id: Date.now(),
    }, ...prev.slice(0, 14)]);
  };

  const applyTemplate = (t) => {
    setResponse(t.response);
    setEditedResponse(t.response);
    setActiveKey(t.key);
    setIsEditing(false);
    setGenerated(true);
  };

  const startEdit = () => {
    setIsEditing(true);
    setTimeout(() => editRef.current?.focus(), 50);
  };

  const saveEdit = () => {
    setResponse(editedResponse);
    setIsEditing(false);
  };

  const clear = () => {
    setMessage("");
    setResponse("");
    setEditedResponse("");
    setActiveKey(null);
    setIsEditing(false);
    setGenerated(false);
  };

  const useFromHistory = (item) => {
    setResponse(item.response);
    setEditedResponse(item.response);
    setActiveKey(item.key);
    setIsEditing(false);
    setGenerated(true);
    setShowHistory(false);
  };

  const detectedTemplate = message.trim() ? detectTemplate(message) : null;

  return (
    <>
      <style>{STYLES}</style>
      <div dir="rtl" style={{
        background: C.bg, minHeight: "100vh", color: C.text,
        fontFamily: "'Segoe UI', Tahoma, system-ui, Arial, sans-serif",
        maxWidth: 520, margin: "0 auto", paddingBottom: 40,
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: "20px 18px 16px",
          background: "linear-gradient(180deg,#111 0%,transparent 100%)",
          position: "sticky", top: 0, zIndex: 50,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 13,
                background: C.grad, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 21, boxShadow: "0 4px 16px #c135844a",
              }}>🛋️</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.4 }}>ردود الأثاث</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>مولّد ردود الإنستغرام</div>
              </div>
            </div>
            <button onClick={() => setShowHistory(!showHistory)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 10, cursor: "pointer",
              border: `1px solid ${showHistory ? C.purple : C.border}`,
              background: showHistory ? `${C.purple}15` : "transparent",
              color: showHistory ? C.purple : C.muted, fontSize: 13, fontWeight: 600,
            }}>
              <span>🕘</span>
              <span>السجل {history.length > 0 && `(${history.length})`}</span>
            </button>
          </div>
        </div>

        <div style={{ padding: "18px 16px" }}>

          {/* ── History Panel ── */}
          {showHistory && (
            <div style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: "16px",
              marginBottom: 18, animation: "fadeUp .25s ease",
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: C.text }}>
                🕘 آخر الردود
              </div>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: C.hint, fontSize: 14 }}>
                  لا توجد ردود سابقة بعد
                </div>
              ) : (
                history.map(item => (
                  <HistoryCard key={item.id} item={item} onUse={useFromHistory} />
                ))
              )}
            </div>
          )}

          {/* ── Message Input ── */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "16px", marginBottom: 14,
            animation: "fadeUp .3s ease",
          }}>
            <div style={{
              fontSize: 13, color: C.muted, marginBottom: 10,
              display: "flex", alignItems: "center", gap: 6, fontWeight: 600,
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: C.grad, display: "inline-flex",
                alignItems: "center", justifyContent: "center", fontSize: 10,
              }}>📩</span>
              رسالة العميل
            </div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && e.ctrlKey && generate()}
              placeholder="الصق رسالة العميل هنا...&#10;مثال: بكم هذا الكنب؟ هل متوفر؟"
              rows={4}
              style={{
                width: "100%", background: C.card2,
                border: `1px solid ${message ? C.borderHover : C.border}`,
                borderRadius: 12, padding: "13px 15px",
                color: C.text, fontSize: 15, lineHeight: 1.7,
                resize: "vertical", direction: "rtl",
                transition: "border .2s",
              }}
            />
            {detectedTemplate && message.trim() && (
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                marginTop: 10, fontSize: 12, color: detectedTemplate.color,
              }}>
                <span>{detectedTemplate.icon}</span>
                <span>تم اكتشاف: <strong>{detectedTemplate.label}</strong></span>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={generate} disabled={!message.trim()} style={{
                flex: 1, padding: "13px", borderRadius: 12, cursor: message.trim() ? "pointer" : "not-allowed",
                border: "none",
                background: message.trim()
                  ? "linear-gradient(135deg,#833ab4,#e1306c,#fcb045)"
                  : C.card2,
                color: message.trim() ? "#fff" : C.hint,
                fontSize: 15, fontWeight: 700,
                transition: "all .2s",
                boxShadow: message.trim() ? "0 4px 18px #c1358440" : "none",
              }}>
                ✨ توليد الرد
              </button>
              {(message || response) && (
                <button onClick={clear} style={{
                  padding: "13px 16px", borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  background: "transparent", color: C.hint,
                  fontSize: 14, cursor: "pointer",
                }}>
                  مسح
                </button>
              )}
            </div>
            <div style={{ fontSize: 11, color: C.hint, marginTop: 8, textAlign: "center" }}>
              Ctrl + Enter للتوليد السريع
            </div>
          </div>

          {/* ── Quick Templates ── */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 10, fontWeight: 600 }}>
              ⚡ اختر قالباً جاهزاً
            </div>
            <div style={{
              display: "flex", gap: 8, overflowX: "auto",
              paddingBottom: 6,
            }}>
              {TEMPLATES.map(t => (
                <Chip
                  key={t.key}
                  label={t.label}
                  icon={t.icon}
                  color={t.color}
                  active={activeKey === t.key}
                  onClick={() => applyTemplate(t)}
                />
              ))}
            </div>
          </div>

          {/* ── Response Output ── */}
          {generated && (
            <div style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: "16px",
              animation: "fadeUp .35s ease",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 14,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: C.green, display: "inline-block",
                    boxShadow: `0 0 8px ${C.green}`,
                  }} />
                  الرد الجاهز للنسخ
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={startEdit} style={{
                    padding: "6px 12px", borderRadius: 8,
                    border: `1px solid ${C.border}`, background: "transparent",
                    color: C.muted, fontSize: 12, cursor: "pointer",
                  }}>
                    ✏️ تعديل
                  </button>
                  <CopyBtn text={isEditing ? editedResponse : response} small />
                </div>
              </div>

              {isEditing ? (
                <>
                  <textarea
                    ref={editRef}
                    value={editedResponse}
                    onChange={e => setEditedResponse(e.target.value)}
                    rows={10}
                    style={{
                      width: "100%", background: C.card2,
                      border: `1px solid ${C.purple}`,
                      borderRadius: 12, padding: "14px 16px",
                      color: C.text, fontSize: 14, lineHeight: 1.8,
                      resize: "vertical", direction: "rtl",
                    }}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button onClick={saveEdit} style={{
                      flex: 1, padding: "10px", borderRadius: 10,
                      border: "none", background: C.green,
                      color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer",
                    }}>
                      ✓ حفظ التعديلات
                    </button>
                    <button onClick={() => { setIsEditing(false); setEditedResponse(response); }} style={{
                      padding: "10px 16px", borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      background: "transparent", color: C.muted,
                      fontSize: 13, cursor: "pointer",
                    }}>
                      إلغاء
                    </button>
                  </div>
                </>
              ) : (
                <div style={{
                  background: C.card2, border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: "14px 16px",
                  fontSize: 14, lineHeight: 1.9, color: C.text,
                  direction: "rtl", whiteSpace: "pre-wrap",
                  position: "relative",
                }}>
                  {response}

                  {/* Instagram bubble decoration */}
                  <div style={{
                    position: "absolute", top: 12, left: 14,
                    width: 6, height: 6, borderRadius: "50%",
                    background: C.grad, opacity: .5,
                  }} />
                </div>
              )}

              <div style={{
                display: "flex", gap: 8, marginTop: 14,
                paddingTop: 14, borderTop: `1px solid ${C.border}`,
              }}>
                <div style={{
                  flex: 1, display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, color: C.hint,
                }}>
                  <span>{response.length} حرف</span>
                  <span>·</span>
                  <span>{response.split("\n").length} سطر</span>
                </div>
                <CopyBtn text={isEditing ? editedResponse : response} small />
              </div>
            </div>
          )}

          {/* ── Tips ── */}
          {!generated && (
            <div style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: "18px",
              animation: "fadeUp .4s ease",
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: C.muted }}>
                💡 كيف يعمل البرنامج؟
              </div>
              {[
                { icon: "📩", text: "الصق رسالة العميل في المربع أعلاه" },
                { icon: "✨", text: "اضغط توليد الرد وسيكتشف نوع الاستفسار تلقائياً" },
                { icon: "📋", text: "انسخ الرد وأرسله مباشرة على الإنستغرام" },
                { icon: "✏️", text: "يمكنك تعديل الرد حسب احتياجك قبل الإرسال" },
                { icon: "⚡", text: "أو اختر قالباً جاهزاً من الأزرار بالأعلى" },
              ].map((tip, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  marginBottom: 10, fontSize: 13, color: C.muted, lineHeight: 1.6,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{tip.icon}</span>
                  <span>{tip.text}</span>
                </div>
              ))}

              <div style={{
                marginTop: 18, padding: "12px 14px",
                background: `${C.purple}10`, border: `1px solid ${C.purple}30`,
                borderRadius: 10, fontSize: 12, color: C.purple, lineHeight: 1.6,
              }}>
                🛋️ يدعم البرنامج الردود على: استفسارات الأسعار، التوفر، التوصيل، الطلبات الخاصة، الضمان، الألوان، والشكاوى.
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
