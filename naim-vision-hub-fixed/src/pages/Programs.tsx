import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcoming = [
  { title: "Leadership Bootcamp 2026", date: "12 June 2026", location: "UIA Gombak", spots: "80 spots", desc: "Three-day intensive on student leadership, public speaking and project management." },
  { title: "Career Fair Kelantan", date: "8 July 2026", location: "Kota Bharu Convention Centre", spots: "Open", desc: "Connect with 40+ employers across tech, finance, government and creative industries." },
  { title: "Cultural Night: Warisan", date: "22 August 2026", location: "Auditorium Negeri", spots: "300 spots", desc: "A celebration of Kelantanese music, dance and cuisine performed by student talents." },
];

const past = [
  { title: "Hackathon Mahasiswa", date: "March 2026", desc: "150 students built civic-tech solutions in 48 hours." },
  { title: "Charity Run KB", date: "January 2026", desc: "Raised RM 28,000 for flood-affected families." },
  { title: "Founders Summit", date: "November 2025", desc: "Featured 12 Kelantanese entrepreneurs sharing their journeys." },
];

const Programs = () => (
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
        <div className="grid md:grid-cols-3 gap-6">
          {upcoming.map((e) => (
            <article key={e.title} className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-elegant transition-all flex flex-col">
              <div className="h-2 bg-gold" />
              <div className="p-6 flex-1 flex flex-col">
                <div className="font-display text-xl font-bold text-primary">{e.title}</div>
                <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> {e.date}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> {e.location}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> {e.spots}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed flex-1">{e.desc}</p>
                <Button className="mt-6 w-full">Enroll / Register Now</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-secondary section-padding">
      <div className="container-tight">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-10">Past Highlights</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {past.map((e) => (
            <div key={e.title} className="p-6 bg-card rounded-xl border border-border">
              <div className="text-xs uppercase tracking-widest text-accent font-semibold">{e.date}</div>
              <div className="font-display text-lg font-bold text-primary mt-2">{e.title}</div>
              <p className="text-sm text-muted-foreground mt-2">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Programs;
