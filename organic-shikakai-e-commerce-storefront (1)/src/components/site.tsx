"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Heart,
  Leaf,
  Menu,
  Minus,
  Phone,
  Plus,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Truck,
  X,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { formatINR, PRODUCT_PRICE, PRODUCT_SIZE, SHIPPING_FEE, type ProductInfo, type ReviewInfo } from "@/data/catalog";

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating / 10);
  const half = rating % 10 >= 5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full)
          return <Star key={i} style={{ width: size, height: size }} className="fill-gold-500 text-gold-500" />;
        if (i === full && half)
          return (
            <span key={i} className="relative inline-flex" style={{ width: size, height: size }}>
              <Star style={{ width: size, height: size }} className="text-gold-500 absolute" />
              <StarHalfIcon size={size} />
            </span>
          );
        return <Star key={i} style={{ width: size, height: size }} className="text-cream-300" />;
      })}
    </div>
  );
}

function StarHalfIcon({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size }} className="fill-gold-500 text-gold-500 absolute">
      <path d="M12 2l2.9 6.26 6.85.6-5.17 4.56 1.52 6.71L12 16.9 5.9 20.13l1.52-6.71L2.25 8.86l6.85-.6z" clipPath="url(#half)" />
      <defs>
        <clipPath id="half"><rect x="0" y="0" width="12" height="24" /></clipPath>
      </defs>
    </svg>
  );
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr).getTime();
  if (isNaN(d)) return "";
  const days = Math.floor((Date.now() - d) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

const ANCHORS = [
  { href: "#product", label: "The Powder" },
  { href: "#ritual", label: "Ritual" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

/* ================= ANNOUNCEMENT + HEADER ================= */

export function AnnouncementBar() {
  return (
    <div className="bg-forest-950 text-cream-100 text-center text-[11px] sm:text-xs tracking-wide py-2 px-4">
      <span className="font-medium">
        Fresh grind ships every Monday <span className="text-gold-300 font-bold">•</span>{" "}
        {PRODUCT_SIZE} jar — {formatINR(PRODUCT_PRICE)} <span className="text-gold-300 font-bold">•</span>{" "}
        Flat {formatINR(SHIPPING_FEE)} shipping across India <span className="hidden sm:inline text-gold-300 font-bold">•</span>{" "}
        <span className="hidden sm:inline">COD available</span>
      </span>
    </div>
  );
}

export function Header() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-cream-50/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(24,37,23,0.08)]" : "bg-cream-50"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-full hover:bg-cream-200 transition"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-forest-900" />
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0">
              <div className="absolute inset-0 rounded-full bg-forest-800 flex items-center justify-center overflow-hidden">
                <span className="font-display text-gold-300 text-lg sm:text-xl font-bold">S</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                <Leaf className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="leading-tight">
              <p className="font-display font-bold text-forest-900 text-lg sm:text-xl tracking-tight">Sai Madhu</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-forest-600 font-semibold">
                Organic Shikakai <span className="font-tamil normal-case tracking-normal">• சீயக்காய்</span>
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {ANCHORS.map((a) => (
              <a key={a.href} href={a.href} className="px-4 py-2 text-sm font-medium text-forest-800 hover:text-forest-600 rounded-full hover:bg-cream-200/70 transition">
                {a.label}
              </a>
            ))}
            <a
              href="https://www.instagram.com/sai_madhu_00/"
              target="_blank"
              rel="noreferrer"
              className="hidden xl:inline-flex ml-1 items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-clay-500 px-3 py-2 rounded-full hover:bg-cream-200/70 transition"
            >
              <InstagramIcon className="w-4 h-4" />
              @sai_madhu_00
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#product"
              className="hidden sm:inline-flex items-center gap-2 bg-forest-900 hover:bg-forest-800 text-cream-50 pl-5 pr-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{formatINR(PRODUCT_PRICE)}</span>
            </a>
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-11 h-11 sm:w-auto sm:px-5 rounded-full border-2 border-forest-900/15 hover:border-forest-900 text-forest-900 text-sm font-semibold transition-all active:scale-95"
              aria-label="Open basket"
            >
              <ShoppingBag className="w-4.5 h-4.5 w-5 h-5" />
              <span className="hidden sm:inline ml-2">Basket</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-6 h-6 px-1.5 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center shadow"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-forest-950/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-cream-50 z-50 p-6 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <p className="font-display font-bold text-xl text-forest-900">Sai Madhu</p>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full bg-cream-200" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {[{ href: "/", label: "Home" }, ...ANCHORS].map((a, i) => (
                  <motion.div key={a.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    <a
                      href={a.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 px-4 rounded-2xl font-display text-2xl text-forest-900 hover:bg-cream-200 transition"
                    >
                      {a.label}
                    </a>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto pt-6 border-t border-cream-300 space-y-3">
                <a
                  href="https://www.instagram.com/sai_madhu_00/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-forest-800"
                >
                  <InstagramIcon className="w-5 h-5 text-clay-500" /> @sai_madhu_00
                </a>
                <a href="#product" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 bg-forest-900 text-cream-50 font-bold py-3.5 rounded-full text-sm">
                  <ShoppingBag className="w-4 h-4" /> Order now — {formatINR(PRODUCT_PRICE)}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ================= HERO ================= */

export function HeroSection({ product }: { product: ProductInfo }) {
  const { addItem } = useCart();
  return (
    <section className="relative overflow-hidden bg-forest-950 text-cream-50 grain">
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-forest-600/30 blur-[120px]" />
      <div className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full bg-gold-500/15 blur-[130px]" />
      <div className="absolute inset-0 opacity-[0.07]"><div className="kolam-dots w-full h-full text-gold-300" /></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
        {/* Copy */}
        <div className="relative z-10 text-center lg:text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full pl-2 pr-4 py-1.5 text-xs font-semibold"
          >
            <span className="bg-gold-500 text-forest-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">One product</span>
            Ground fresh every Monday
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-tamil text-gold-300 text-xl sm:text-2xl mt-6"
          >
            பாட்டி கை பக்குவம்
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14 }}
            className="font-display font-bold text-[40px] leading-[1.02] sm:text-6xl xl:text-[68px] tracking-tight mt-2"
          >
            One powder.
            <br />
            <span className="italic font-medium text-gold-300">The paati way.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-4 flex items-center justify-center lg:justify-start gap-2.5"
          >
            <Stars rating={product.rating} size={15} />
            <span className="text-sm font-bold">{(product.rating / 10).toFixed(1)}</span>
            <a href="#reviews" className="text-cream-200/70 text-sm underline underline-offset-2 hover:text-cream-50">
              {product.reviewCount.toLocaleString("en-IN")} verified reviews
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-5 text-cream-200/85 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
          >
            {product.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-7 flex items-center justify-center lg:justify-start gap-3 flex-wrap"
          >
            <span className="font-display font-bold text-5xl sm:text-6xl text-cream-50">{formatINR(PRODUCT_PRICE)}</span>
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-cream-200/60 font-semibold">per {PRODUCT_SIZE} jar</p>
              <p className="text-[13px] text-gold-300 font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> + {formatINR(SHIPPING_FEE)} flat shipping
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-7 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
          >
            <button
              onClick={() =>
                addItem({
                  slug: product.slug,
                  name: product.name,
                  tamilName: product.tamilName,
                  variant: product.variants[0].label,
                  price: PRODUCT_PRICE,
                  mrp: PRODUCT_PRICE,
                  image: product.images[0],
                })
              }
              className="w-full sm:w-auto bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold px-9 py-4 rounded-full text-[15px] flex items-center justify-center gap-2 transition-all hover:shadow-[0_16px_40px_rgba(201,162,39,0.35)] active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Basket — {formatINR(PRODUCT_PRICE)}
            </button>
            <a
              href="#product"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 hover:bg-white/5 font-semibold px-7 py-4 rounded-full text-[15px] transition-all"
            >
              See the jar <ArrowDown className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2.5"
          >
            {["100% Natural", "No SLS • No soap", "COD available", "8–10 washes / jar"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 bg-white/[0.07] border border-white/12 rounded-full px-3.5 py-1.5 text-xs font-semibold text-cream-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-300" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto w-full max-w-[380px] sm:max-w-[440px] order-1 lg:order-2"
        >
          <div className="arch overflow-hidden border-[6px] border-gold-500/40 shadow-[0_40px_100px_rgba(0,0,0,0.45)] relative aspect-[3/4]">
            <Image
              src="/images/products/shikakai-classic.jpg"
              alt="Sai Madhu pure organic shikakai powder jar"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 440px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/45 via-transparent to-transparent" />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-3 sm:-left-8 top-16 bg-cream-50 text-forest-950 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-full bg-forest-800 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-gold-300" />
            </div>
            <div>
              <p className="text-xs font-bold leading-none">{PRODUCT_SIZE} Jar</p>
              <p className="text-[11px] text-forest-700/70 mt-1">{formatINR(PRODUCT_PRICE)}</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-3 sm:-right-6 bottom-24 bg-cream-50 text-forest-950 rounded-2xl shadow-xl px-4 py-3"
          >
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
              <p className="text-xs font-bold">4.8 / 5</p>
            </div>
            <p className="text-[11px] text-forest-700/70 mt-1">1,700+ happy customers</p>
          </motion.div>

          <div className="absolute -bottom-5 left-6 w-24 h-24 hidden sm:flex">
            <div className="absolute inset-0 rounded-full bg-gold-500 flex items-center justify-center text-center shadow-lg">
              <div className="animate-spin-slow absolute inset-1.5">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs><path id="circ" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" /></defs>
                  <text className="fill-forest-950 text-[10.5px] font-bold uppercase" style={{ letterSpacing: "2.5px" }}>
                    <textPath href="#circ">stone ground • fresh weekly •</textPath>
                  </text>
                </svg>
              </div>
              <Leaf className="w-7 h-7 text-forest-950" />
            </div>
          </div>
        </motion.div>
      </div>

      <svg viewBox="0 0 1440 60" className="w-full block text-cream-50 -mb-px relative" preserveAspectRatio="none">
        <path d="M0,32 C240,60 480,0 720,24 C960,48 1200,8 1440,32 L1440,60 L0,60 Z" fill="currentColor" />
      </svg>
    </section>
  );
}

/* ================= MARQUEE ================= */

export function Marquee() {
  const items = ["சீயக்காய்", "One Ingredient", "Stone-Ground Fresh", "No SLS", "சுத்தமான", "8–10 washes per jar", "COD Available", "ஞாயிறு சடங்கு"];
  return (
    <div className="bg-cream-50 py-4.5 py-5 overflow-hidden border-b border-cream-300/60">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center shrink-0">
            {items.map((t, i) => (
              <span key={i} className="flex items-center gap-6 pr-6 whitespace-nowrap">
                <span className={`text-sm font-bold uppercase tracking-[0.18em] ${i % 2 ? "text-clay-500" : "text-forest-800"} ${/[\u0B80-\u0BFF]/.test(t) ? "font-tamil normal-case text-base tracking-normal" : ""}`}>
                  {t}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= VALUE PROPS ================= */

export function ValueProps() {
  const props = [
    { icon: Leaf, title: "Single-origin herbs", desc: "Shikakai pods hand-picked in the foothills of Tamil Nadu." },
    { icon: Sun, title: "Ground fresh weekly", desc: "Stone-ground every Monday. Never warehoused for months." },
    { icon: Droplets, title: "Gentle low-pH wash", desc: "pH 4.5–5.5 like your scalp. No SLS, no stripping." },
    { icon: Heart, title: "Women-powered", desc: "Ground, packed & shipped by Tamil women, fairly paid." },
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {props.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="bg-white border border-cream-300/70 rounded-[20px] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-forest-900 flex items-center justify-center mb-4">
              <p.icon className="w-5 h-5 text-gold-300" />
            </div>
            <p className="font-display font-bold text-forest-950 text-[15px] sm:text-base">{p.title}</p>
            <p className="text-xs sm:text-[13px] text-forest-700/70 mt-1.5 leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ================= PRODUCT SHOWCASE ================= */

export function Showcase({ product }: { product: ProductInfo }) {
  const { addItem } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"benefits" | "how" | "ingredients">("benefits");

  return (
    <section id="product" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <p className="font-tamil text-clay-500 text-base">தயாரிப்பு</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-forest-950 tracking-tight mt-1">Inside your {PRODUCT_SIZE} jar</h2>
        <p className="text-forest-700/75 mt-2.5 text-sm sm:text-base">Everything you need to know about the only powder you'll ever need.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-[24px] sm:rounded-[32px] overflow-hidden bg-cream-100 shadow-lg"
          >
            <Image
              src={product.images[activeImg]}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <span className="absolute top-4 left-4 bg-forest-900/90 backdrop-blur text-cream-50 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              {product.badge}
            </span>
          </motion.div>
          <div className="flex gap-3 mt-3.5">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImg === i ? "border-forest-900 shadow-md scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="100px" />
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: Truck, t: "Ships in 24–48 hrs" },
              { icon: ShieldCheck, t: "COD available" },
              { icon: Leaf, t: "100% natural" },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-2 bg-white border border-cream-300 rounded-2xl px-3 py-3">
                <x.icon className="w-5 h-5 text-forest-700 shrink-0" />
                <p className="text-[11px] sm:text-xs font-bold text-forest-900 leading-tight">{x.t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="font-tamil text-clay-500">{product.tamilName}</p>
          <h3 className="font-display font-bold text-2xl sm:text-[32px] text-forest-950 tracking-tight mt-1">{product.name}</h3>
          <p className="text-forest-800/80 italic mt-2">"{product.tagline}"</p>

          <div className="flex items-center gap-2.5 mt-3">
            <Stars rating={product.rating} size={15} />
            <span className="text-sm font-bold">{(product.rating / 10).toFixed(1)}</span>
            <a href="#reviews" className="text-sm text-forest-700/70 underline underline-offset-2 hover:text-forest-900">
              {product.reviewCount.toLocaleString("en-IN")} reviews
            </a>
          </div>

          <div className="flex items-baseline gap-3 mt-5 flex-wrap">
            <span className="font-display font-bold text-4xl text-forest-950">{formatINR(PRODUCT_PRICE)}</span>
            <span className="bg-forest-900 text-gold-300 text-xs font-bold px-2.5 py-1 rounded-full">+ {formatINR(SHIPPING_FEE)} SHIPPING</span>
          </div>
          <p className="text-xs text-forest-700/60 mt-1.5">One {PRODUCT_SIZE} jar • ~8–10 washes • Ships across India</p>

          {/* Size (fixed) */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest-800 mb-2.5">Size</p>
            <div className="inline-flex items-center gap-3 border-2 border-forest-900 bg-forest-900 text-cream-50 px-5 py-3 rounded-2xl shadow-md">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-gold-300" />
              </div>
              <div>
                <p className="text-sm font-bold">{PRODUCT_SIZE} Jar</p>
                <p className="text-xs text-gold-300 font-semibold">{formatINR(PRODUCT_PRICE)}</p>
              </div>
            </div>
          </div>

          {/* Qty + Add */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="flex items-center justify-between gap-1 bg-white border border-cream-300 rounded-full p-1.5 sm:justify-start">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 rounded-full hover:bg-cream-200 flex items-center justify-center transition" aria-label="Decrease quantity">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-lg">{qty}</span>
              <button onClick={() => setQty(Math.min(10, qty + 1))} className="w-11 h-11 rounded-full hover:bg-cream-200 flex items-center justify-center transition" aria-label="Increase quantity">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() =>
                addItem(
                  {
                    slug: product.slug,
                    name: product.name,
                    tamilName: product.tamilName,
                    variant: product.variants[0].label,
                    price: PRODUCT_PRICE,
                    mrp: PRODUCT_PRICE,
                    image: product.images[0],
                  },
                  qty
                )
              }
              className="flex-1 bg-forest-900 hover:bg-forest-700 active:scale-[0.98] text-cream-50 font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all text-[15px] shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Basket • {formatINR(PRODUCT_PRICE * qty)}
            </button>
          </div>
          <p className="text-xs text-forest-700/70 mt-2.5 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-clay-500 shrink-0" />
            {formatINR(SHIPPING_FEE)} flat shipping added at checkout — arrives in 2–5 days, COD available.
          </p>

          {/* Tabs */}
          <div className="mt-8 bg-white border border-cream-300 rounded-[22px] overflow-hidden">
            <div className="flex border-b border-cream-200">
              {([
                { k: "benefits", l: "Benefits" },
                { k: "how", l: "How to Use" },
                { k: "ingredients", l: "Ingredients" },
              ] as const).map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k)}
                  className={`flex-1 py-3.5 text-[13px] sm:text-sm font-bold transition relative ${tab === t.k ? "text-forest-950" : "text-forest-700/50 hover:text-forest-800"}`}
                >
                  {t.l}
                  {tab === t.k && <motion.div layoutId="tab-line" className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 rounded-full" />}
                </button>
              ))}
            </div>
            <div className="p-5 sm:p-6">
              <AnimatePresence mode="wait">
                {tab === "benefits" && (
                  <motion.ul key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2.5">
                    {product.benefits.map((b) => (
                      <li key={b} className="flex gap-2.5 text-sm text-forest-900/90">
                        <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0" /> {b}
                      </li>
                    ))}
                  </motion.ul>
                )}
                {tab === "how" && (
                  <motion.ol key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3.5">
                    {product.howToUse.map((h, i) => (
                      <li key={i} className="flex gap-3 text-sm text-forest-900/90">
                        <span className="w-7 h-7 rounded-full bg-forest-900 text-gold-300 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                        <span className="pt-1">{h}</span>
                      </li>
                    ))}
                  </motion.ol>
                )}
                {tab === "ingredients" && (
                  <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ing) => (
                        <span key={ing} className="bg-cream-100 border border-cream-300 text-forest-900 text-[13px] font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-forest-600" /> {ing}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-forest-700/60 mt-4">No SLS • No parabens • No silicones • No artificial fragrance • No added colour</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-sm text-forest-800/80 leading-relaxed mt-6">{product.longDescription}</p>
        </div>
      </div>
    </section>
  );
}

/* ================= RITUAL ================= */

export function RitualSection() {
  const steps = [
    { icon: Droplets, step: "01", title: "Oil & Soak", tamil: "எண்ணெய் தேய்", desc: "Massage warm coconut oil into your scalp on a Sunday morning. Sip filter coffee while it works." },
    { icon: Leaf, step: "02", title: "Mix & Massage", tamil: "கலந்து தேய்", desc: "Whip 2–3 tbsp of this powder with warm water into a runny paste. Massage gently in sections." },
    { icon: Sun, step: "03", title: "Rinse & Shine", tamil: "அலசி மின்னு", desc: "Rinse with lukewarm water, finish cool. Air-dry in shade for mirror shine — no conditioner needed." },
  ];
  return (
    <section id="ritual" className="bg-forest-900 text-cream-50 py-16 sm:py-20 relative overflow-hidden grain scroll-mt-20">
      <div className="absolute -top-24 right-0 w-[400px] h-[400px] rounded-full bg-gold-500/10 blur-[100px]" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="font-tamil text-gold-300 text-base">ஞாயிறு சடங்கு</p>
          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight">The Sunday oil-bath ritual</h2>
          <p className="text-cream-200/75 mt-3 text-sm sm:text-base">Three steps your paati did without thinking. We just made it easier to keep up.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-white/[0.06] border border-white/10 rounded-[22px] p-6 sm:p-8 backdrop-blur hover:bg-white/[0.09] transition relative overflow-hidden"
            >
              <span className="absolute top-4 right-5 font-display text-5xl font-bold text-white/[0.07]">{s.step}</span>
              <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center mb-5">
                <s.icon className="w-6 h-6 text-forest-950" />
              </div>
              <p className="font-tamil text-gold-300 text-sm">{s.tamil}</p>
              <h3 className="font-display font-bold text-xl sm:text-2xl mt-1">{s.title}</h3>
              <p className="text-cream-200/75 text-sm leading-relaxed mt-2.5">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="#product" className="inline-flex items-center gap-2 bg-cream-50 text-forest-950 font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gold-300 transition">
            Start with one jar <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ================= REVIEWS ================= */

const BARS = [
  { stars: 5, pct: 82 },
  { stars: 4, pct: 13 },
  { stars: 3, pct: 3 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

const AVATAR_COLORS = ["bg-clay-500", "bg-forest-600", "bg-gold-600", "bg-[#7a5c3d]", "bg-[#5b7a68]", "bg-[#8a5a72]"];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function ReviewsSection({ product, reviews }: { product: ProductInfo; reviews: ReviewInfo[] }) {
  return (
    <section id="reviews" className="bg-cream-100/70 border-y border-cream-300 py-14 sm:py-20 scroll-mt-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="font-tamil text-clay-500 text-base">வாடிக்கையாளர் அன்பு</p>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-forest-950 tracking-tight mt-1">Loved across Tamil Nadu</h2>
          <p className="text-forest-700/75 mt-2.5 text-sm sm:text-base">
            Real words from real sisters who made the switch from shampoo.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Summary */}
          <div className="bg-white border border-cream-300 rounded-[22px] p-6 lg:sticky lg:top-28">
            <div className="text-center">
              <p className="font-display font-bold text-6xl text-forest-950">{(product.rating / 10).toFixed(1)}</p>
              <Stars rating={product.rating} size={16} />
              <p className="text-sm text-forest-700/70 mt-2">{product.reviewCount.toLocaleString("en-IN")} verified reviews</p>
            </div>
            <div className="mt-5 space-y-2">
              {BARS.map((b) => (
                <div key={b.stars} className="flex items-center gap-2.5 text-xs">
                  <span className="font-bold w-6 flex items-center gap-0.5">{b.stars}<Star className="w-3 h-3 fill-gold-500 text-gold-500" /></span>
                  <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.pct}%` }}
                      viewport={{ once: true }}
                      className="h-full bg-gold-500 rounded-full"
                    />
                  </div>
                  <span className="text-forest-700/60 w-8 text-right">{b.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-cream-200 text-xs text-forest-700/70 space-y-1.5">
              <p className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-forest-600" /> 94% would repurchase</p>
              <p className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-forest-600" /> 91% saw less hair fall</p>
            </div>
          </div>

          {/* List */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reviews.map((r, i) => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
                className="bg-white border border-cream-300 rounded-[22px] p-5 flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {initials(r.authorName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-forest-950 truncate">{r.authorName}</p>
                    <p className="text-[11px] text-forest-700/60">{r.location} • {timeAgo(r.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Stars rating={r.rating * 10} size={13} />
                  {r.verified && (
                    <span className="text-[9px] font-bold bg-forest-900 text-cream-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <BadgeCheck className="w-2.5 h-2.5" /> VERIFIED
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-forest-950 mt-2">{r.title}</p>
                <p className="text-[13px] text-forest-900/85 leading-relaxed mt-1 flex-1">"{r.body}"</p>
                <p className="text-[10px] text-forest-700/50 mt-3 flex items-center gap-1">
                  <Quote className="w-3 h-3" /> Bought the {PRODUCT_SIZE} jar
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FAQ ================= */

const FAQS = [
  {
    q: "How many washes does one 200 g jar last?",
    a: "Around 8–10 Sunday oil-bath washes when you use 2–3 tbsp per wash. Store it airtight and it stays fresh for 6 months — though most customers reorder long before that!",
  },
  {
    q: "How much is shipping and how long does it take?",
    a: `Shipping is a flat ${formatINR(SHIPPING_FEE)} across India, whatever you order. Your jar ships within 24–48 hours and arrives in 2–5 days. Cash on Delivery is available all over Tamil Nadu.`,
  },
  {
    q: "I've used shampoo all my life. Will this work for me?",
    a: "Yes — and that's exactly who we make it for. Expect a transition wash or two while your scalp rebalances, then softer, fuller hair. Many customers see less hair fall within 3–4 washes.",
  },
  {
    q: "Is it good for coloured, curly or children's hair?",
    a: "Absolutely. It's a gentle low-pH cleanser with no sulphates, so it's kind to colour, keratins and curls — and safe enough for kids. Curly customers love the natural slip it gives.",
  },
  {
    q: "How do I store the powder?",
    a: "Keep it in a cool, dry place in the airtight jar. Use a dry spoon every time — never let water touch the powder. Each batch is ground fresh on Monday, so it reaches you at peak potency.",
  },
  {
    q: "What if it doesn't suit my hair?",
    a: "We offer a no-questions replacement within 7 days of delivery. Message us on Instagram (@sai_madhu_00) with a photo and we'll make it right — we also give free wash-day guidance in Tamil or English.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 scroll-mt-20">
      <div className="text-center mb-10">
        <p className="font-tamil text-clay-500 text-base">கேள்விகள்</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-forest-950 tracking-tight mt-1">Questions, answered</h2>
      </div>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className={`bg-white border rounded-[18px] overflow-hidden transition-colors ${open === i ? "border-forest-900 shadow-md" : "border-cream-300"}`}
          >
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left">
              <span className="font-bold text-[15px] text-forest-950">{f.q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="shrink-0">
                <ChevronDown className="w-5 h-5 text-forest-700" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="px-5 sm:px-6 pb-5 text-sm text-forest-800/80 leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-sm text-forest-700/70 mt-8">
        Still curious? <a href="https://www.instagram.com/sai_madhu_00/" target="_blank" rel="noreferrer" className="font-bold text-clay-600 hover:underline">DM us on Instagram</a> — we answer in Tamil or English.
      </p>
    </section>
  );
}

/* ================= INSTAGRAM ================= */

export function InstagramSection() {
  const tiles = [
    { img: "/images/products/shikakai-classic.jpg", likes: "12.4k" },
    { img: "/images/hero-model.jpg", likes: "21.7k" },
    { img: "/images/story-founder.jpg", likes: "9.3k" },
    { img: "/images/products/hair-oil.jpg", likes: "6.9k" },
    { img: "/images/products/trio-combo.jpg", likes: "7.5k" },
    { img: "/images/products/bridal-kit.jpg", likes: "8.1k" },
  ];
  return (
    <section id="insta" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 scroll-mt-20">
      <div className="text-center max-w-xl mx-auto mb-9">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white text-xs font-bold px-4 py-2 rounded-full">
          <InstagramIcon className="w-4 h-4" /> @sai_madhu_00 on Instagram
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-forest-950 tracking-tight mt-4">Wash-day diaries & grind days</h2>
        <p className="text-forest-700/75 mt-2 text-sm sm:text-base">Follow for tutorials in Tamil, before-afters & first dibs on fresh Monday batches.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tiles.map((t, i) => (
          <motion.a
            key={i}
            href="https://www.instagram.com/sai_madhu_00/"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
          >
            <Image src={t.img} alt="Instagram post" fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="200px" />
            <div className="absolute inset-0 bg-forest-950/0 group-hover:bg-forest-950/45 transition flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <span className="text-white text-sm font-bold flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-white" /> {t.likes}
              </span>
              <InstagramIcon className="w-5 h-5 text-white" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */

export function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div className="kolam-dots w-full h-full text-gold-300" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="font-display font-bold text-xl text-forest-950">S</span>
              </div>
              <div>
                <p className="font-display font-bold text-xl">Sai Madhu</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold-300">Organic Shikakai</p>
              </div>
            </div>
            <p className="text-sm text-cream-200/80 leading-relaxed max-w-md">
              One product, made perfectly. Small-batch, stone-ground shikakai from Tamil Nadu — for the long, strong hair of our daughters.
            </p>
            <p className="font-tamil text-gold-300 mt-3 text-sm">பாட்டி கை பக்குவம், உங்கள் கூந்தலுக்கு</p>
            <a
              href="https://www.instagram.com/sai_madhu_00/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-5 bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-full text-sm font-semibold transition"
            >
              <InstagramIcon className="w-4 h-4 text-gold-300" /> Follow @sai_madhu_00
            </a>
          </div>

          <div>
            <p className="font-display font-semibold text-lg mb-4 text-gold-300">Explore</p>
            <ul className="space-y-2.5 text-sm text-cream-200/85">
              <li><a href="#product" className="hover:text-gold-300 transition">The Powder</a></li>
              <li><a href="#ritual" className="hover:text-gold-300 transition">Sunday Ritual</a></li>
              <li><a href="#reviews" className="hover:text-gold-300 transition">Reviews</a></li>
              <li><a href="#faq" className="hover:text-gold-300 transition">FAQ</a></li>
              <li><a href="#insta" className="hover:text-gold-300 transition">Instagram</a></li>
            </ul>
          </div>

          <div>
            <p className="font-display font-semibold text-lg mb-4 text-gold-300">Order & Care</p>
            <ul className="space-y-2.5 text-sm text-cream-200/85">
              <li className="flex items-center gap-2"><Truck className="w-4 h-4 shrink-0" /> Flat {formatINR(SHIPPING_FEE)} shipping • 2–5 days</li>
              <li className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 shrink-0" /> COD available</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 shrink-0" /> 7-day replacement</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> WhatsApp: +91 98400 00000</li>
              <li className="flex items-center gap-2"><Leaf className="w-4 h-4 shrink-0" /> Coimbatore, Tamil Nadu</li>
            </ul>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 rounded-[24px] bg-gradient-to-r from-forest-800 to-forest-900 border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-gold-500/10 blur-[60px]" />
          <div className="relative text-center sm:text-left">
            <p className="font-tamil text-gold-300">இன்றே ஆர்டர் செய்யுங்கள்</p>
            <p className="font-display font-bold text-2xl sm:text-3xl text-cream-50 mt-1">{PRODUCT_SIZE} jar • {formatINR(PRODUCT_PRICE)} + {formatINR(SHIPPING_FEE)} shipping</p>
            <p className="text-cream-200/70 text-sm mt-1.5">Fresh grind every Monday. When it's gone, it's gone till next week.</p>
          </div>
          <AddToBasketButton className="relative shrink-0 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold px-8 py-4 rounded-full text-[15px] flex items-center gap-2 transition-all active:scale-95 shadow-lg" />
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-200/60">
          <p>© 2026 Sai Madhu Organics • Coimbatore, Tamil Nadu • All rights reserved.</p>
          <p className="flex items-center gap-1.5">Crafted with <span className="text-clay-400">♥</span> for Tamil hair <span className="font-tamil">• நன்றி!</span></p>
        </div>
      </div>
    </footer>
  );
}

function AddToBasketButton({ className }: { className?: string }) {
  const { addItem } = useCart();
  return (
    <button
      onClick={() =>
        addItem({
          slug: "pure-shikakai-powder",
          name: "Sai Madhu Organic Shikakai Powder",
          tamilName: "சுத்தமான சீயக்காய் தூள்",
          variant: "200 g Jar",
          price: 300,
          mrp: 300,
          image: "/images/products/shikakai-classic.jpg",
        })
      }
      className={className}
    >
      <ShoppingBag className="w-5 h-5" /> Order now
    </button>
  );
}
