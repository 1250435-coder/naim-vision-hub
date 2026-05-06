import { createContext, useContext, useState, ReactNode, useMemo } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

export type CartItem = Product & { qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartCtx>(() => ({
    items,
    count: items.reduce((a, b) => a + b.qty, 0),
    total: items.reduce((a, b) => a + b.qty * b.price, 0),
    add: (p) =>
      setItems((prev) => {
        const found = prev.find((i) => i.id === p.id);
        if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
        return [...prev, { ...p, qty: 1 }];
      }),
    remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    setQty: (id, qty) =>
      setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)))),
    clear: () => setItems([]),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be inside CartProvider");
  return v;
};
