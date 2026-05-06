import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Sparkles, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-students.jpg";
import festival from "@/assets/festival-banner.jpg";
import { products as staticProducts } from "@/data/products";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

const Home = () => {
  const [products, setProducts] = useState(staticProducts as any[]);
  const [settings, setSettings] = useState({
    heroTitle: "Empowering Kelantan Students Towards Excellence.",
    heroSubtitle: "We unite, develop and elevate the next generation of Kelantanese leaders through programs, community and opportunity.",
    heroImage: "",
    statsMembers: "5,000+",
    statsPrograms: "120+",
    statsChapters: "30+",
    statsYears: "15",
  });

  useEffect(() => {
    // Load products from Firebase
    getDocs(collection(db, "products")).then(snap => {
      if (!snap.empty) setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Load site settings from Firebase
    getDoc(doc(db, "settings", "site")).then(d => {
      if (d.exists()) setSettings(s => ({ ...s, ...d.data() }));
    });
  }, []);

  const heroImg = settings.heroImage || hero;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <img src={heroImg} alt="NAIM students" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1280} />
        <div className="absolute inset-0 bg-overlay" />
        <div className="relative container-tight py-24 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-primary-foreground">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-gold mb-6">
              <span className="h-px w-8 bg-accent" /> Persatuan Mahasiswa Kelantan
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05] mb-6">
              {settings.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mb-10 leading-relaxed">
              {settings.heroSubtitle}
            </p>
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

      {/* STATS */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-tight grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {[
            { n: settings.statsMembers, l: "Active Members" },
            { n: settings.statsPrograms, l: "Annual Programs" },
            { n: settings.statsChapters, l: "University Chapters" },
            { n: settings.statsYears, l: "Years of Service" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-black text-gold">{s.n}</div>
              <div className="text-xs uppercase tracking-widest text-primary-foreground/70 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="section-padding">
        <div className="container-tight grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-accent font-semibold">Our Mission</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6 text-primary">
              Building leaders rooted in heritage, ready for the world.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              NAIM is the official voice of Kelantanese students nationwide. We bridge identity and ambition — preserving culture while opening doors to scholarship, leadership and entrepreneurship.
            </p>
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

      {/* FESTIVAL TEASER */}
      <section className="relative section-padding overflow-hidden">
        <img src={festival} alt="Festival" className="absolute inset-0 h-full w-full object-cover" loading="lazy" width={1920} height={1080} />
        <div className="absolute inset-0 bg-overlay" />
        <div className="relative container-tight text-primary-foreground text-center max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Featured Event 2026</span>
          <h2 className="font-display text-4xl md:text-6xl font-black mt-4 mb-6">
            Festival Mahasiswa <span className="text-gold">Kelantan</span>
          </h2>
          <p className="text-primary-foreground/85 mb-8 text-lg">
            The largest gathering of Kelantanese students nationwide. Culture, talent, leadership — under one roof.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-gold text-accent-foreground hover:opacity-90 font-semibold">
              <Link to="/festival">View Programs & Register <Calendar className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* MERCH PREVIEW */}
      <section className="section-padding bg-secondary">
        <div className="container-tight">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-accent font-semibold">Official Store</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2">Wear the Heritage</h2>
            </div>
            <Button asChild variant="link" className="text-primary font-semibold">
              <Link to="/shop">Visit shop <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} to="/shop" className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-all">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={p.image} alt={p.name} loading="lazy" width={800} height={800} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
    </>
  );
};

export default Home;
