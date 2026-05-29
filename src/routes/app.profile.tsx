import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — FuelMate Pro" }] }),
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Account</p>
        <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">Profile</h1>
      </header>

      <div className="glass rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center text-2xl font-display font-semibold shadow-glow">
            AM
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Alex Morgan</h2>
            <p className="text-sm text-muted-foreground">alex@fuelmate.pro · Pro plan</p>
            <Button variant="outline" size="sm" className="mt-2 glass border-border/60 rounded-lg">
              Upload photo
            </Button>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 shadow-card grid sm:grid-cols-2 gap-4">
        <Fld label="Full name" defaultValue="Alex Morgan" />
        <Fld label="Email" defaultValue="alex@fuelmate.pro" type="email" />
        <Fld label="Phone" defaultValue="+1 555 010 2030" />
        <Fld label="Location" defaultValue="San Francisco, CA" />
        <div className="sm:col-span-2 flex justify-end">
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-glow">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function Fld({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <Input className="glass mt-1 h-11 border-border/60" {...rest} />
    </div>
  );
}
