"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight, Leaf, CheckCircle2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatINR, SHIPPING_FEE } from "@/data/catalog";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, count } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-forest-950/55 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream-50 z-[61] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream-300 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-forest-900 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-gold-300" />
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-forest-950 leading-none">Your Basket</p>
                  <p className="text-xs text-forest-700/70 mt-0.5">{count} jar{count !== 1 ? "s" : ""} • <span className="font-tamil">உங்கள் கூடை</span></p>
                </div>
              </div>
              <button onClick={closeCart} className="p-2.5 rounded-full hover:bg-cream-200 transition" aria-label="Close cart">
                <X className="w-5 h-5 text-forest-900" />
              </button>
            </div>

            {/* Shipping note */}
            <div className="px-5 py-3.5 bg-cream-100 border-b border-cream-300 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-forest-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-clay-500" />
                Flat {formatINR(SHIPPING_FEE)} shipping all over India
              </p>
              <span className="text-[10px] font-bold bg-forest-900 text-gold-300 px-2.5 py-1 rounded-full">COD OK</span>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mb-4">
                    <Leaf className="w-9 h-9 text-forest-600" />
                  </div>
                  <p className="font-display font-semibold text-xl text-forest-900">Your basket is empty</p>
                  <p className="text-sm text-forest-700/70 mt-1.5 max-w-[240px]">
                    One 200 g jar of stone-ground goodness is waiting for you.
                  </p>
                  <a
                    href="#product"
                    onClick={closeCart}
                    className="mt-6 bg-forest-900 text-cream-50 px-6 py-3 rounded-full text-sm font-semibold hover:bg-forest-700 transition"
                  >
                    See the powder
                  </a>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      className="flex gap-3.5 bg-white rounded-2xl p-3 border border-cream-300/70 shadow-sm"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-cream-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-forest-950 leading-snug line-clamp-2">{item.name}</p>
                        <p className="text-[11px] text-forest-700/70 mt-0.5">{item.variant}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1">
                            <button
                              onClick={() => updateQty(item.key, item.qty - 1)}
                              className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-cream-200 transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-bold">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.key, item.qty + 1)}
                              className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-cream-200 transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-forest-900">{formatINR(item.price * item.qty)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="self-start p-1.5 rounded-full text-forest-700/50 hover:text-red-600 hover:bg-red-50 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-300 bg-white px-5 py-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-forest-800">Subtotal</span>
                  <span className="font-bold text-forest-950">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-800">Shipping</span>
                  <span className="font-bold text-forest-950">{formatINR(SHIPPING_FEE)}</span>
                </div>
                <div className="flex justify-between text-base border-t border-cream-200 pt-2.5">
                  <span className="font-bold text-forest-950">Total</span>
                  <span className="font-display font-bold text-xl text-forest-950">{formatINR(subtotal + SHIPPING_FEE)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-forest-900 hover:bg-forest-700 text-cream-50 font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#product" onClick={closeCart} className="w-full block text-center text-sm font-medium text-forest-700 hover:text-forest-900 py-1 transition">
                  Continue browsing
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function CartToast() {
  const { toast, openCart } = useCart();
  return (
    <AnimatePresence>
      {toast && (
        <motion.button
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          onClick={openCart}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] bg-forest-950 text-cream-50 pl-4 pr-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-sm font-medium max-w-[92vw]"
        >
          <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
          <span className="truncate">{toast}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
