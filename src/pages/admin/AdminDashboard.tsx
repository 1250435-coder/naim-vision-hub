import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, ShoppingBag, Calendar, Settings, Trash2, Pencil, Plus, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────
interface Product {
  id?: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Program {
  id?: string;
  title: string;
  date: string;
  location: string;
  spots: string;
  desc: string;
  type: "upcoming" | "past";
}

interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  statsMembers: string;
  statsPrograms: string;
  statsChapters: string;
  statsYears: string;
}

// ─── Modal ───────────────────────────────────────────────
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-card rounded-2xl shadow-elegant w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="font-display text-xl font-bold text-primary">{title}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="text-sm font-medium text-primary block mb-1">{label}</label>
    <input {...props} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold" />
  </div>
);

const Textarea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div>
    <label className="text-sm font-medium text-primary block mb-1">{label}</label>
    <textarea {...props} rows={3} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold resize-none" />
  </div>
);

// ─── Products Tab ─────────────────────────────────────────
const ProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>({ name: "", price: 0, image: "", category: "" });

  const load = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", price: 0, image: "", category: "" }); setModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm(p); setModal(true); };

  const save = async () => {
    if (!form.name || !form.image || !form.category) return toast.error("Isi semua field!");
    if (editing?.id) {
      await updateDoc(doc(db, "products", editing.id), { ...form });
      toast.success("Produk dikemaskini!");
    } else {
      await addDoc(collection(db, "products"), form);
      toast.success("Produk ditambah!");
    }
    setModal(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Padam produk ini?")) return;
    await deleteDoc(doc(db, "products", id));
    toast.success("Produk dipadam!");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-primary">Merchandise</h2>
        <Button onClick={openAdd} className="bg-gold text-accent-foreground hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" /> Tambah Produk
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover" onError={e => (e.currentTarget.src = "/placeholder.svg")} />
            <div className="p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{p.category}</div>
              <div className="font-display font-bold text-primary mt-1">{p.name}</div>
              <div className="text-gold font-semibold mt-1">RM {p.price}</div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => remove(p.id!)}><Trash2 className="h-3 w-3 mr-1" /> Padam</Button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-muted-foreground text-sm col-span-3 py-12 text-center">Tiada produk lagi. Tambah produk pertama!</p>}
      </div>

      {modal && (
        <Modal title={editing ? "Edit Produk" : "Tambah Produk"} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <Input label="Nama Produk" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="NAIM Signature Tee" />
            <Input label="Harga (RM)" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="65" />
            <Input label="Kategori" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Apparel / Accessories" />
            <Input label="URL Gambar" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            {form.image && <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = "none")} />}
            <p className="text-xs text-muted-foreground">💡 Upload gambar ke <a href="https://imgbb.com" target="_blank" className="text-gold underline">imgbb.com</a> (free), copy link dan paste kat sini.</p>
            <Button onClick={save} className="w-full bg-gold text-accent-foreground hover:opacity-90 font-semibold">Simpan</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Programs Tab ─────────────────────────────────────────
const ProgramsTab = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState<Program>({ title: "", date: "", location: "", spots: "", desc: "", type: "upcoming" });

  const load = async () => {
    const snap = await getDocs(collection(db, "programs"));
    setPrograms(snap.docs.map(d => ({ id: d.id, ...d.data() } as Program)));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: "", date: "", location: "", spots: "", desc: "", type: "upcoming" }); setModal(true); };
  const openEdit = (p: Program) => { setEditing(p); setForm(p); setModal(true); };

  const save = async () => {
    if (!form.title || !form.date) return toast.error("Isi sekurang-kurangnya tajuk dan tarikh!");
    if (editing?.id) {
      await updateDoc(doc(db, "programs", editing.id), { ...form });
      toast.success("Program dikemaskini!");
    } else {
      await addDoc(collection(db, "programs"), form);
      toast.success("Program ditambah!");
    }
    setModal(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Padam program ini?")) return;
    await deleteDoc(doc(db, "programs", id));
    toast.success("Program dipadam!");
    load();
  };

  const upcoming = programs.filter(p => p.type === "upcoming");
  const past = programs.filter(p => p.type === "past");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-primary">Program & Events</h2>
        <Button onClick={openAdd} className="bg-gold text-accent-foreground hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" /> Tambah Program
        </Button>
      </div>

      <h3 className="font-semibold text-primary mb-3">Akan Datang</h3>
      <div className="space-y-3 mb-8">
        {upcoming.map(p => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
            <div>
              <div className="font-display font-bold text-primary">{p.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{p.date} · {p.location} · {p.spots}</div>
              <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => remove(p.id!)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
        {upcoming.length === 0 && <p className="text-muted-foreground text-sm">Tiada program akan datang.</p>}
      </div>

      <h3 className="font-semibold text-primary mb-3">Program Lepas</h3>
      <div className="space-y-3">
        {past.map(p => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
            <div>
              <div className="font-display font-bold text-primary">{p.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{p.date}</div>
              <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => remove(p.id!)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
        {past.length === 0 && <p className="text-muted-foreground text-sm">Tiada program lepas.</p>}
      </div>

      {modal && (
        <Modal title={editing ? "Edit Program" : "Tambah Program"} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-primary block mb-1">Jenis Program</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as "upcoming" | "past" })}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold">
                <option value="upcoming">Akan Datang</option>
                <option value="past">Program Lepas</option>
              </select>
            </div>
            <Input label="Tajuk Program" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Leadership Bootcamp 2026" />
            <Input label="Tarikh" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="12 June 2026" />
            <Input label="Lokasi" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="UIA Gombak" />
            <Input label="Kapasiti / Spots" value={form.spots} onChange={e => setForm({ ...form, spots: e.target.value })} placeholder="80 spots / Open" />
            <Textarea label="Penerangan" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Penerangan program..." />
            <Button onClick={save} className="w-full bg-gold text-accent-foreground hover:opacity-90 font-semibold">Simpan</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Settings Tab ─────────────────────────────────────────
const SettingsTab = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    heroTitle: "Empowering Kelantan Students Towards Excellence.",
    heroSubtitle: "We unite, develop and elevate the next generation of Kelantanese leaders through programs, community and opportunity.",
    heroImage: "",
    statsMembers: "5,000+",
    statsPrograms: "120+",
    statsChapters: "30+",
    statsYears: "15",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "settings", "site")).then(d => {
      if (d.exists()) setSettings(d.data() as SiteSettings);
    });
  }, []);

  const save = async () => {
    setLoading(true);
    await setDoc(doc(db, "settings", "site"), settings);
    toast.success("Tetapan disimpan!");
    setLoading(false);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-primary mb-6">Tetapan Website</h2>
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-primary">Hero Section (Halaman Utama)</h3>
          <Textarea label="Tajuk Hero" value={settings.heroTitle} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} />
          <Textarea label="Subtajuk Hero" value={settings.heroSubtitle} onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })} />
          <Input label="URL Gambar Hero (kosongkan untuk guna gambar asal)" value={settings.heroImage} onChange={e => setSettings({ ...settings, heroImage: e.target.value })} placeholder="https://..." />
          <p className="text-xs text-muted-foreground">💡 Upload gambar ke <a href="https://imgbb.com" target="_blank" className="text-gold underline">imgbb.com</a> (free), copy link dan paste kat sini.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-primary">Statistik</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ahli Aktif" value={settings.statsMembers} onChange={e => setSettings({ ...settings, statsMembers: e.target.value })} placeholder="5,000+" />
            <Input label="Program Tahunan" value={settings.statsPrograms} onChange={e => setSettings({ ...settings, statsPrograms: e.target.value })} placeholder="120+" />
            <Input label="Cawangan Universiti" value={settings.statsChapters} onChange={e => setSettings({ ...settings, statsChapters: e.target.value })} placeholder="30+" />
            <Input label="Tahun Berkhidmat" value={settings.statsYears} onChange={e => setSettings({ ...settings, statsYears: e.target.value })} placeholder="15" />
          </div>
        </div>

        <Button onClick={save} disabled={loading} className="bg-gold text-accent-foreground hover:opacity-90 font-semibold px-8">
          {loading ? "Menyimpan..." : "Simpan Semua"}
        </Button>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────
const AdminDashboard = () => {
  const [tab, setTab] = useState<"products" | "programs" | "settings">("products");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out.");
    navigate("/admin");
  };

  const tabs = [
    { id: "products", label: "Merchandise", icon: ShoppingBag },
    { id: "programs", label: "Program", icon: Calendar },
    { id: "settings", label: "Tetapan", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <span className="font-display font-black text-primary text-sm">N</span>
          </div>
          <span className="font-display font-bold">Admin NAIM USIM</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
          <LogOut className="h-4 w-4 mr-2" /> Log Keluar
        </Button>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6">
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? "border-gold text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="container-tight py-8">
        {tab === "products" && <ProductsTab />}
        {tab === "programs" && <ProgramsTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
