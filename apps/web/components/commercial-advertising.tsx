"use client";

import { useEffect, useMemo, useState } from "react";

type Ad = {
  id: string;
  space: number;
  companyName: string;
  message: string;
  destination?: string;
  design?: string;
  expiresAt: string;
};

type Msg = { role: "user" | "assistant"; text: string };

const slots = [
  { id: 1, icon: "✦" },
  { id: 2, icon: "◈" },
  { id: 3, icon: "✧" },
];

const prices: Record<number, Record<number, number>> = {
  1: { 1: 499, 2: 299, 3: 299 },
  3: { 1: 1299, 2: 799, 3: 799 },
  6: { 1: 2399, 2: 1499, 3: 1499 },
  12: { 1: 4499, 2: 2799, 3: 2799 },
};

const monthly = (months: number, space: number) =>
  Math.ceil((prices[months]?.[space] ?? 0) / months);

export default function CommercialAdvertising() {
  const [open, setOpen] = useState(false);
  const [space, setSpace] = useState(1);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [company, setCompany] = useState("");
  const [duration, setDuration] = useState(1);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);
  const [error, setError] = useState("");

  const total = prices[duration]?.[space] ?? 0;

  async function loadAds() {
    try {
      const r = await fetch("/api/advertising/active", { cache: "no-store" });
      const d = await r.json();
      setAds(Array.isArray(d.ads) ? d.ads : []);
    } catch {}
  }

  useEffect(() => {
    void loadAds();
    const timer = window.setInterval(loadAds, 3000);
    return () => window.clearInterval(timer);
  }, []);

  function start(selectedSpace: number) {
    setSpace(selectedSpace);
    setMessages([{
      role: "assistant",
      text: "مرحبًا بك في مدير الإعلانات في HELP-ME. أخبرني عن نشاطك أو المنتج الذي تريد الإعلان عنه، وسنتحدث معًا عن شكل الإعلان والجمهور والمدة والسعر قبل الدفع."
    }]);
    setInput("");
    setCompany("");
    setDuration(1);
    setPreview("");
    setError("");
    setOpen(true);
  }

  async function sendChat() {
    const value = input.trim();
    if (!value || loading) return;

    const next = [...messages, { role: "user" as const, text: value }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const transcript = next
        .map((m) => `${m.role === "user" ? "العميل" : "HELP-ME AI"}: ${m.text}`)
        .join("\n");

      const r = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "ar",
          message:
            "أنت مدير إعلانات HELP-ME. تحدث مع العميل كحوار حقيقي واحترافي. " +
            "ناقش طلبه، شكل الإعلان، النص، الجمهور، مدة الإعلان والتكلفة. " +
            "لا تطلب الدفع قبل اكتمال المعلومات، ولا تدّعي أن الدفع تم. " +
            "إذا كانت المعلومات ناقصة اسأل سؤالًا واضحًا واحدًا أو سؤالين فقط. " +
            "بيانات المحادثة حتى الآن:\n" + transcript,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "تعذر الاتصال بـ HELP-ME AI.");
      setMessages((current) => [...current, {
        role: "assistant",
        text: d.reply || "أخبرني بمزيد من التفاصيل عن الإعلان."
      }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر إرسال الرسالة.");
    } finally {
      setLoading(false);
    }
  }

  async function createPreview() {
    if (messages.length < 2) {
      setError("ابدأ المحادثة أولًا واتفق مع HELP-ME AI على تفاصيل الإعلان.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const transcript = messages
        .map((m) => `${m.role === "user" ? "العميل" : "HELP-ME AI"}: ${m.text}`)
        .join("\n");

      const r = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "ar",
          message:
            "أنشئ الآن عرضًا نهائيًا لمعاينة إعلان العميل بناءً على الحوار التالي. " +
            "أعطني: اسم الإعلان، النص الرئيسي، CTA، فكرة التصميم، الألوان/التكوين، والجمهور المستهدف. " +
            "لا تذكر معلومات غير موجودة كحقائق. إذا كان اسم الشركة غير واضح، اقترح اسمًا مؤقتًا. " +
            "الحوار:\n" + transcript,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "تعذر إنشاء المعاينة.");
      setPreview(d.reply || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر إنشاء المعاينة.");
    } finally {
      setLoading(false);
    }
  }

  async function pay() {
    setLoading(true);
    setError("");

    try {
      const r = await fetch("/api/advertising/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          space,
          durationMonths: duration,
          companyName: company || "HELP-ME Advertiser",
          conversation: messages,
          design: preview,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "تعذر إنشاء الدفع.");
      window.location.href = d.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر بدء الدفع.");
      setLoading(false);
    }
  }

  const bySpace = useMemo(() => new Map(ads.map((ad) => [ad.space, ad])), [ads]);

  return (
    <>
      <section className="commercial-ad-strip" aria-label="Advertising spaces">
        <div className="container">
          <div className="commercial-ad-grid">
            {slots.map((slot) => {
              const ad = bySpace.get(slot.id);
              return (
                <article className="commercial-ad-slot" key={slot.id}>
                  {ad ? (
                    <>
                      <small>ADVERTISEMENT · LIVE</small>
                      <h3>{ad.companyName}</h3>
                      <p>{ad.message}</p>
                      {ad.destination && (
                        <a href={ad.destination} target="_blank" rel="noopener noreferrer">
                          اكتشف الإعلان →
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <button className="commercial-ad-icon" type="button" onClick={() => start(slot.id)} aria-label="أعلن معنا">{slot.icon}</button>
                      <small>ADVERTISEMENT</small>
                      <div className="commercial-ad-empty">مساحة إعلانية</div>
                      <button className="commercial-ad-button" type="button" onClick={() => start(slot.id)}>أعلن معنا</button>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {open && (
        <div className="commercial-ad-overlay" onMouseDown={(e) => { if (e.currentTarget === e.target) setOpen(false); }}>
          <section className="commercial-ad-dialog" role="dialog" aria-modal="true">
            <button className="commercial-ad-close" type="button" onClick={() => setOpen(false)} aria-label="إغلاق">×</button>
            <div className="eyebrow">HELP-ME AI ADVERTISING</div>
            <h2>تحدث معنا عن إعلانك · المساحة {space}</h2>

            {!preview ? (
              <>
                <div className="commercial-ad-chat">
                  {messages.map((m, i) => (
                    <div className={`commercial-ad-message ${m.role}`} key={i}>
                      <strong>{m.role === "user" ? "أنت" : "HELP-ME AI"}</strong>
                      <div>{m.text}</div>
                    </div>
                  ))}
                  {loading && <div className="commercial-ad-message assistant"><strong>HELP-ME AI</strong><div>جاري التفكير …</div></div>}
                </div>

                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="اسم الشركة أو المنتج (اختياري)" />
                <div className="commercial-ad-input-row">
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendChat(); } }} placeholder="اكتب رسالتك للحديث والاتفاق مع HELP-ME AI…" rows={3} />
                  <button className="button primary" type="button" onClick={() => void sendChat()} disabled={loading || !input.trim()}>إرسال</button>
                </div>

                <div className="commercial-ad-duration">
                  <span>مدة الإعلان:</span>
                  {[1, 3, 6, 12].map((m) => (
                    <button type="button" key={m} onClick={() => setDuration(m)} className={duration === m ? "selected" : ""}>
                      {m} شهر · €{monthly(m, space)}/شهر
                    </button>
                  ))}
                </div>

                {error && <p className="commercial-ad-error">{error}</p>}

                <button className="button primary" type="button" onClick={() => void createPreview()} disabled={loading || messages.length < 2}>
                  إنشاء معاينة الإعلان بالـAI
                </button>
              </>
            ) : (
              <>
                <div className="commercial-ad-preview">
                  <div>
                    <div className="eyebrow">AI AD PREVIEW</div>
                    <div className="commercial-ad-preview-text">{preview}</div>
                  </div>
                  <div className="commercial-ad-visual">
                    <small>SPACE {space}</small>
                    <h3>{company || "اسم شركتك"}</h3>
                    <p>تصميم الإعلان وفق الاتفاق مع HELP-ME AI</p>
                    <span>€{monthly(duration, space)} / شهر</span>
                  </div>
                </div>

                <div className="commercial-ad-price">
                  <strong>€{monthly(duration, space)} / شهر</strong>
                  <span>إجمالي {duration} شهر: €{total}</span>
                </div>

                <p className="commercial-ad-note">
                  بعد موافقتك على التصميم سيتم تحويلك إلى الدفع الآمن. بعد تأكيد الدفع يظهر الإعلان تلقائيًا في المساحة المختارة.
                </p>

                {error && <p className="commercial-ad-error">{error}</p>}

                <div className="commercial-ad-actions">
                  <button className="button primary" type="button" onClick={() => void pay()} disabled={loading}>
                    {loading ? "جاري تحويلك للدفع …" : "موافق على التصميم — ادفع الآن"}
                  </button>
                  <button className="button" type="button" onClick={() => setPreview("")}>تعديل والعودة للمحادثة</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
