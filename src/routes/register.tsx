import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — FuelMate Pro" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { signUp, loading, error } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    const res = await signUp(email, password, fullName);
    if (res.success) {
      if (res.session) {
        navigate({ to: "/app/dashboard" });
      } else {
        setSuccessMsg("Account created! You can now sign in.");
        setTimeout(() => navigate({ to: "/login" }), 1500);
      }
    } else {
      setLocalError(res.error || "Failed to create account");
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up to sync your Apache 4v or vehicle data safely in your own account."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {(localError || error) && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        <div>
          <label className="text-xs text-muted-foreground">Full name (Optional)</label>
          <div className="mt-1 relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g. Abid Shahriar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-9 h-11 glass border-border/60"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 h-11 glass border-border/60"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Password</label>
          <div className="mt-1 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 h-11 glass border-border/60"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow font-bold"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-[11px] text-muted-foreground text-center">
          Existing local records will be automatically migrated to your new account.
        </p>
      </form>
    </AuthShell>
  );
}
