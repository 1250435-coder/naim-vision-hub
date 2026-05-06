import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Subject required").max(150),
  message: z.string().trim().min(5, "Message too short").max(1500),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    toast.success("Message sent! We'll get back to you within 2 working days.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="container-tight py-20 max-w-3xl">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Get in Touch</span>
          <h1 className="font-display text-5xl md:text-6xl font-black mt-4">Let's Talk</h1>
          <p className="mt-4 text-primary-foreground/85">Sponsorship, partnerships, media or membership — we'd love to hear from you.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-6">
            {[
              { Icon: MapPin, t: "Visit", d: "NAIM USIM OFFICIAL, Universiti Sains Islam Malaysia (USIM), Bandar Baru Nilai, 71800 Nilai, Negeri Sembilan" },
              { Icon: Mail, t: "Email", d: "hello@naim.org.my" },
              { Icon: Phone, t: "Phone", d: "+60 9-123 4567" },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent-soft grid place-items-center shrink-0">
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-display font-bold text-primary">{t}</div>
                  <div className="text-sm text-muted-foreground mt-1">{d}</div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="md:col-span-3 bg-card border border-border rounded-2xl p-8 shadow-card space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={150} />
              {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1500} />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full bg-gold text-accent-foreground hover:opacity-90 font-semibold">Send Message</Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
