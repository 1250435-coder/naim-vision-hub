import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FestivalSettings {
  festivalHeroTitle: string;
  festivalHeroSubtitle: string;
  festivalHeroImage: string;
  festivalDateRange: string;
  festivalEventDate: string; // ISO string for countdown
  festivalInfoCards: string; // JSON [{Icon name, t, d}]
}

interface FestivalProgram {
  id?: string;
  title: string;
  date: string;
  location: string;
  spots: string;
  desc: string;
  fee: string;
  featured?: boolean;
  type: "festival";
}

const useCountdown = (target: string) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    mins: Math.floor((diff / 60000) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
};

const Festival = () => {
  const [s, setS] = useState<FestivalSettings | null>(null);
  const [programs, setPrograms] = useState<FestivalProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const c = useCountdown(s?.festivalEventDate || "");

  useEffect(() => {
    Promise.all([
      getDoc(doc(db, "settings", "festival")).then(d => {
        if (d.exists()) setS(d.data() as FestivalSettings);
      }),
      getDocs(collection(db, "festivalPrograms")).then(snap => {
        setPrograms(snap.docs.map(d => ({ id: d.id, ...d.data() } as FestivalProgram)));
      }),
    ]).finally(() => setLoading(false));
  }, []);

  const handleRegister = (title: string) => {
    toast.success(`Registration received for ${title}`, {
      description: "We'll email you the confirmation and event details shortly.",
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground text-sm animate-pulse">Memuatkan...</div></div>;
  }

  if (!s?.festivalHeroTitle && programs.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="font-display text-3xl font-bold text-primary mb-3">Festival Belum Dikonfigurasi</h2>
        <p className="text-muted-foreground max-w-md mb-6">Log masuk ke panel admin untuk menambah maklumat festival dan program.</p>
        <Button asChild variant="outline"><Link to="/admin">Log Masuk Admin</Link></Button>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      {s && (s.festivalHeroTitle || s.festivalHeroImage) && (
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          {s.festivalHeroImage ? (
            <img src={s.festivalHeroImage} alt="Festival" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-primary" />
          )}
          <div className="absolute inset-0 bg-overlay" />
          <div className="relative container-tight py-24 text-primary-foreground">
            {s.festivalDateRange && (
              <span className="text-xs tracking-[0.3em] uppercase text-gold">{s.festivalDateRange}</span>
            )}
            {s.festivalHeroTitle && (
              <h1 className="font-display text-5xl md:text-7xl font-black mt-4 max-w-4xl leading-[1.05]">{s.festivalHeroTitle}</h1>
            )}
            {s.festivalHeroSubtitle && (
              <p className="mt-6 text-lg text-primary-foreground/85 max-w-2xl">{s.festivalHeroSubtitle}</p>
            )}

            {/* COUNTDOWN */}
            {s.festivalEventDate && (
              <div className="grid grid-cols-4 gap-3 max-w-md mt-10">
                {[
                  { v: c.days, l: "Days" },
                  { v: c.hours, l: "Hours" },
                  { v: c.mins, l: "Mins" },
                  { v: c.secs, l: "Secs" },
                ].map((b) => (
                  <div key={b.l} className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-lg p-3 text-center">
                    <div className="font-display text-3xl md:text-4xl font-black text-gold">{String(b.v).padStart(2, "0")}</div>
                    <div className="text-[10px] uppercase tracking-widest text-primary-foreground/70 mt-1">{b.l}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gold text-accent-foreground hover:opacity-90 font-semibold shadow-gold">
                <a href="#programs">Explore Programs <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* PROGRAMS */}
      {programs.length > 0 && (
        <section id="programs" className="bg-secondary section-padding">
          <div className="container-tight">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs tracking-[0.3em] uppercase text-accent font-semibold">Festival Programs</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-3">What's Happening</h2>
              <p className="text-muted-foreground mt-4">Register now to secure your spot in our flagship festival programs.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((p) => (
                <article
                  key={p.id}
                  className={`bg-card rounded-xl border overflow-hidden shadow-card hover:shadow-elegant transition-all flex flex-col ${p.featured ? "border-accent ring-2 ring-accent/30" : "border-border"}`}
                >
                  <div className={`h-2 ${p.featured ? "bg-gold" : "bg-primary"}`} />
                  <div className="p-6 flex-1 flex flex-col">
                    {p.featured && (
                      <span className="self-start text-[10px] uppercase tracking-widest text-accent-foreground bg-gold px-2 py-1 rounded font-bold mb-3">Featured</span>
                    )}
                    <div className="font-display text-xl font-bold text-primary mt-1">{p.title}</div>
                    <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {p.date && <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> {p.date}</div>}
                      {p.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> {p.location}</div>}
                      {p.spots && <div className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> {p.spots}</div>}
                    </div>
                    {p.desc && <p className="text-sm text-muted-foreground mt-4 leading-relaxed flex-1">{p.desc}</p>}
                    <div className="flex items-center justify-between mt-6">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Fee</div>
                        <div className="font-display font-bold text-primary">{p.fee || "—"}</div>
                      </div>
                      <Button onClick={() => handleRegister(p.title)} className={p.featured ? "bg-gold text-accent-foreground hover:opacity-90" : ""}>
                        Register Now
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Festival;
