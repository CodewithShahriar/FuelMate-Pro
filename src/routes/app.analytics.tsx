import { createFileRoute } from "@tanstack/react-router";
import { monthlyTrend, efficiencyTrend, vehicles, fuelLogs } from "@/lib/mock-data";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { tooltipStyle } from "./app.dashboard";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — FuelMate Pro" }] }),
  component: Page,
});

function Page() {
  const compare = vehicles.map((v) => {
    const logs = fuelLogs.filter((l) => l.vehicleId === v.id);
    return {
      name: `${v.brand} ${v.model}`,
      mpg: +(logs.reduce((s, l) => s + l.mileage, 0) / Math.max(logs.length, 1)).toFixed(1),
      cost: +logs.reduce((s, l) => s + l.cost, 0).toFixed(0),
    };
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Insights</p>
        <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">Analytics</h1>
      </header>

      <div className="glass rounded-2xl p-5 shadow-card">
        <h3 className="font-display text-lg font-semibold mb-3">Fuel trend</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="aFuel" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.84 0.17 88)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.84 0.17 88)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area dataKey="fuel" stroke="oklch(0.84 0.17 88)" strokeWidth={2} fill="url(#aFuel)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-3">Vehicle comparison — efficiency</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={compare} layout="vertical">
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="mpg" fill="oklch(0.84 0.17 88)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-3">Weekly mileage</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={efficiencyTrend}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="week" stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line dataKey="mpg" stroke="oklch(0.78 0.16 155)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {compare.map((c) => (
          <div key={c.name} className="glass rounded-2xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground">{c.name}</p>
            <p className="mt-2 text-3xl font-display font-semibold">{c.mpg} <span className="text-sm text-muted-foreground">mpg avg</span></p>
            <p className="text-xs text-muted-foreground mt-1">Total fuel spend: <span className="text-foreground font-medium">${c.cost}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}