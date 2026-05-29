import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { AuthShell, SocialRow } from "@/components/AuthShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  },
  head: () => ({ meta: [{ title: "Create account — FuelMate Pro" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking smarter in under 60 seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
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
        <Field icon={User} type="text" placeholder="Alex Morgan" label="Full name" />
        <Field icon={Mail} type="email" placeholder="you@example.com" label="Email" />
        <Field icon={Lock} type="password" placeholder="At least 8 characters" label="Password" />
        <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
          Create account
        </Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or continue with <div className="flex-1 h-px bg-border" />
        </div>
        <SocialRow />
        <p className="text-[11px] text-muted-foreground text-center">
          By signing up you agree to our Terms and Privacy Policy.
        </p>
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
