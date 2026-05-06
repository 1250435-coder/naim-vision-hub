import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Sparkles, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  festivalBannerImage: string;
  statsMembers: string;
  statsPrograms: string;
  statsChapters: string;
  statsYears: string;
  missionTitle: string;
  missionBody: string;
  festivalTitle: string;
  festivalSubtitle: string;
  festivalYear: string;
  storeTitle: string;
  storeSubtitle: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const Home = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDoc(doc(db, "settings", "site")).then(d => {
        if (d.exists()) setSettings(d.data() as SiteSettings);
      }),
      getDocs(collection(db, "products")).then(snap => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      }),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Memuatkan...</div>
      </div>
    );
  }

  const s = settings;
  const stats = s ? [
    { n: s.statsMembers, l: "Active Members" },
    { n: s.statsPrograms, l: "Annual Programs" },
    { n: s.statsChapters, l: "University Chapters" },
    { n: s.statsYears, l: "Years of Service" },
  ].filter(st => st.n) : [];

  const hasContent = s && (s.heroTitle || s.heroImage || s.missionTitle || s.festivalTitle);

  if (!hasContent && products.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-6">🏛️</div>
        <h2 className="font-display text-3xl font-bold text-primary mb-3">Website Belum Dikonfigurasi</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Log masuk ke panel admin untuk menambah kandungan pada halaman utama ini.
        </p>
        <Button asChild variant="outline">
          <Link to="/admin">Log Masuk Admin</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      {s && (s.heroTitle || s.heroImage) && (
        <section className="relative min-h-[88vh] flex items-center overflow-hidden">
          {s.heroImage ? (
            <img src={s.heroImage} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-primary" />
          )}
          <div className="absolute inset-0 bg-overlay" />
          <div className="relative container-tight py-24 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 text-primary-foreground">
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-gold mb-6">
                <span className="h-px w-8 bg-accent" /> Persatuan Mahasiswa Kelantan
              </span>
              {s.heroTitle && (
                <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05] mb-6">{s.heroTitle}</h1>
              )}
              {s.heroSubtitle && (
                <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mb-10 leading-relaxed">{s.heroSubtitle}</p>
              )}
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-gold text-accent-foreground hover:opacity-90 shadow-gold font-semibold">
                  <Link to="/festival">Festival Mahasiswa Kelantan <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/about">Discover NAIM</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section className="bg-primary text-primary-foreground">
          <div className="container-tight grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
            {stats.map((st) => (
              <div key={st.l} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-black text-gold">{st.n}</div>
                <div className="text-xs uppercase tracking-widest text-primary-foreground/70 mt-1">{st.l}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MISSION */}
      {s && (s.missionTitle || s.missionBody) && (
        <section className="section-padding">
          <div className="container-tight grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-accent font-semibold">Our Mission</span>
              {s.missionTitle && (
                <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6 text-primary">{s.missionTitle}</h2>
              )}
              {s.missionBody && (
                <p className="text-muted-foreground leading-relaxed mb-6">{s.missionBody}</p>
              )}
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/about">Read Our Story <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: Award, t: "Excellence", d: "Standards that inspire." },
                { Icon: Users, t: "Community", d: "Stronger together." },
                { Icon: Target, t: "Purpose", d: "Driven by impact." },
                { Icon: Sparkles, t: "Heritage", d: "Proudly Kelantanese." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="p-6 bg-card border border-border rounded-xl shadow-card hover:shadow-elegant transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-accent-soft grid place-items-center mb-3">
                    <Icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="font-display font-bold text-primary">{t}</div>
                  <div className="text-sm text-muted-foreground mt-1">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FESTIVAL TEASER */}
      {s && (s.festivalTitle || s.festivalBannerImage) && (
        <section className="relative section-padding overflow-hidden">
          {s.festivalBannerImage ? (
            <img src={s.festivalBannerImage} alt="Festival" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="absolute inset-0 bg-primary" />
          )}
          <div className="absolute inset-0 bg-overlay" />
          <div className="relative container-tight text-primary-foreground text-center max-w-3xl mx-auto">
            {s.festivalYear && <span className="text-xs tracking-[0.3em] uppercase text-gold">Featured Event {s.festivalYear}</span>}
            {s.festivalTitle && (
              <h2 className="font-display text-4xl md:text-6xl font-black mt-4 mb-6">{s.festivalTitle}</h2>
            )}
            {s.festivalSubtitle && (
              <p className="text-primary-foreground/85 mb-8 text-lg">{s.festivalSubtitle}</p>
            )}
            <Button asChild size="lg" className="bg-gold text-accent-foreground hover:opacity-90 font-semibold">
              <Link to="/festival">View Programs & Register <Calendar className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      )}

      {/* MERCH PREVIEW */}
      {products.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-tight">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-accent font-semibold">Official Store</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2">
                  {s?.storeTitle || "Wear the Heritage"}
                </h2>
                {s?.storeSubtitle && <p className="text-muted-foreground mt-2">{s.storeSubtitle}</p>}
              </div>
              <Button asChild variant="link" className="text-primary font-semibold">
                <Link to="/shop">Visit shop <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((p) => (
                <Link key={p.id} to="/shop" className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-all">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => (e.currentTarget.src = "/placeholder.svg")} />
                  </div>
                  <div className="p-5">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</div>
                    <div className="font-display font-bold text-primary mt-1">{p.name}</div>
                    <div className="text-accent-foreground font-semibold mt-2">RM {p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
