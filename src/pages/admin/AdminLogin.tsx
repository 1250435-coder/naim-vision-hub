import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login berjaya!");
      navigate("/admin/dashboard");
    } catch {
      toast.error("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-elegant p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-2xl mb-4">
            <span className="font-display text-2xl font-black text-primary">N</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-primary">Admin NAIM USIM</h1>
          <p className="text-muted-foreground text-sm mt-1">Log masuk untuk urus website</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="admin@naimusim.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-primary block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="••••••••"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gold text-accent-foreground hover:opacity-90 font-semibold"
            disabled={loading}
          >
            {loading ? "Loading..." : "Log Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
