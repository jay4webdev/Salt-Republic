"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Truck, MapPin, Wallet, ArrowRight, Package, Phone } from "lucide-react";
import { formatINR } from "@/data/catalog";

type Order = {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
};

type Item = {
  productName: string;
  variant: string;
  image: string;
  qty: number;
  price: number;
};

export default function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders?orderNumber=${orderNumber}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setOrder(d.order);
          setItems(d.items || []);
        }
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-12 h-12 border-4 border-cream-300 border-t-forest-800 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-forest-800 font-medium">Fetching your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <p className="font-display font-bold text-3xl">Order not found</p>
        <p className="text-sm text-forest-700/70 mt-2">Check your order number or contact us on WhatsApp.</p>
        <Link href="/" className="inline-block mt-6 bg-forest-900 text-cream-50 px-7 py-3.5 rounded-full text-sm font-bold">
          Back to the powder
        </Link>
      </div>
    );
  }

  const eta = new Date(Date.now() + 4 * 86400000).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.15 }}
          className="w-20 h-20 rounded-full bg-forest-800 flex items-center justify-center mx-auto shadow-xl"
        >
          <CheckCircle2 className="w-10 h-10 text-gold-300" />
        </motion.div>
        <p className="font-tamil text-clay-500 text-lg mt-6">நன்றி, {order.customerName.split(" ")[0]}!</p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-forest-950 tracking-tight mt-1">
          Order confirmed!
        </h1>
        <p className="text-forest-700/75 mt-3 text-sm sm:text-base max-w-md mx-auto">
          Your podi is being packed with love. We'll WhatsApp tracking details to{" "}
          <span className="font-bold text-forest-900">+91 {order.phone}</span> shortly.
        </p>
        <div className="inline-flex items-center gap-3 mt-5 bg-white border border-cream-300 rounded-full pl-5 pr-2 py-2 shadow-sm">
          <span className="text-sm text-forest-700/70">Order</span>
          <span className="font-bold text-forest-950 tracking-wide">{order.orderNumber}</span>
          <span className="bg-forest-900 text-gold-300 text-xs font-bold px-3 py-1.5 rounded-full">CONFIRMED</span>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 bg-forest-950 text-cream-50 rounded-[26px] p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Truck className="w-6 h-6 text-gold-300" />
          <div>
            <p className="font-bold">Arriving by {eta}</p>
            <p className="text-xs text-cream-200/60">2–5 day delivery across India</p>
          </div>
        </div>
        <div className="flex items-center">
          {[
            { l: "Confirmed", done: true },
            { l: "Packed", done: false },
            { l: "Shipped", done: false },
            { l: "Delivered", done: false },
          ].map((s, i, arr) => (
            <div key={s.l} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.done ? "bg-gold-500" : "bg-white/15"}`}>
                  {s.done ? <CheckCircle2 className="w-4.5 h-4.5 w-5 h-5 text-forest-950" /> : <Package className="w-4 h-4 text-cream-200/60" />}
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold ${s.done ? "text-gold-300" : "text-cream-200/50"}`}>{s.l}</span>
              </div>
              {i < arr.length - 1 && <div className="h-0.5 flex-1 bg-white/15 rounded mx-1 mb-5" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Details */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-cream-300 rounded-[22px] p-5">
          <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2.5"><MapPin className="w-3.5 h-3.5" /> Delivery address</p>
          <p className="text-sm font-bold">{order.customerName}</p>
          <p className="text-[13px] text-forest-800/75 mt-1">{order.address}, {order.city}, {order.state} — {order.pincode}</p>
        </div>
        <div className="bg-white border border-cream-300 rounded-[22px] p-5">
          <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2.5"><Wallet className="w-3.5 h-3.5" /> Payment</p>
          <p className="text-sm font-bold capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</p>
          <p className="text-[13px] text-forest-800/75 mt-1">
            {order.paymentMethod === "cod" ? `Keep ${formatINR(order.total)} ready — UPI also accepted.` : "Payment received. Nandri!"}
          </p>
        </div>
      </div>

      <div className="bg-white border border-cream-300 rounded-[22px] p-5 sm:p-6 mt-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-4">Items ({items.reduce((s, i) => s + i.qty, 0)})</p>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-cream-100">
                {it.image && <Image src={it.image} alt={it.productName} fill className="object-cover" sizes="56px" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{it.productName}</p>
                <p className="text-xs text-forest-700/60">{it.variant} × {it.qty}</p>
              </div>
              <p className="text-sm font-bold">{formatINR(it.price * it.qty)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-cream-200 mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-forest-800"><span>Subtotal</span><span className="font-bold">{formatINR(order.subtotal)}</span></div>
          <div className="flex justify-between text-forest-800"><span>Shipping</span><span className="font-bold">{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
          <div className="flex justify-between text-base pt-1"><span className="font-bold">Total</span><span className="font-display font-bold text-xl">{formatINR(order.total)}</span></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link href="/" className="flex-1 inline-flex items-center justify-center gap-2 bg-forest-900 text-cream-50 font-bold px-7 py-4 rounded-full text-sm hover:bg-forest-700 transition">
          Order another jar <ArrowRight className="w-4 h-4" />
        </Link>
        <a href="https://www.instagram.com/sai_madhu_00/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border-2 border-forest-900/15 font-bold px-7 py-4 rounded-full text-sm hover:border-forest-900/40 transition">
          <Phone className="w-4 h-4" /> Need help? DM us
        </a>
      </div>
    </div>
  );
}
