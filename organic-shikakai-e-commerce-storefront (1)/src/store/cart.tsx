"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  key: string; // slug + variant
  slug: string;
  name: string;
  tamilName: string;
  variant: string;
  price: number;
  mrp: number;
  image: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  savings: number;
  toast: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "sai-madhu-cart-v1";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (item: Omit<CartItem, "key" | "qty">, qty = 1) => {
      const key = `${item.slug}__${item.variant}`;
      setItems((prev) => {
        const existing = prev.find((p) => p.key === key);
        if (existing) {
          return prev.map((p) =>
            p.key === key ? { ...p, qty: Math.min(p.qty + qty, 20) } : p
          );
        }
        return [...prev, { ...item, key, qty }];
      });
      setToast(`${item.name} added to your basket`);
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => p.key !== key)
        : prev.map((p) => (p.key === key ? { ...p, qty: Math.min(qty, 20) } : p))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal, savings } = useMemo(() => {
    return items.reduce(
      (acc, it) => ({
        count: acc.count + it.qty,
        subtotal: acc.subtotal + it.qty * it.price,
        savings: acc.savings + it.qty * (it.mrp - it.price),
      }),
      { count: 0, subtotal: 0, savings: 0 }
    );
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQty,
      clear,
      count,
      subtotal,
      savings,
      toast,
    }),
    [items, isOpen, openCart, closeCart, addItem, removeItem, updateQty, clear, count, subtotal, savings, toast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
