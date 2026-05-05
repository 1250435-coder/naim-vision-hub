import { useState } from "react";
import { ShoppingBag, Trash2, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const Shop = () => {
  const { add, items, setQty, remove, total, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);

  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="container-tight py-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Official Merchandise</span>
            <h1 className="font-display text-5xl md:text-6xl font-black mt-4">NAIM Store</h1>
            <p className="mt-4 text-primary-foreground/85 max-w-xl">Wear the heritage. Every purchase fuels student programs.</p>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="bg-gold text-accent-foreground hover:opacity-90 font-semibold">
                <ShoppingBag className="mr-2 h-4 w-4" /> View Cart ({items.length})
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Your Cart</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-12">Your cart is empty.</p>}
                {items.map((i) => (
                  <div key={i.id} className="flex gap-3 border-b border-border pb-4">
                    <img src={i.image} alt={i.name} className="h-20 w-20 object-cover rounded-md" />
                    <div className="flex-1">
                      <div className="font-semibold text-primary text-sm">{i.name}</div>
                      <div className="text-xs text-muted-foreground">RM {i.price}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(i.id, i.qty - 1)}><Minus className="h-3 w-3" /></Button>
                        <span className="text-sm w-6 text-center">{i.qty}</span>
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(i.id, i.qty + 1)}><Plus className="h-3 w-3" /></Button>
                        <button onClick={() => remove(i.id)} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <SheetFooter className="border-t border-border pt-4 flex-col gap-3 sm:flex-col">
                <div className="flex justify-between font-display text-xl font-bold text-primary w-full">
                  <span>Total</span><span>RM {total.toFixed(2)}</span>
                </div>
                <Button disabled={items.length === 0} onClick={() => { setOpen(false); setCheckout(true); }} className="w-full bg-gold text-accent-foreground hover:opacity-90 font-semibold">
                  Checkout
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <article key={p.id} className="group bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-elegant transition-all">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={p.image} alt={p.name} loading="lazy" width={800} height={800} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</div>
                  <h3 className="font-display font-bold text-primary mt-1">{p.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <div className="font-display text-lg font-semibold text-primary">RM {p.price}</div>
                    <Button size="sm" onClick={() => { add(p); toast.success(`${p.name} added to cart`); }}>
                      Add
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {checkout && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-8 shadow-elegant relative">
            <button onClick={() => setCheckout(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-2xl font-bold text-primary">Checkout</h3>
            <p className="text-sm text-muted-foreground mt-2">Payment gateway integration ready (FPX, Card, e-Wallet).</p>
            <div className="mt-5 p-4 bg-secondary rounded-lg">
              <div className="flex justify-between text-sm"><span>Items</span><span>{items.length}</span></div>
              <div className="flex justify-between font-display text-xl font-bold text-primary mt-2"><span>Total</span><span>RM {total.toFixed(2)}</span></div>
            </div>
            <Button className="w-full mt-5 bg-gold text-accent-foreground hover:opacity-90 font-semibold" onClick={() => { toast.success("Order placed! (Demo)"); clear(); setCheckout(false); }}>
              Confirm & Pay
            </Button>
            <p className="text-[10px] text-center text-muted-foreground mt-3">Demo checkout — no real payment processed.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
