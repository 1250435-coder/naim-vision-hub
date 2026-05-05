import { CheckCircle2 } from "lucide-react";

const values = [
  { t: "Integrity", d: "Transparent governance and ethical leadership in every initiative." },
  { t: "Excellence", d: "Pursuing the highest standards in academics, advocacy and service." },
  { t: "Unity", d: "One identity, one community — across every campus in Malaysia." },
  { t: "Heritage", d: "Honoring Kelantanese culture as the foundation of our progress." },
  { t: "Innovation", d: "Embracing modern tools to amplify student impact." },
  { t: "Service", d: "Putting community welfare above personal gain." },
];

const About = () => (
  <>
    <section className="bg-hero text-primary-foreground">
      <div className="container-tight py-24 md:py-32 max-w-3xl">
        <span className="text-xs tracking-[0.3em] uppercase text-gold">About NAIM</span>
        <h1 className="font-display text-5xl md:text-6xl font-black mt-4">Our Story</h1>
        <p className="mt-6 text-lg text-primary-foreground/85 leading-relaxed">
          Founded in 2009, NAIM (Persatuan Mahasiswa Kelantan) is the national umbrella body uniting Kelantanese students across Malaysia's universities — a movement built on heritage, leadership and excellence.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-tight grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-5">A movement, not just an association.</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            What began as a small circle of Kelantanese students has grown into a national network of more than 5,000 active members across 30+ university chapters. NAIM represents student voice with maturity and purpose, working closely with state authorities, alumni, and industry partners.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Through scholarships, leadership academies and signature events like Festival Mahasiswa Kelantan, we equip our members to thrive — and to bring that excellence home to Kelantan.
          </p>
        </div>
        <div className="bg-secondary rounded-2xl p-8 border border-border">
          <h3 className="font-display text-xl font-bold text-primary mb-5">Organizational Structure</h3>
          <ul className="space-y-3 text-sm">
            {[
              "Central Executive Committee (EXCO)",
              "Board of Trustees & Advisors",
              "State University Chapter Heads",
              "Bureaus: Education, Welfare, Culture, Enterprise",
              "Alumni Council & Industry Partners",
            ].map((row) => (
              <li key={row} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground">{row}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

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
  </>
);

export default About;
