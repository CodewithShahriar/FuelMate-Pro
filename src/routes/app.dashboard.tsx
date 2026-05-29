import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import {
  DollarSign,
  Fuel,
  Gauge,
  Activity,
  Bell,
  Sparkles,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { totals, monthlyTrend, fuelLogs, reminders, vehicles, aiInsights } from "@/lib/mock-data";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FuelMate Pro" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Overview</p>
          <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">
            Good evening, Alex
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/app/fuel" className="glass rounded-xl px-4 py-2 text-sm hover:bg-accent/10">
            + Fuel log
          </Link>
          <Link to="/app/stats" className="glass rounded-xl px-4 py-2 text-sm hover:bg-accent/10">
            Stats
          </Link>
          <Link
            to="/app/expenses"
            className="bg-gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm shadow-glow hover:opacity-90"
          >
            + Expense
          </Link>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          index={0}
          label="Total fuel cost"
          value={`৳${totals.fuelCost.toFixed(0)}`}
          delta={-8}
          icon={DollarSign}
        />
        <StatCard
          index={1}
          label="Fuel volume"
          value={`${totals.liters.toFixed(1)} L`}
          delta={4}
          icon={Fuel}
        />
        <StatCard
          index={2}
          label="Avg efficiency"
          value={`${totals.efficiency} km/L`}
          delta={5}
          icon={Gauge}
        />
        <StatCard
          index={3}
          label="Total mileage"
          value={`${(totals.mileage / 1000).toFixed(1)}k km`}
          delta={2}
          icon={Activity}
        />
        <StatCard
          index={4}
          label="Health score"
          value={`${totals.health}/100`}
          delta={3}
          icon={Sparkles}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Expense breakdown
              </p>
              <h3 className="font-display text-lg font-semibold">Fuel spend, last 3 months</h3>
            </div>
            <Fuel className="h-4 w-4 text-primary" />
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={monthlyTrend.slice(-3)}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="oklch(0.7 0.02 250)"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="oklch(0.7 0.02 250)"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="fuel" fill="oklch(0.84 0.17 88)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Stats</p>
              <h3 className="font-display text-lg font-semibold">Deep details</h3>
            </div>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Fill-ups, costs, and distance summaries in one clean screen.
          </p>
          <div className="mt-5 space-y-2 text-sm">
            {["Fill-ups", "Costs", "Distance"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-xl bg-accent/5 px-3 py-2"
              >
                <span>{item}</span>
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </div>
            ))}
          </div>
          <Link
            to="/app/stats"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-primary px-4 py-2 text-sm text-primary-foreground shadow-glow hover:opacity-90"
          >
            Open Stats
          </Link>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold">Recent fuel logs</h3>
            <Link
              to="/app/fuel"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {fuelLogs.slice(0, 5).map((l) => {
              const v = vehicles.find((v) => v.id === l.vehicleId)!;
              return (
                <div key={l.id} className="py-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-primary/20 grid place-items-center">
                    <Fuel className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {v.brand} {v.model} · {l.station}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(l.date), "MMM d")} · {l.liters}L · {l.mileage} km/L
                    </p>
                  </div>
                  <p className="text-sm font-display font-semibold">৳{l.cost.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold">Upcoming services</h3>
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-3">
            {reminders.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-start gap-3">
                <span
                  className={`mt-1.5 h-2 w-2 rounded-full ${
                    r.priority === "high"
                      ? "bg-destructive"
                      : r.priority === "medium"
                        ? "bg-[oklch(0.82_0.16_70)]"
                        : "bg-[oklch(0.78_0.16_155)]"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {format(parseISO(r.dueDate), "MMM d")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="relative overflow-hidden glass-strong rounded-2xl p-6"
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-[0.06]" />
        <div className="relative flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">AI Insight</h3>
              <Link to="/app/assistant" className="text-xs text-primary hover:underline">
                More insights
              </Link>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{aiInsights[0].body}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const tooltipStyle = {
  background: "oklch(0.205 0.014 250)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "oklch(0.97 0.01 90)",
} as const;
