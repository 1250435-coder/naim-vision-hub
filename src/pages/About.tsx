import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AboutSettings {
  aboutHeroTitle: string;
  aboutHeroSubtitle: string;
  aboutStory1: string;
  aboutStory2: string;
  aboutStructure: string; // newline-separated list
  aboutValues: string; // JSON array [{t, d}]
}

const About = () => {
  const [s, setS] = useState<AboutSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, "settings", "about")).then(d => {
      if (d.exists()) setS(d.data() as AboutSettings);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground text-sm animate-pulse">Memuatkan...</div></div>;
  }

  if (!s || !s.aboutHeroTitle) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-6">📖</div>
        <h2 className="font-display text-3xl font-bold text-primary mb-3">Halaman About Belum Dikonfigurasi</h2>
        <p className="text-muted-foreground max-w-md mb-6">Log masuk ke panel admin untuk menambah kandungan halaman About.</p>
        <Button asChild variant="outline"><Link to="/admin">Log Masuk Admin</Link></Button>
      </div>
    );
  }

  const structure = s.aboutStructure ? s.aboutStructure.split("\n").filter(Boolean) : [];
  let values: { t: string; d: string }[] = [];
  try { values = s.aboutValues ? JSON.parse(s.aboutValues) : []; } catch {}

  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="container-tight py-24 md:py-32 max-w-3xl">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">About NAIM</span>
          <h1 className="font-display text-5xl md:text-6xl font-black mt-4">{s.aboutHeroTitle}</h1>
          {s.aboutHeroSubtitle && (
            <p className="mt-6 text-lg text-primary-foreground/85 leading-relaxed">{s.aboutHeroSubtitle}</p>
          )}
        </div>
      </section>

      {(s.aboutStory1 || s.aboutStory2 || structure.length > 0) && (
        <section className="section-padding">
          <div className="container-tight grid md:grid-cols-2 gap-12 items-start">
            {(s.aboutStory1 || s.aboutStory2) && (
              <div>
                {s.aboutStory1 && <p className="text-muted-foreground leading-relaxed mb-4">{s.aboutStory1}</p>}
                {s.aboutStory2 && <p className="text-muted-foreground leading-relaxed">{s.aboutStory2}</p>}
              </div>
            )}
            {structure.length > 0 && (
              <div className="bg-secondary rounded-2xl p-8 border border-border">
                <h3 className="font-display text-xl font-bold text-primary mb-5">Organizational Structure</h3>
                <ul className="space-y-3 text-sm">
                  {structure.map((row) => (
                    <li key={row} className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-foreground">{row}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {values.length > 0 && (
        <section className="bg-secondary section-padding">
          <div className="container-tight">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs tracking-[0.3em] uppercase text-accent font-semibold">What We Stand For</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-3">Core Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.t} className="p-7 bg-card rounded-xl border border-border shadow-card">
                  <div className="font-display text-xl font-bold text-primary mb-2">{v.t}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default About;
