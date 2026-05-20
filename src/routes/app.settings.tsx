import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — FuelMate Pro" }] }),
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Preferences</p>
        <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">Settings</h1>
      </header>

      <Section title="General" desc="App-wide preferences.">
        <Row label="Units">
          <select className="glass h-10 rounded-md px-3 text-sm bg-card border border-border/60">
            <option>Metric (km, L)</option>
            <option>Imperial (mi, gal)</option>
          </select>
        </Row>
        <Row label="Currency">
          <select className="glass h-10 rounded-md px-3 text-sm bg-card border border-border/60">
            <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
          </select>
        </Row>
        <Row label="Theme">
          <span className="text-sm text-muted-foreground">Dark (default)</span>
        </Row>
      </Section>

      <Section title="Notifications" desc="What we should remind you about.">
        {["Service reminders", "Weekly summary", "AI insights", "Price alerts"].map((n) => (
          <Row key={n} label={n}>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-gradient-primary transition-colors" />
              <span className="absolute left-1 top-1 h-4 w-4 bg-background rounded-full transition-transform peer-checked:translate-x-4" />
            </label>
          </Row>
        ))}
      </Section>

      <Section title="Data" desc="Manage your data.">
        <div className="flex gap-2">
          <Button variant="outline" className="glass border-border/60 rounded-xl">Export all data</Button>
          <Button variant="outline" className="rounded-xl border-destructive/30 text-destructive">Delete account</Button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{desc}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <p className="text-sm">{label}</p>
      {children}
    </div>
  );
}