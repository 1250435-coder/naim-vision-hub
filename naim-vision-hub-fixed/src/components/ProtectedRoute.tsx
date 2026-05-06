import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | object | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  if (user === undefined) return <div className="min-h-screen bg-primary flex items-center justify-center"><div className="text-gold font-display text-xl">Loading...</div></div>;
  if (!user) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
