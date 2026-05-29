import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { vehicles, fuelLogs, expenses, reminders } from "@/lib/mock-data";
import { ArrowLeft, Fuel, DollarSign, Gauge, Bell } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { tooltipStyle } from "./app.dashboard";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/app/vehicles/$id")({
  head: () => ({ meta: [{ title: "Vehicle — FuelMate Pro" }] }),
  component: VehiclePage,
});

function VehiclePage() {
  const { id } = Route.useParams();
  const v = vehicles.find((x) => x.id === id);
  if (!v) throw notFound();
  const logs = fuelLogs.filter((l) => l.vehicleId === id);
  const exps = expenses.filter((e) => e.vehicleId === id);
  const rems = reminders.filter((r) => r.vehicleId === id);

  const chart = logs
    .slice()
    .reverse()
    .map((l) => ({ date: format(parseISO(l.date), "MMM d"), kmPerLiter: l.mileage, cost: l.cost }));

  return (
    <div className="space-y-6">
      <Link to="/app/vehicles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to garage
      </Link>

      <div className="relative overflow-hidden rounded-3xl glass shadow-elegant">
        <div className="aspect-[21/9] relative">
          <img src={v.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{v.fuelType}</p>
            <h1 className="mt-1 text-4xl font-display font-semibold tracking-tight">
              {v.brand} {v.model}
            </h1>
            <p className="text-muted-foreground">{v.year} · {v.color} · {v.plate}</p>
          </div>
          <div className="glass-strong rounded-2xl px-5 py-3">
            <p className="text-xs text-muted-foreground">Health score</p>
            <p className="text-3xl font-display font-semibold text-gradient">{v.healthScore}<span className="text-muted-foreground text-lg">/100</span></p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <Mini label="Odometer" value={`${v.odometer.toLocaleString()} km`} icon={Gauge} />
        <Mini label="Total fuel" value={`$${logs.reduce((s, l) => s + l.cost, 0).toFixed(0)}`} icon={Fuel} />
        <Mini label="Total expenses" value={`$${exps.reduce((s, e) => s + e.amount, 0).toFixed(0)}`} icon={DollarSign} />
        <Mini label="Reminders" value={`${rems.length}`} icon={Bell} />
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-lg font-semibold mb-3">Efficiency performance</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="gKmPerLiter" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.84 0.17 88)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.84 0.17 88)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="kmPerLiter" stroke="oklch(0.84 0.17 88)" strokeWidth={2} fill="url(#gKmPerLiter)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold mb-3">Recent fuel logs</h3>
          <div className="divide-y divide-border/50">
            {logs.slice(0, 6).map((l) => (
              <div key={l.id} className="py-2.5 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{l.station}</p>
                  <p className="text-xs text-muted-foreground">{format(parseISO(l.date), "MMM d")} · {l.liters}L</p>
                </div>
                <p className="font-display font-semibold">${l.cost.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold mb-3">Upcoming reminders</h3>
          {rems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reminders for this vehicle.</p>
          ) : (
            <div className="space-y-3">
              {rems.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.type}</p>
                  </div>
                  <p className="text-xs">{format(parseISO(r.dueDate), "MMM d")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Fuel }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-primary/15 grid place-items-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display font-semibold">{value}</p>
      </div>
    </div>
  );
}
