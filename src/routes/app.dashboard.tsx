import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { DollarSign, Fuel, Gauge, Activity, Bell, Sparkles, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  totals, monthlyTrend, efficiencyTrend, expenseBreakdown, fuelLogs, reminders, vehicles, aiInsights,
} from "@/lib/mock-data";
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
          <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">Good evening, Alex</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/app/fuel" className="glass rounded-xl px-4 py-2 text-sm hover:bg-accent/10">
            + Fuel log
          </Link>
          <Link to="/app/expenses" className="bg-gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm shadow-glow hover:opacity-90">
            + Expense
          </Link>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard index={0} label="Total fuel cost" value={`$${totals.fuelCost.toFixed(0)}`} delta={-8} icon={DollarSign} />
        <StatCard index={1} label="Monthly expense" value={`$${totals.monthlyExpense.toFixed(0)}`} delta={4} icon={Fuel} />
        <StatCard index={2} label="Avg efficiency" value={`${totals.efficiency} mpg`} delta={5} icon={Gauge} />
        <StatCard index={3} label="Total mileage" value={`${(totals.mileage / 1000).toFixed(1)}k km`} delta={2} icon={Activity} />
        <StatCard index={4} label="Health score" value={`${totals.health}/100`} delta={3} icon={Sparkles} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Spending trend</p>
              <h3 className="font-display text-lg font-semibold">Fuel vs expenses</h3>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Legend2 color="oklch(0.84 0.17 88)" label="Fuel" />
              <Legend2 color="oklch(0.75 0.13 200)" label="Expenses" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="gFuel" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.84 0.17 88)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.84 0.17 88)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.13 200)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.75 0.13 200)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="fuel" stroke="oklch(0.84 0.17 88)" strokeWidth={2} fill="url(#gFuel)" />
                <Area type="monotone" dataKey="expenses" stroke="oklch(0.75 0.13 200)" strokeWidth={2} fill="url(#gExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-5 shadow-card"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Expense breakdown</p>
          <h3 className="font-display text-lg font-semibold">By category</h3>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" innerRadius={50} outerRadius={80} stroke="none">
                  {expenseBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {expenseBreakdown.slice(0, 4).map((e) => (
              <div key={e.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                  {e.name}
                </span>
                <span className="text-muted-foreground">${e.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold">Recent fuel logs</h3>
            <Link to="/app/fuel" className="text-xs text-primary hover:underline flex items-center gap-1">
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
                    <p className="text-sm font-medium truncate">{v.brand} {v.model} · {l.station}</p>
                    <p className="text-xs text-muted-foreground">{format(parseISO(l.date), "MMM d")} · {l.liters}L · {l.mileage} mpg</p>
                  </div>
                  <p className="text-sm font-display font-semibold">${l.cost.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold">Upcoming services</h3>
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-3">
            {reminders.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 rounded-full ${
                  r.priority === "high" ? "bg-destructive" :
                  r.priority === "medium" ? "bg-[oklch(0.82_0.16_70)]" : "bg-[oklch(0.78_0.16_155)]"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">Due {format(parseISO(r.dueDate), "MMM d")}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-5 shadow-card"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Weekly efficiency</p>
            <h3 className="font-display text-lg font-semibold">Fuel economy trend</h3>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer>
            <BarChart data={efficiencyTrend}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="week" stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="mpg" fill="oklch(0.84 0.17 88)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
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
              <Link to="/app/assistant" className="text-xs text-primary hover:underline">More insights</Link>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{aiInsights[0].body}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Legend2({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export const tooltipStyle = {
  background: "oklch(0.205 0.014 250)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "oklch(0.97 0.01 90)",
} as const;