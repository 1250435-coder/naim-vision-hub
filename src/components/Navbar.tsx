import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/festival", label: "Festival" },
  { to: "/programs", label: "Programs" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-md bg-hero grid place-items-center shadow-gold">
            <span className="font-display text-base font-black text-gold">N</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold text-primary">NAIM USIM OFFICIAL</div>
            <div className="text-[10px] tracking-widest text-muted-foreground uppercase">Mahasiswa Kelantan</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/shop" className="relative p-2 rounded-md hover:bg-secondary transition-colors">
            <ShoppingBag className="h-5 w-5 text-primary" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 grid place-items-center text-[10px] font-bold rounded-full bg-accent text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="container-tight py-3 flex flex-col">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-sm font-medium border-b border-border last:border-0 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
