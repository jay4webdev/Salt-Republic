"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Wallet,
  ClipboardCheck,
  Lock,
  Truck,
  Banknote,
  Smartphone,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Leaf,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { formatINR, SHIPPING_FEE, PRODUCT_PRICE, PRODUCT_SIZE } from "@/data/catalog";

const STEPS = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Payment", icon: Wallet },
  { id: 3, label: "Review", icon: ClipboardCheck },
];

const TN_CITIES = ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode", "Tiruppur", "Vellore", "Thanjavur", "Dindigul", "Other"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "",
    paymentMethod: "cod",
    notes: "",
  });

  const shipping = SHIPPING_FEE;
  const total = subtotal + shipping;

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validateAddress = () => {
    if (form.customerName.trim().length < 2) return "Please enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) return "Please enter a valid 10-digit mobile number";
    if (form.address.trim().length < 10) return "Please enter your complete address with door no & street";
    if (!/^\d{6}$/.test(form.pincode.replace(/\s/g, ""))) return "Please enter a valid 6-digit pincode";
    return "";
  };

  const next = () => {
    setError("");
    if (step === 1) {
      const err = validateAddress();
      if (err) {
        setError(err);
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = async () => {
    setError("");
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((it) => ({
            slug: it.slug,
            name: it.name,
            variant: it.variant,
            image: it.image,
            qty: it.qty,
            price: it.price,
          })),
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Order failed");
      clear();
      router.push(`/order/${d.orderNumber}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !placing) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-5">
          <Leaf className="w-9 h-9 text-forest-700" />
        </div>
        <p className="font-display font-bold text-3xl text-forest-950">Your basket is empty</p>
        <p className="text-forest-700/70 mt-2 text-sm">Add the {PRODUCT_SIZE} jar before checking out.</p>
        <Link href="/" className="inline-flex items-center gap-2 mt-6 bg-forest-900 text-cream-50 px-7 py-3.5 rounded-full text-sm font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to the powder
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="p-2.5 rounded-full border border-cream-300 hover:bg-cream-200 transition" aria-label="Back home">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="font-tamil text-clay-500 text-sm">பணம் செலுத்து</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-forest-950 tracking-tight">Checkout</h1>
        </div>
        <span className="ml-auto hidden sm:flex items-center gap-1.5 text-xs font-semibold text-forest-700 bg-white border border-cream-300 px-3.5 py-2 rounded-full">
          <Lock className="w-3.5 h-3.5" /> 100% Secure
        </span>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 sm:gap-3 mb-10 max-w-2xl">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-none">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex items-center gap-2 rounded-full pl-2 pr-3 sm:pr-4 py-1.5 transition ${
                step === s.id ? "bg-forest-900 text-cream-50 shadow" : step > s.id ? "bg-forest-600 text-cream-50" : "bg-white border border-cream-300 text-forest-700/60"
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step === s.id ? "bg-gold-500 text-forest-950" : step > s.id ? "bg-white/20" : "bg-cream-200"}`}>
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              </span>
              <span className="text-xs sm:text-sm font-bold">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 rounded ${step > s.id ? "bg-forest-600" : "bg-cream-300"}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Main panel */}
        <div className="bg-white border border-cream-300 rounded-[26px] p-5 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-bold text-2xl text-forest-950">Where shall we send your jar?</h2>
                <p className="text-sm text-forest-700/70 mt-1">Flat {formatINR(SHIPPING_FEE)} shipping across India • arrives in 2–5 days.</p>
                <div className="grid sm:grid-cols-2 gap-3.5 mt-6">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-forest-800">Full name *</label>
                    <input value={form.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="e.g. Priya Dharshini" className="mt-1.5 w-full bg-cream-50 border border-cream-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-forest-800">Mobile *</label>
                    <input value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" inputMode="numeric" className="mt-1.5 w-full bg-cream-50 border border-cream-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-forest-800">Email</label>
                    <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" type="email" className="mt-1.5 w-full bg-cream-50 border border-cream-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 transition" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-forest-800">Address *</label>
                    <textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Door no, street, area, landmark..." rows={2} className="mt-1.5 w-full bg-cream-50 border border-cream-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 transition resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-forest-800">City *</label>
                    <select value={form.city} onChange={(e) => set("city", e.target.value)} className="mt-1.5 w-full bg-cream-50 border border-cream-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-forest-600 transition">
                      {TN_CITIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-forest-800">State</label>
                      <input value={form.state} onChange={(e) => set("state", e.target.value)} className="mt-1.5 w-full bg-cream-50 border border-cream-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-forest-600 transition" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-forest-800">Pincode *</label>
                      <input value={form.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="600001" inputMode="numeric" className="mt-1.5 w-full bg-cream-50 border border-cream-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 transition" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-forest-800">Order notes (optional)</label>
                    <input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Gift wrap? Leave at gate? Tamil instructions welcome!" className="mt-1.5 w-full bg-cream-50 border border-cream-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-forest-600 transition" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-bold text-2xl text-forest-950">How would you like to pay?</h2>
                <p className="text-sm text-forest-700/70 mt-1">All options are safe. COD available across Tamil Nadu.</p>
                <div className="space-y-3 mt-6">
                  {[
                    { v: "cod", icon: Banknote, t: "Cash on Delivery", d: "Pay in cash or UPI when your parcel arrives", tag: "Most popular" },
                    { v: "upi", icon: Smartphone, t: "UPI — GPay / PhonePe / Paytm", d: "Instant & free. UPI ID shared after ordering (demo)", tag: null },
                    { v: "card", icon: CreditCard, t: "Credit / Debit Card", d: "Visa, Mastercard, RuPay accepted (demo)", tag: null },
                  ].map((m) => (
                    <button
                      key={m.v}
                      onClick={() => set("paymentMethod", m.v)}
                      className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 text-left transition-all ${
                        form.paymentMethod === m.v ? "border-forest-900 bg-forest-900/[0.03] shadow-md" : "border-cream-300 hover:border-forest-600/50"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${form.paymentMethod === m.v ? "bg-forest-900" : "bg-cream-100"}`}>
                        <m.icon className={`w-6 h-6 ${form.paymentMethod === m.v ? "text-gold-300" : "text-forest-800"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[15px] text-forest-950 flex items-center gap-2 flex-wrap">
                          {m.t}
                          {m.tag && <span className="text-[10px] bg-gold-500 text-forest-950 font-bold px-2 py-0.5 rounded-full uppercase">{m.tag}</span>}
                        </p>
                        <p className="text-[13px] text-forest-700/70 mt-0.5">{m.d}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${form.paymentMethod === m.v ? "border-forest-900" : "border-cream-300"}`}>
                        {form.paymentMethod === m.v && <div className="w-3 h-3 rounded-full bg-forest-900" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2.5 mt-5 bg-cream-100 rounded-2xl p-4 text-xs text-forest-800">
                  <ShieldCheck className="w-5 h-5 text-forest-700 shrink-0" />
                  Demo checkout — no real money moves. Your order is saved safely and we'd confirm on WhatsApp.
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-bold text-2xl text-forest-950">Review & place order</h2>
                <p className="text-sm text-forest-700/70 mt-1">One last look before your podi begins its journey.</p>

                <div className="grid sm:grid-cols-2 gap-3 mt-6">
                  <div className="bg-cream-50 border border-cream-300 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Deliver to</p>
                      <button onClick={() => setStep(1)} className="text-xs font-bold text-clay-600 hover:underline">Edit</button>
                    </div>
                    <p className="text-sm font-bold">{form.customerName}</p>
                    <p className="text-[13px] text-forest-800/80 mt-0.5">{form.address}, {form.city}, {form.state} — {form.pincode}</p>
                    <p className="text-[13px] text-forest-800/80">{form.phone}</p>
                  </div>
                  <div className="bg-cream-50 border border-cream-300 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Payment</p>
                      <button onClick={() => setStep(2)} className="text-xs font-bold text-clay-600 hover:underline">Edit</button>
                    </div>
                    <p className="text-sm font-bold">
                      {form.paymentMethod === "cod" ? "Cash on Delivery" : form.paymentMethod === "upi" ? "UPI" : "Card"}
                    </p>
                    <p className="text-[13px] text-forest-800/80 mt-0.5 flex items-center gap-1.5">
                      <Truck className="w-4 h-4" /> Delivery in 2–5 days
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {items.map((it) => (
                    <div key={it.key} className="flex items-center gap-3 bg-cream-50 border border-cream-300/70 rounded-2xl p-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <Image src={it.image} alt={it.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{it.name}</p>
                        <p className="text-xs text-forest-700/60">{it.variant} × {it.qty}</p>
                      </div>
                      <p className="text-sm font-bold">{formatINR(it.price * it.qty)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-2xl px-4 py-3">
              {error}
            </motion.p>
          )}

          <div className="flex gap-3 mt-7">
            {step > 1 && (
              <button onClick={() => setStep((s) => s - 1)} className="px-6 py-3.5 rounded-full border-2 border-cream-300 font-bold text-sm hover:border-forest-900 transition flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={next} className="flex-1 bg-forest-900 hover:bg-forest-700 text-cream-50 font-bold py-3.5 rounded-full text-sm transition flex items-center justify-center gap-2 active:scale-[0.98]">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={placeOrder}
                disabled={placing}
                className="flex-1 bg-gold-500 hover:bg-gold-400 disabled:opacity-70 text-forest-950 font-bold py-4 rounded-full text-[15px] transition flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg"
              >
                {placing ? (
                  <><span className="w-5 h-5 border-2 border-forest-950/30 border-t-forest-950 rounded-full animate-spin" /> Placing order...</>
                ) : (
                  <><Lock className="w-4 h-4" /> Place order • {formatINR(total)}</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-forest-950 text-cream-50 rounded-[26px] p-6 sm:p-7 lg:sticky lg:top-28 shadow-xl">
          <p className="font-display font-bold text-xl">Order summary</p>
          <p className="font-tamil text-gold-300 text-sm mt-0.5">உங்கள் ஆர்டர்</p>

          <div className="mt-5 space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((it) => (
              <div key={it.key} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image src={it.image} alt={it.name} fill className="object-cover" sizes="56px" />
                  <span className="absolute top-0 right-0 bg-gold-500 text-forest-950 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-bl-lg">{it.qty}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold truncate">{it.name}</p>
                  <p className="text-[11px] text-cream-200/60">{it.variant}</p>
                </div>
                <p className="text-[13px] font-bold">{formatINR(it.price * it.qty)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm">
            <div className="flex justify-between text-cream-200/80"><span>Subtotal</span><span className="font-bold text-cream-50">{formatINR(subtotal)}</span></div>
            <div className="flex justify-between text-cream-200/80">
              <span>Shipping</span>
              <span className="font-bold text-cream-50">{formatINR(shipping)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/10 text-base">
              <span className="font-bold">Total</span>
              <span className="font-display font-bold text-2xl text-gold-300">{formatINR(total)}</span>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-cream-200/60 leading-relaxed">
            One {PRODUCT_SIZE} jar costs {formatINR(PRODUCT_PRICE)} — add more jars for family or gifting; shipping stays a flat {formatINR(SHIPPING_FEE)}.
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-cream-200/60">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            Secure checkout • Easy 7-day replacement • WhatsApp support
          </div>
        </aside>
      </div>
    </div>
  );
}
