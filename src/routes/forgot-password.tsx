import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  },
  head: () => ({ meta: [{ title: "Reset password — FuelMate Pro" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a secure reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="glass rounded-xl p-5 text-sm">
          Check your inbox — if an account exists, a reset link is on its way.
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 h-11 glass border-border/60"
                type="email"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
          >
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
