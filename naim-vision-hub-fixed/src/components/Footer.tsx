import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => (
  <footer className="bg-hero text-primary-foreground mt-20">
    <div className="container-tight py-16 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-md bg-gold grid place-items-center">
            <span className="font-display font-black text-primary">N</span>
          </div>
          <div>
            <div className="font-display text-xl font-bold">NAIM USIM OFFICIAL</div>
            <div className="text-xs tracking-widest text-gold uppercase">Persatuan Mahasiswa Kelantan · USIM</div>
          </div>
        </div>
        <p className="text-sm text-primary-foreground/70 max-w-md leading-relaxed">
          Empowering Kelantan students towards excellence through leadership, community, and opportunity.
        </p>
        <div className="flex gap-3 mt-6">
          {[Facebook, Instagram, Twitter].map((Icon, i) => (
            <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-full border border-primary-foreground/20 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-display text-sm tracking-widest uppercase text-gold mb-4">Explore</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/80">
          <li><Link to="/about" className="hover:text-gold">About NAIM</Link></li>
          <li><Link to="/festival" className="hover:text-gold">Festival Mahasiswa</Link></li>
          <li><Link to="/programs" className="hover:text-gold">Programs</Link></li>
          <li><Link to="/shop" className="hover:text-gold">Merchandise</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-sm tracking-widest uppercase text-gold mb-4">Contact</h4>
        <ul className="space-y-3 text-sm text-primary-foreground/80">
          <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" /> Universiti Sains Islam Malaysia (USIM), Bandar Baru Nilai, 71800 Nilai, Negeri Sembilan</li>
          <li className="flex gap-2"><Mail className="h-4 w-4 text-gold mt-0.5 shrink-0" /> hello@naim.org.my</li>
          <li className="flex gap-2"><Phone className="h-4 w-4 text-gold mt-0.5 shrink-0" /> +60 9-123 4567</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10">
      <div className="container-tight py-6 text-xs text-primary-foreground/60 flex flex-col sm:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} NAIM USIM OFFICIAL — Persatuan Mahasiswa Kelantan USIM. All rights reserved.</span>
        <span>Built with pride in Kelantan.</span>
      </div>
    </div>
  </footer>
);
