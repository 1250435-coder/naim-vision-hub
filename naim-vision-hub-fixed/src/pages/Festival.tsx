import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Mic, ArrowRight, Trophy, Palette, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import festival from "@/assets/festival-banner.jpg";

const EVENT_DATE = new Date("2026-06-20T09:00:00").getTime();

const useCountdown = () => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, EVENT_DATE - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    mins: Math.floor((diff / 60000) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
};

const programs = [
  {
    id: "cultural-run",
    Icon: Trophy,
    title: "Cultural Run",
    date: "20 June 2026 · 6:30 AM",
    location: "USIM, Bandar Baru Nilai",
    spots: "1,000 runners",
    desc: "A heritage run celebrating Kelantanese culture — wear traditional attire and run together with fellow mahasiswa.",
    fee: "RM 35",
    featured: true,
  },
  {
    id: "canvakraf",
    Icon: Palette,
    title: "CanvaKraf",
    date: "20 June 2026 · 10:00 AM",
    location: "Dewan Kuliah USIM",
    spots: "100 peserta",
    desc: "Bengkel kreatif menggunakan Canva untuk mahasiswa — belajar reka bentuk poster, infografik dan kandungan media sosial.",
    fee: "RM 15",
  },
  {
    id: "forum-ilmiah",
    Icon: BookOpen,
    title: "Forum Ilmiah",
    date: "20 June 2026 · 2:30 PM",
    location: "Auditorium USIM",
    spots: "300 delegates",
    desc: "Forum ilmiah bersama tokoh akademik dan pemimpin Kelantan membincangkan isu semasa mahasiswa dan masyarakat.",
    fee: "Free",
  },
  {
    id: "talk-ekonomi",
    Icon: TrendingUp,
    title: "Talk Ekonomi",
    date: "21 June 2026 · 10:00 AM",
    location: "Dewan Seminar USIM",
    spots: "250 seats",
    desc: "Sesi perkongsian bersama pakar ekonomi tentang peluang kewangan, keusahawanan dan masa depan ekonomi Kelantan.",
    fee: "Free",
  },
];

const Festival = () => {
  const c = useCountdown();

  const handleRegister = (title: string) => {
    toast.success(`Registration received for ${title}`, {
      description: "We'll email you the confirmation and event details shortly.",
    });
  };

  return (
    <>
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img src={festival} alt="Festival" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-overlay" />
        <div className="relative container-tight py-24 text-primary-foreground">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">20 — 21 June 2026</span>
          <h1 className="font-display text-5xl md:text-7xl font-black mt-4 max-w-4xl leading-[1.05]">
            Festival Mahasiswa <span className="text-gold">Kelantan</span> 2026
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/85 max-w-2xl">
            Three days of culture, talent, leadership and innovation — celebrating the spirit of Kelantanese students nationwide.
          </p>

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

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-gold text-accent-foreground hover:opacity-90 font-semibold shadow-gold">
              <a href="#programs">Explore Programs <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight grid md:grid-cols-2 gap-6">
          {[
            { Icon: Calendar, t: "2 Days · 4 Programs", d: "From Cultural Run hingga Talk Ekonomi — penuh ilmu dan budaya." },
            { Icon: MapPin, t: "Stadium Sultan Muhammad IV", d: "The cultural heart of Kota Bharu, Kelantan." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="p-7 bg-card rounded-xl border border-border shadow-card">
              <Icon className="h-8 w-8 text-accent mb-4" />
              <div className="font-display text-lg font-bold text-primary">{t}</div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="programs" className="bg-secondary section-padding">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs tracking-[0.3em] uppercase text-accent font-semibold">Festival Programs</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-3">What's Happening</h2>
            <p className="text-muted-foreground mt-4">Register now to secure your spot in our flagship festival programs.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(({ Icon, ...p }) => (
              <article
                key={p.id}
                id={p.id}
                className={`bg-card rounded-xl border overflow-hidden shadow-card hover:shadow-elegant transition-all flex flex-col ${
                  p.featured ? "border-accent ring-2 ring-accent/30" : "border-border"
                }`}
              >
                <div className={`h-2 ${p.featured ? "bg-gold" : "bg-primary"}`} />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-11 w-11 rounded-lg bg-accent-soft grid place-items-center">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    {p.featured && (
                      <span className="text-[10px] uppercase tracking-widest text-accent-foreground bg-gold px-2 py-1 rounded font-bold">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="font-display text-xl font-bold text-primary mt-4">{p.title}</div>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> {p.date}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> {p.location}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> {p.spots}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed flex-1">{p.desc}</p>
                  <div className="flex items-center justify-between mt-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Fee</div>
                      <div className="font-display font-bold text-primary">{p.fee}</div>
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
    </>
  );
};

export default Festival;
