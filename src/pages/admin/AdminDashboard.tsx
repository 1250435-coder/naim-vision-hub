import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, ShoppingBag, Calendar, Settings, Trash2, Pencil, Plus, X, Home, Info, Star, Flag } from "lucide-react";

// ─── Types ────────────────────────────────────────────────
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

interface FestivalProgram {
  id?: string;
  title: string;
  date: string;
  location: string;
  spots: string;
  desc: string;
  fee: string;
  featured: boolean;
}

// ─── Shared UI ────────────────────────────────────────────
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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-sm font-medium text-primary block mb-1">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold";

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <Field label={label}><input {...props} className={inputCls} /></Field>
);

const Textarea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <Field label={label}><textarea {...props} rows={3} className={inputCls + " resize-none"} /></Field>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
    <h3 className="font-semibold text-primary border-b border-border pb-2">{title}</h3>
    {children}
  </div>
);

const ImgTip = () => (
  <p className="text-xs text-muted-foreground">💡 Upload gambar ke <a href="https://imgbb.com" target="_blank" className="text-gold underline">imgbb.com</a> (percuma), copy link dan paste di sini.</p>
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
    setModal(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Padam produk ini?")) return;
    await deleteDoc(doc(db, "products", id));
    toast.success("Produk dipadam!"); load();
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
            <Input label="Harga (RM)" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
            <Input label="Kategori" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Apparel / Accessories" />
            <Input label="URL Gambar" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            <ImgTip />
            {form.image && <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = "none")} />}
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

  const save = async () => {
    if (!form.title || !form.date) return toast.error("Isi sekurang-kurangnya tajuk dan tarikh!");
    if (editing?.id) {
      await updateDoc(doc(db, "programs", editing.id), { ...form });
      toast.success("Program dikemaskini!");
    } else {
      await addDoc(collection(db, "programs"), form);
      toast.success("Program ditambah!");
    }
    setModal(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Padam program ini?")) return;
    await deleteDoc(doc(db, "programs", id));
    toast.success("Program dipadam!"); load();
  };

  const upcoming = programs.filter(p => p.type === "upcoming");
  const past = programs.filter(p => p.type === "past");

  const ProgramCard = ({ p }: { p: Program }) => (
    <div className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
      <div>
        <div className="font-display font-bold text-primary">{p.title}</div>
        <div className="text-sm text-muted-foreground mt-1">{p.date} {p.location && `· ${p.location}`} {p.spots && `· ${p.spots}`}</div>
        {p.desc && <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>}
      </div>
      <div className="flex gap-2 shrink-0">
        <Button size="sm" variant="outline" onClick={() => { setEditing(p); setForm(p); setModal(true); }}><Pencil className="h-3 w-3" /></Button>
        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => remove(p.id!)}><Trash2 className="h-3 w-3" /></Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-primary">Program & Events</h2>
        <Button onClick={() => { setEditing(null); setForm({ title: "", date: "", location: "", spots: "", desc: "", type: "upcoming" }); setModal(true); }} className="bg-gold text-accent-foreground hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" /> Tambah Program
        </Button>
      </div>
      <h3 className="font-semibold text-primary mb-3">Akan Datang</h3>
      <div className="space-y-3 mb-8">
        {upcoming.map(p => <ProgramCard key={p.id} p={p} />)}
        {upcoming.length === 0 && <p className="text-muted-foreground text-sm">Tiada program akan datang.</p>}
      </div>
      <h3 className="font-semibold text-primary mb-3">Program Lepas</h3>
      <div className="space-y-3">
        {past.map(p => <ProgramCard key={p.id} p={p} />)}
        {past.length === 0 && <p className="text-muted-foreground text-sm">Tiada program lepas.</p>}
      </div>
      {modal && (
        <Modal title={editing ? "Edit Program" : "Tambah Program"} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <Field label="Jenis Program">
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as "upcoming" | "past" })} className={inputCls}>
                <option value="upcoming">Akan Datang</option>
                <option value="past">Program Lepas</option>
              </select>
            </Field>
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

// ─── Festival Programs Tab ────────────────────────────────
const FestivalTab = () => {
  const [programs, setPrograms] = useState<FestivalProgram[]>([]);
  const [festSettings, setFestSettings] = useState({ festivalHeroTitle: "", festivalHeroSubtitle: "", festivalHeroImage: "", festivalDateRange: "", festivalEventDate: "" });
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<FestivalProgram | null>(null);
  const [form, setForm] = useState<FestivalProgram>({ title: "", date: "", location: "", spots: "", desc: "", fee: "", featured: false });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const snap = await getDocs(collection(db, "festivalPrograms"));
    setPrograms(snap.docs.map(d => ({ id: d.id, ...d.data() } as FestivalProgram)));
    const d = await getDoc(doc(db, "settings", "festival"));
    if (d.exists()) setFestSettings(d.data() as typeof festSettings);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title) return toast.error("Isi tajuk program!");
    if (editing?.id) {
      await updateDoc(doc(db, "festivalPrograms", editing.id), { ...form });
      toast.success("Program dikemaskini!");
    } else {
      await addDoc(collection(db, "festivalPrograms"), form);
      toast.success("Program ditambah!");
    }
    setModal(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Padam program festival ini?")) return;
    await deleteDoc(doc(db, "festivalPrograms", id));
    toast.success("Dipadam!"); load();
  };

  const saveFestSettings = async () => {
    setSaving(true);
    await setDoc(doc(db, "settings", "festival"), festSettings);
    toast.success("Tetapan Festival disimpan!"); setSaving(false);
  };

  return (
    <div className="space-y-8">
      <SectionCard title="Tetapan Halaman Festival">
        <Input label="Tajuk Hero" value={festSettings.festivalHeroTitle} onChange={e => setFestSettings({ ...festSettings, festivalHeroTitle: e.target.value })} placeholder="Festival Mahasiswa Kelantan 2026" />
        <Textarea label="Subtajuk Hero" value={festSettings.festivalHeroSubtitle} onChange={e => setFestSettings({ ...festSettings, festivalHeroSubtitle: e.target.value })} placeholder="Penerangan singkat festival..." />
        <Input label="URL Gambar Hero" value={festSettings.festivalHeroImage} onChange={e => setFestSettings({ ...festSettings, festivalHeroImage: e.target.value })} placeholder="https://..." />
        <ImgTip />
        <Input label="Julat Tarikh (contoh: 20 — 21 June 2026)" value={festSettings.festivalDateRange} onChange={e => setFestSettings({ ...festSettings, festivalDateRange: e.target.value })} placeholder="20 — 21 June 2026" />
        <Input label="Tarikh Countdown (ISO format)" value={festSettings.festivalEventDate} onChange={e => setFestSettings({ ...festSettings, festivalEventDate: e.target.value })} placeholder="2026-06-20T09:00:00" />
        <p className="text-xs text-muted-foreground">Format tarikh: YYYY-MM-DDTHH:MM:SS (contoh: 2026-06-20T09:00:00)</p>
        <Button onClick={saveFestSettings} disabled={saving} className="bg-gold text-accent-foreground hover:opacity-90 font-semibold">
          {saving ? "Menyimpan..." : "Simpan Tetapan Festival"}
        </Button>
      </SectionCard>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-primary">Program Festival</h2>
          <Button onClick={() => { setEditing(null); setForm({ title: "", date: "", location: "", spots: "", desc: "", fee: "", featured: false }); setModal(true); }} className="bg-gold text-accent-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Tambah Program
          </Button>
        </div>
        <div className="space-y-3">
          {programs.map(p => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
              <div>
                {p.featured && <span className="text-[10px] bg-gold text-accent-foreground px-2 py-0.5 rounded font-bold uppercase mr-2">Featured</span>}
                <span className="font-display font-bold text-primary">{p.title}</span>
                <div className="text-sm text-muted-foreground mt-1">{p.date} {p.location && `· ${p.location}`} {p.spots && `· ${p.spots}`} {p.fee && `· ${p.fee}`}</div>
                {p.desc && <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => { setEditing(p); setForm(p); setModal(true); }}><Pencil className="h-3 w-3" /></Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => remove(p.id!)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
          {programs.length === 0 && <p className="text-muted-foreground text-sm">Tiada program festival lagi.</p>}
        </div>
      </div>

      {modal && (
        <Modal title={editing ? "Edit Program Festival" : "Tambah Program Festival"} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <Input label="Tajuk Program" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Cultural Run" />
            <Input label="Tarikh & Masa" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="20 June 2026 · 6:30 AM" />
            <Input label="Lokasi" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="USIM, Nilai" />
            <Input label="Kapasiti" value={form.spots} onChange={e => setForm({ ...form, spots: e.target.value })} placeholder="1,000 runners" />
            <Input label="Yuran / Fee" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} placeholder="RM 35 / Free" />
            <Textarea label="Penerangan" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
            <Field label="Featured Program?">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4" />
                <span className="text-sm text-foreground">Tandakan sebagai program utama (featured)</span>
              </label>
            </Field>
            <Button onClick={save} className="w-full bg-gold text-accent-foreground hover:opacity-90 font-semibold">Simpan</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Home Settings Tab ────────────────────────────────────
const HomeSettingsTab = () => {
  const [settings, setSettings] = useState({
    heroTitle: "", heroSubtitle: "", heroImage: "",
    festivalBannerImage: "",
    statsMembers: "", statsPrograms: "", statsChapters: "", statsYears: "",
    missionTitle: "", missionBody: "",
    festivalTitle: "", festivalSubtitle: "", festivalYear: "",
    storeTitle: "", storeSubtitle: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "settings", "site")).then(d => {
      if (d.exists()) setSettings(d.data() as typeof settings);
    });
  }, []);

  const save = async () => {
    setLoading(true);
    await setDoc(doc(db, "settings", "site"), settings);
    toast.success("Tetapan disimpan!"); setLoading(false);
  };

  const set = (k: string, v: string) => setSettings(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-primary">Tetapan Halaman Utama (Home)</h2>

      <SectionCard title="Hero Section">
        <Textarea label="Tajuk Hero" value={settings.heroTitle} onChange={e => set("heroTitle", e.target.value)} placeholder="Empowering Kelantan Students..." />
        <Textarea label="Subtajuk Hero" value={settings.heroSubtitle} onChange={e => set("heroSubtitle", e.target.value)} placeholder="We unite, develop..." />
        <Input label="URL Gambar Hero" value={settings.heroImage} onChange={e => set("heroImage", e.target.value)} placeholder="https://..." />
        <ImgTip />
      </SectionCard>

      <SectionCard title="Statistik">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Ahli Aktif" value={settings.statsMembers} onChange={e => set("statsMembers", e.target.value)} placeholder="5,000+" />
          <Input label="Program Tahunan" value={settings.statsPrograms} onChange={e => set("statsPrograms", e.target.value)} placeholder="120+" />
          <Input label="Cawangan Universiti" value={settings.statsChapters} onChange={e => set("statsChapters", e.target.value)} placeholder="30+" />
          <Input label="Tahun Berkhidmat" value={settings.statsYears} onChange={e => set("statsYears", e.target.value)} placeholder="15" />
        </div>
        <p className="text-xs text-muted-foreground">Kosongkan mana-mana field untuk menyembunyikan stat tersebut.</p>
      </SectionCard>

      <SectionCard title="Mission Section">
        <Textarea label="Tajuk Mission" value={settings.missionTitle} onChange={e => set("missionTitle", e.target.value)} placeholder="Building leaders rooted in heritage..." />
        <Textarea label="Teks Mission" value={settings.missionBody} onChange={e => set("missionBody", e.target.value)} placeholder="NAIM is the official voice..." />
      </SectionCard>

      <SectionCard title="Festival Teaser (Home)">
        <Input label="Tajuk Festival" value={settings.festivalTitle} onChange={e => set("festivalTitle", e.target.value)} placeholder="Festival Mahasiswa Kelantan" />
        <Textarea label="Subtajuk Festival" value={settings.festivalSubtitle} onChange={e => set("festivalSubtitle", e.target.value)} placeholder="The largest gathering..." />
        <Input label="Tahun Festival" value={settings.festivalYear} onChange={e => set("festivalYear", e.target.value)} placeholder="2026" />
        <Input label="URL Gambar Banner Festival" value={settings.festivalBannerImage} onChange={e => set("festivalBannerImage", e.target.value)} placeholder="https://..." />
        <ImgTip />
      </SectionCard>

      <SectionCard title="Kedai / Store Section">
        <Input label="Tajuk Store" value={settings.storeTitle} onChange={e => set("storeTitle", e.target.value)} placeholder="Wear the Heritage" />
        <Input label="Subtajuk Store" value={settings.storeSubtitle} onChange={e => set("storeSubtitle", e.target.value)} placeholder="Every purchase fuels student programs." />
      </SectionCard>

      <Button onClick={save} disabled={loading} className="bg-gold text-accent-foreground hover:opacity-90 font-semibold px-8">
        {loading ? "Menyimpan..." : "Simpan Semua"}
      </Button>
    </div>
  );
};

// ─── About Settings Tab ───────────────────────────────────
const AboutSettingsTab = () => {
  const [s, setS] = useState({
    aboutHeroTitle: "", aboutHeroSubtitle: "",
    aboutStory1: "", aboutStory2: "",
    aboutStructure: "", // newline-separated
    aboutValues: "", // JSON [{t, d}]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "settings", "about")).then(d => {
      if (d.exists()) setS(d.data() as typeof s);
    });
  }, []);

  const set = (k: string, v: string) => setS(prev => ({ ...prev, [k]: v }));
  const save = async () => {
    setLoading(true);
    await setDoc(doc(db, "settings", "about"), s);
    toast.success("Tetapan About disimpan!"); setLoading(false);
  };

  let valuesOk = true;
  try { if (s.aboutValues) JSON.parse(s.aboutValues); } catch { valuesOk = false; }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-primary">Tetapan Halaman About</h2>

      <SectionCard title="Hero Section">
        <Input label="Tajuk (e.g. Our Story)" value={s.aboutHeroTitle} onChange={e => set("aboutHeroTitle", e.target.value)} placeholder="Our Story" />
        <Textarea label="Subtajuk / Intro" value={s.aboutHeroSubtitle} onChange={e => set("aboutHeroSubtitle", e.target.value)} placeholder="Founded in 2009..." />
      </SectionCard>

      <SectionCard title="Cerita / Story Section">
        <Textarea label="Perenggan 1" value={s.aboutStory1} onChange={e => set("aboutStory1", e.target.value)} placeholder="What began as a small circle..." />
        <Textarea label="Perenggan 2" value={s.aboutStory2} onChange={e => set("aboutStory2", e.target.value)} placeholder="Through scholarships..." />
      </SectionCard>

      <SectionCard title="Organizational Structure">
        <Textarea label="Senarai Struktur (satu baris = satu item)" value={s.aboutStructure} onChange={e => set("aboutStructure", e.target.value)} placeholder={"Central Executive Committee (EXCO)\nBoard of Trustees & Advisors\nState University Chapter Heads"} />
        <p className="text-xs text-muted-foreground">Pisahkan setiap item dengan baris baru (Enter).</p>
      </SectionCard>

      <SectionCard title="Core Values">
        <Textarea label='Core Values (JSON format)' value={s.aboutValues} onChange={e => set("aboutValues", e.target.value)} placeholder={'[{"t":"Integrity","d":"Transparent governance..."},{"t":"Excellence","d":"Pursuing..."}]'} />
        {!valuesOk && <p className="text-xs text-destructive">⚠️ Format JSON tidak sah. Pastikan format betul.</p>}
        <p className="text-xs text-muted-foreground">Format: <code className="bg-muted px-1 rounded">[&#123;"t":"Tajuk","d":"Penerangan"&#125;, ...]</code></p>
      </SectionCard>

      <Button onClick={save} disabled={loading} className="bg-gold text-accent-foreground hover:opacity-90 font-semibold px-8">
        {loading ? "Menyimpan..." : "Simpan Semua"}
      </Button>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────
const AdminDashboard = () => {
  const [tab, setTab] = useState<"home" | "about" | "festival" | "programs" | "products">("home");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out.");
    navigate("/admin");
  };

  const tabs = [
    { id: "home", label: "Halaman Utama", icon: Home },
    { id: "about", label: "About", icon: Info },
    { id: "festival", label: "Festival", icon: Flag },
    { id: "programs", label: "Program", icon: Calendar },
    { id: "products", label: "Merchandise", icon: ShoppingBag },
  ] as const;

  return (
    <div className="min-h-screen bg-secondary">
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

      <div className="bg-card border-b border-border px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? "border-gold text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="container-tight py-8">
        {tab === "home" && <HomeSettingsTab />}
        {tab === "about" && <AboutSettingsTab />}
        {tab === "festival" && <FestivalTab />}
        {tab === "programs" && <ProgramsTab />}
        {tab === "products" && <ProductsTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
