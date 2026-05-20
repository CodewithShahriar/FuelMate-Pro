import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, SocialRow } from "@/components/AuthShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — FuelMate Pro" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your FuelMate Pro account."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">Create one</Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/app/dashboard" });
        }}
      >
        <Field icon={Mail} type="email" placeholder="you@example.com" label="Email" />
        <Field icon={Lock} type="password" placeholder="••••••••" label="Password" />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="accent-primary" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot?</Link>
        </div>
        <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
          Sign in
        </Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or continue with <div className="flex-1 h-px bg-border" />
        </div>
        <SocialRow />
      </form>
    </AuthShell>
  );
}

function Field({
  icon: Icon,
  label,
  ...rest
}: { icon: typeof Mail; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1 relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9 h-11 glass border-border/60" {...rest} />
      </div>
    </div>
  );
}