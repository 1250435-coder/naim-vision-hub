import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Program {
  id?: string;
  title: string;
  date: string;
  location: string;
  spots: string;
  desc: string;
  type: "upcoming" | "past";
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "programs")).then(snap => {
      setPrograms(snap.docs.map(d => ({ id: d.id, ...d.data() } as Program)));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground text-sm animate-pulse">Memuatkan...</div></div>;
  }

  const upcoming = programs.filter(p => p.type === "upcoming");
  const past = programs.filter(p => p.type === "past");

  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="container-tight py-24 max-w-3xl">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Programs & Events</span>
          <h1 className="font-display text-5xl md:text-6xl font-black mt-4">Where Students Grow</h1>
          <p className="mt-6 text-lg text-primary-foreground/85">
            Year-round programs designed to build skills, character and connections.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-10">Upcoming Programs</h2>
          {upcoming.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-5xl mb-4">📅</div>
              <p>Tiada program akan datang buat masa ini.</p>
              <p className="text-sm mt-2">Admin boleh tambah program melalui panel admin.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {upcoming.map((e) => (
                <article key={e.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-elegant transition-all flex flex-col">
                  <div className="h-2 bg-gold" />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="font-display text-xl font-bold text-primary">{e.title}</div>
                    <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {e.date && <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> {e.date}</div>}
                      {e.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> {e.location}</div>}
                      {e.spots && <div className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> {e.spots}</div>}
                    </div>
                    {e.desc && <p className="text-sm text-muted-foreground mt-4 leading-relaxed flex-1">{e.desc}</p>}
                    <Button className="mt-6 w-full">Enroll / Register Now</Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary section-padding">
        <div className="container-tight">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-10">Past Highlights</h2>
          {past.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Tiada rekod program lepas.</p>
              <p className="text-sm mt-2">Admin boleh tambah program lepas melalui panel admin.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {past.map((e) => (
                <div key={e.id} className="p-6 bg-card rounded-xl border border-border">
                  <div className="text-xs uppercase tracking-widest text-accent font-semibold">{e.date}</div>
                  <div className="font-display text-lg font-bold text-primary mt-2">{e.title}</div>
                  {e.desc && <p className="text-sm text-muted-foreground mt-2">{e.desc}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Programs;
